"""Celery tasks for HireSense job scanning and match analysis."""
import logging
from datetime import date, timedelta

from celery import shared_task
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone

from .job_sources.registry import fetch_jobs_for_site
from .models import JobMatch, JobPosting, JobSite, Resume

User = get_user_model()
logger = logging.getLogger(__name__)


def _upsert_job_posting(raw_job) -> JobPosting | None:
    """Create or update JobPosting; return instance or None on duplicate."""
    try:
        obj, created = JobPosting.objects.update_or_create(
            source=raw_job.source,
            external_url=raw_job.external_url,
            defaults={
                "title": raw_job.title,
                "company": raw_job.company,
                "location": raw_job.location or "",
                "salary": raw_job.salary or "",
                "description": raw_job.description or "",
                "posted_date": raw_job.posted_date,
                "logo": raw_job.logo or "",
                "raw_data": raw_job.raw_data or {},
            },
        )
        return obj
    except Exception as e:
        logger.exception("Failed to upsert job posting: %s", e)
        return None


@shared_task(bind=True, name="core.tasks.scan_job_site")
def scan_job_site(self, site_id: int) -> dict:
    """Fetch jobs for a single JobSite and store as JobPostings."""
    try:
        site = JobSite.objects.get(pk=site_id)
    except JobSite.DoesNotExist:
        return {"error": "Site not found", "site_id": site_id}

    if not site.enabled:
        return {"site_id": site_id, "skipped": True, "reason": "disabled"}

    result = fetch_jobs_for_site(site)
    if result.error:
        return {"site_id": site_id, "error": result.error, "fetched": 0}

    stored = 0
    for raw in result.jobs:
        obj = _upsert_job_posting(raw)
        if obj is not None:
            stored += 1

    return {
        "site_id": site_id,
        "fetched": result.fetched_count,
        "stored": stored,
        "source": site.name,
    }


def _run_scan_site(site_id: int) -> dict:
    """Synchronous scan for a single site (logic from scan_job_site)."""
    try:
        site = JobSite.objects.get(pk=site_id)
    except JobSite.DoesNotExist:
        return {"error": "Site not found", "site_id": site_id}
    if not site.enabled:
        return {"site_id": site_id, "skipped": True, "reason": "disabled"}
    result = fetch_jobs_for_site(site)
    if result.error:
        return {"site_id": site_id, "error": result.error, "fetched": 0}
    stored = 0
    for raw in result.jobs:
        obj = _upsert_job_posting(raw)
        if obj is not None:
            stored += 1
    return {"site_id": site_id, "fetched": result.fetched_count, "stored": stored, "source": site.name}


def _run_scan_all() -> dict:
    """Synchronous scan of all enabled job sites (no Celery)."""
    from .builtin_job_sites import ensure_builtin_job_sites
    ensure_builtin_job_sites()
    sites = JobSite.objects.filter(enabled=True)
    total_fetched = 0
    total_stored = 0
    errors = []
    for site in sites:
        r = _run_scan_site(site.id)
        if r.get("error"):
            errors.append({"site": site.name, "error": r["error"]})
        else:
            total_fetched += r.get("fetched", 0)
            total_stored += r.get("stored", 0)
    return {
        "sites_scanned": sites.count(),
        "total_fetched": total_fetched,
        "total_stored": total_stored,
        "errors": errors,
    }


@shared_task(bind=True, name="core.tasks.scan_all_job_sites")
def scan_all_job_sites(self) -> dict:
    """Fetch jobs for all enabled JobSites (built-in and user-added)."""
    return _run_scan_all()


# Jobs fetched for the user's profession (AI-derived); only these are used for matching
SOURCE_RESUME_BASED = "Indeed (Resume)"
SOURCE_WWR_RESUME = "We Work Remotely (Resume)"
ACCEPTED_RESUME_SOURCES = (SOURCE_RESUME_BASED, SOURCE_WWR_RESUME)
# Skip re-fetch when we already have recent profession-based jobs (e.g. in chunk loop)
RESUME_FETCH_FRESH_MINUTES = 5

WWR_PROGRAMMING_RSS = "https://weworkremotely.com/categories/remote-programming-jobs.rss"


def _is_developer_profession(profession: str) -> bool:
    """True if the profession is software/developer/tech so we can fall back to WWR programming jobs."""
    if not profession or profession.lower() == "jobs":
        return False
    p = profession.lower()
    return any(
        k in p
        for k in (
            "developer", "engineer", "software", "programmer", "front end", "frontend",
            "backend", "full stack", "fullstack", "web dev", "programming", "dev ",
        )
    )


def _fetch_wwr_programming_jobs() -> int:
    """Fetch We Work Remotely programming jobs. Returns count stored. Used as fallback when Indeed returns 0 for devs."""
    from .job_sources.registry import get_fetcher
    fetcher = get_fetcher(
        source_type="rss",
        url=WWR_PROGRAMMING_RSS,
        source_name=SOURCE_WWR_RESUME,
        config={},
    )
    result = fetcher.fetch()
    if result.error:
        logger.warning("WWR (Resume) fetch failed: %s", result.error)
        return 0
    stored = sum(1 for raw in result.jobs if _upsert_job_posting(raw) is not None)
    if stored:
        logger.info("Fetched %d We Work Remotely (Resume) jobs as fallback for developer profession.", stored)
    return stored


def _get_current_resume(user):
    """Return the user's current resume (primary if set, otherwise latest by uploaded_at)."""
    profile = getattr(user, "profile", None)
    if profile and getattr(profile, "primary_resume_id", None):
        r = Resume.objects.filter(user=user, pk=profile.primary_resume_id).first()
        if r:
            return r
    return Resume.objects.filter(user=user).order_by("-uploaded_at").first()


def _fetch_indeed_jobs_for_user(user_id: int, query_override: str | None = None) -> dict:
    """
    Fetch Indeed jobs using a single search query. If query_override is set (e.g. AI-derived
    profession), use it; otherwise derive from resume. Every job stored comes from this fetch.
    """
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return {"error": "User not found", "stored": 0}
    resume = _get_current_resume(user)
    if not resume and not query_override:
        return {"stored": 0}
    from .job_sources.registry import get_fetcher
    from .resume_utils import get_job_search_query

    query = (query_override or (get_job_search_query(resume) if resume else "") or "jobs").strip() or "jobs"
    fetcher = get_fetcher(
        source_type="indeed",
        url="",
        source_name=SOURCE_RESUME_BASED,
        config={"keywords": query, "location": "Remote"},
    )
    result = fetcher.fetch()
    if result.error:
        if "SAXParseException" in result.error or "Parse error" in (result.error or ""):
            logger.info("Indeed (Resume) returned non-RSS for user %s (q=%s); skipping.", user_id, query)
        else:
            logger.warning("Indeed (Resume) fetch failed for user %s (q=%s): %s", user_id, query, result.error)
        return {"query": query, "stored": 0}
    stored = sum(1 for raw in result.jobs if _upsert_job_posting(raw) is not None)
    if stored:
        logger.info("Fetched %d Indeed (Resume) jobs for user %s (query=%s)", stored, user_id, query)
    return {"query": query, "stored": stored}


def _run_match_analysis_for_user(user_id: int) -> dict:
    """Run match analysis for a user: fetch latest resume, match against recent JobPostings."""
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return {"error": "User not found"}

    resume = _get_current_resume(user)
    if not resume or not resume.raw_text:
        return {"error": "No resume with text"}

    from ai.profession import get_profession_for_job_search

    # AI reviews document and determines profession; we fetch only for that profession
    resume_text = resume.raw_text
    profession = get_profession_for_job_search(resume_text)
    fetch_result = _fetch_indeed_jobs_for_user(user_id, query_override=profession)
    # If Indeed returned no jobs and profession is developer/tech, fall back to We Work Remotely programming
    if fetch_result.get("stored", 0) == 0 and _is_developer_profession(profession):
        _fetch_wwr_programming_jobs()
    # Only match against jobs from profession-based fetches (Indeed or WWR fallback)
    recent = JobPosting.objects.filter(source__in=ACCEPTED_RESUME_SOURCES).order_by("-fetched_at")[:15]

    from django.conf import settings

    from ai.job_matcher import match_resume_to_job
    from ai.interview_predictor import estimate_interview_probability

    provider = getattr(settings, "AI_PROVIDER", "openai") or "openai"
    groq_pace_seconds = 5 if provider == "groq" else 0
    groq_between_calls = 3 if provider == "groq" else 0

    import time
    created = 0
    for jp in recent:
        if not jp.description:
            continue
        if JobMatch.objects.filter(user=user, job_posting=jp).exists():
            continue

        job_desc = f"Job title: {jp.title or 'N/A'}\n\n{jp.description or ''}"
        match_result = match_resume_to_job(resume_text, job_desc)
        if not match_result or match_result["match_score"] < 25:
            if groq_pace_seconds:
                time.sleep(groq_pace_seconds)
            continue

        if groq_between_calls:
            time.sleep(groq_between_calls)
        prob_result = estimate_interview_probability(match_result)
        prob = prob_result["interview_probability"] if prob_result else 0

        JobMatch.objects.create(
            user=user,
            job_posting=jp,
            job_site=None,
            title=jp.title,
            company=jp.company,
            location=jp.location,
            salary=jp.salary,
            posted_date=jp.posted_date,
            external_url=jp.external_url,
            logo=jp.logo,
            source=jp.source,
            match_score=match_result["match_score"],
            interview_probability=prob,
            skills=match_result.get("matched_skills", []),
            missing_skills=match_result.get("missing_skills", []),
        )
        created += 1
        if groq_pace_seconds:
            time.sleep(groq_pace_seconds)

    return {"user_id": user_id, "matches_created": created}


def _run_match_analysis_chunk(user_id: int, chunk_size: int = 3) -> dict:
    """
    Process up to chunk_size jobs and return created matches + has_more.
    Used for progressive rendering.
    """
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return {"error": "User not found"}

    resume = _get_current_resume(user)
    if not resume or not resume.raw_text:
        return {"error": "No resume with text"}

    from ai.profession import get_profession_for_job_search

    resume_text = resume.raw_text
    # Fetch only when we don't have recent profession-based jobs (avoid re-fetch on every chunk)
    has_recent = JobPosting.objects.filter(
        source__in=ACCEPTED_RESUME_SOURCES,
        fetched_at__gte=timezone.now() - timedelta(minutes=RESUME_FETCH_FRESH_MINUTES),
    ).exists()
    if not has_recent:
        profession = get_profession_for_job_search(resume_text)
        fetch_result = _fetch_indeed_jobs_for_user(user_id, query_override=profession)
        if fetch_result.get("stored", 0) == 0 and _is_developer_profession(profession):
            _fetch_wwr_programming_jobs()
    # Only match against jobs from profession-based fetches (Indeed or WWR fallback)
    recent = JobPosting.objects.filter(source__in=ACCEPTED_RESUME_SOURCES).order_by("-fetched_at")[:50]

    from django.conf import settings

    from ai.job_matcher import match_resume_to_job
    from ai.interview_predictor import estimate_interview_probability

    provider = getattr(settings, "AI_PROVIDER", "openai") or "openai"
    groq_pace_seconds = 5 if provider == "groq" else 0
    groq_between_calls = 3 if provider == "groq" else 0

    import time

    created_matches = []
    processed = 0
    for jp in recent:
        if processed >= chunk_size:
            break
        if not jp.description:
            continue
        if JobMatch.objects.filter(user=user, job_posting=jp).exists():
            continue

        job_desc = f"Job title: {jp.title or 'N/A'}\n\n{jp.description or ''}"
        match_result = match_resume_to_job(resume_text, job_desc)
        if not match_result or match_result["match_score"] < 25:
            if groq_pace_seconds:
                time.sleep(groq_pace_seconds)
            continue

        if groq_between_calls:
            time.sleep(groq_between_calls)
        prob_result = estimate_interview_probability(match_result)
        prob = prob_result["interview_probability"] if prob_result else 0

        obj = JobMatch.objects.create(
            user=user,
            job_posting=jp,
            job_site=None,
            title=jp.title,
            company=jp.company,
            location=jp.location,
            salary=jp.salary,
            posted_date=jp.posted_date,
            external_url=jp.external_url,
            logo=jp.logo,
            source=jp.source,
            match_score=match_result["match_score"],
            interview_probability=prob,
            skills=match_result.get("matched_skills", []),
            missing_skills=match_result.get("missing_skills", []),
        )
        created_matches.append(obj)
        processed += 1
        if groq_pace_seconds:
            time.sleep(groq_pace_seconds)

    # If we got a full chunk, there are likely more unmatched jobs
    has_more = processed == chunk_size

    return {"matches": created_matches, "has_more": has_more}


@shared_task(bind=True, name="core.tasks.run_match_analysis_for_user")
def run_match_analysis_for_user(self, user_id: int) -> dict:
    """Run match analysis for a single user (async)."""
    return _run_match_analysis_for_user(user_id)


@shared_task(bind=True, name="core.tasks.run_match_analysis_for_all_users")
def run_match_analysis_for_all_users(self) -> dict:
    """Run match analysis for all users with resumes."""
    users_with_resumes = User.objects.filter(
        resumes__raw_text__isnull=False,
    ).distinct()
    total = 0
    for user in users_with_resumes:
        r = _run_match_analysis_for_user(user.id)
        total += r.get("matches_created", 0)
    return {"users_processed": users_with_resumes.count(), "total_matches": total}
