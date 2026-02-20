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


def _is_remote_job(raw_job) -> bool:
    """Return True when the job posting is clearly remote."""
    if not raw_job:
        return False
    title = (raw_job.title or "").lower()
    location = (raw_job.location or "").lower()
    description = (raw_job.description or "").lower()
    source = (raw_job.source or "").lower()

    text = " ".join([title, location, description])

    positive = (
        "remote",
        "work from home",
        "work-from-home",
        "wfh",
        "telecommute",
        "distributed",
        "anywhere",
        "home-based",
    )
    negative = (
        "on-site",
        "onsite",
        "in office",
        "in-office",
        "office-based",
        "hybrid",
    )

    has_positive = any(k in text for k in positive)
    has_negative = any(k in text for k in negative)

    if has_negative and not has_positive:
        return False
    if has_positive:
        return True

    remote_sources = (
        "remote",
        "remotive",
        "we work remotely",
        "remote.ok",
        "justremote",
    )
    return any(k in source for k in remote_sources)


def _upsert_job_posting(raw_job) -> JobPosting | None:
    """Create or update JobPosting; return instance or None on duplicate."""
    try:
        if not _is_remote_job(raw_job):
            return None
        logger.info(f"_upsert_job_posting: raw_job={raw_job}, source={raw_job.source}, external_url={raw_job.external_url}")
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
                "fetched_at": timezone.now(),  # Always update fetched timestamp
            },
        )
        logger.info(f"_upsert_job_posting: created={created}, obj={obj.id if obj else None}")
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


@shared_task(bind=True, name="core.tasks.scan_all_job_sites_limited")
def scan_all_job_sites_limited(self) -> dict:
    """Fetch jobs for all enabled JobSites with per-source limits and early stopping."""
    return _run_scan_all_limited(max_results_per_source=3, max_total=30)


# Skip re-fetch when we already have recent profession-based jobs (e.g. in chunk loop)
RESUME_FETCH_FRESH_MINUTES = 5

WWR_PROGRAMMING_RSS = "https://weworkremotely.com/categories/remote-programming-jobs.rss"


def _get_enabled_job_source_names() -> tuple:
    """Get all enabled job source names from the database."""
    sources = JobSite.objects.filter(enabled=True).values_list("name", flat=True)
    return tuple(sources)


def _run_scan_site_limited(site_id: int, max_results: int = 3) -> dict:
    """Synchronous scan for a single site with result limit."""
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
    # Apply result limit per source
    limited_jobs = result.jobs[:max_results]
    for raw in limited_jobs:
        obj = _upsert_job_posting(raw)
        if obj is not None:
            stored += 1
    return {"site_id": site_id, "fetched": result.fetched_count, "stored": stored, "source": site.name}


def _run_scan_all_limited(max_results_per_source: int = 3, max_total: int = 30) -> dict:
    """Scan only reliable job sites with per-source limits and early stopping."""
    from .builtin_job_sites import ensure_builtin_job_sites
    ensure_builtin_job_sites()
    
    # Whitelist of sources we know work
    RELIABLE_SOURCES = {
        "Remotive",
        "We Work Remotely",
        "We Work Remotely - Design", 
        "We Work Remotely - Marketing",
        "We Work Remotely - Sales",
        # Add others as their APIs improve
    }
    
    sites = JobSite.objects.filter(enabled=True, name__in=RELIABLE_SOURCES)
    total_fetched = 0
    total_stored = 0
    errors = []
    for site in sites:
        r = _run_scan_site_limited(site.id, max_results=max_results_per_source)
        if r.get("error"):
            errors.append({"site": site.name, "error": r["error"]})
        else:
            total_fetched += r.get("fetched", 0)
            total_stored += r.get("stored", 0)
        
        # Early stop if we have enough total results
        if total_stored >= max_total:
            logger.info("Reached max_total=%d jobs, stopping scan early", max_total)
            break
    
    return {
        "sites_scanned": sites.count(),
        "total_fetched": total_fetched,
        "total_stored": total_stored,
        "errors": errors,
    }


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
        source_name="We Work Remotely",
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


def _fetch_indeed_jobs_for_user(user_id: int, query_override: str | None = None, auto_trigger_analysis: bool = True) -> dict:
    """
    Fetch jobs with profession-aware query using curated sources.
    Complements the bulk scan with targeted fetching based on resume profession.
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
    
    profession = None
    industry = "general"
    
    # AI-powered profession detection
    if not query_override:
        try:
            from ai.profession import get_profession_and_industry
            profession, industry = get_profession_and_industry(resume.raw_text if resume else "")
            logger.info("AI profession detection for user %s: profession='%s', industry='%s'", user_id, profession, industry)
        except Exception as e:
            logger.warning("AI profession detection failed for user %s: %s, falling back to resume parsing", user_id, e)
            try:
                profession = get_job_search_query(resume) if resume else None
                logger.info("Resume parsing fallback for user %s: profession='%s'", user_id, profession)
            except Exception as e2:
                logger.warning("Resume parsing also failed for user %s: %s", user_id, e2)
                profession = None
    
    # Final query construction with multiple fallbacks
    query = (query_override or profession or "jobs").strip()
    if not query or query == "jobs":
        logger.warning("No specific profession detected for user %s, using generic 'jobs' query", user_id)
    else:
        logger.info("Using search query '%s' for user %s (industry=%s)", query, user_id, industry)

    # Build list of profession-aware sources (Remotive + specialized for tech)
    candidates = []
    
    # Always try Remotive first with profession query (fastest, free, no rate limit issues)
    candidates.append({
        "source_type": "remotive",
        "source_name": "Remotive",
        "config": {"keywords": query},
        "max_results": 5
    })
    
    # Only add tech job sources for recognized tech/dev professions
    tech_industries = {"software", "tech", "developer", "engineering"}
    if industry and industry.lower() in tech_industries:
        logger.info("Adding We Work Remotely (programming) for user %s due to tech industry: %s", user_id, industry)
        candidates.append({
            "source_type": "rss",
            "source_name": "We Work Remotely",
            "url": WWR_PROGRAMMING_RSS,
            "config": {},
            "max_results": 5
        })
    elif query and query.lower() != "jobs":
        logger.info("Not adding tech-only sources for user %s (industry='%s', query='%s')", user_id, industry or "unknown", query)
    
    total_stored = 0
    MIN_RESULTS_TO_STOP = 5  # Stop once we have decent results
    
    for c in candidates:
        try:
            url = c.get("url", "")
            cfg = c.get("config", {})
            source_name = c.get("source_name", "Jobs")
            max_results = c.get("max_results", 5)
            logger.info("Fetching from %s for user %s with config: %s (max: %d results)", source_name, user_id, cfg, max_results)
            
            fetcher = get_fetcher(c["source_type"], url, source_name, cfg)
            result = fetcher.fetch()
            if result.error:
                logger.info("Fetch from %s returned error for user %s: %s", source_name, user_id, result.error)
                continue
            
            logger.info("Fetch from %s returned %d jobs for user %s", source_name, result.fetched_count, user_id)
            
            # Limit results per source
            limited_jobs = result.jobs[:max_results]
            stored = sum(1 for raw in limited_jobs if _upsert_job_posting(raw) is not None)
            total_stored += stored
            if stored:
                logger.info("Stored %d profession-aware jobs from %s for user %s (limited from %d, q=%s)", 
                           stored, source_name, user_id, result.fetched_count, query)
            
            # Early termination: if we have enough results, stop searching
            if total_stored >= MIN_RESULTS_TO_STOP:
                logger.info("Got %d profession-aware results, stopping search", total_stored)
                break
        except Exception as e:
            logger.exception("Candidate fetch failed for user %s: %s", user_id, e)
            continue

    # Auto-trigger match analysis if we found jobs and auto_trigger is enabled
    if total_stored > 0 and auto_trigger_analysis:
        logger.info("Triggering automatic match analysis for user %s after fetching %d profession-aware jobs", user_id, total_stored)
        try:
            run_match_analysis_for_user.delay(user_id)
        except Exception as e:
            logger.exception("Failed to queue match analysis task for user %s (Redis may be unavailable): %s", user_id, e)

    return {"query": query, "stored": total_stored}


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
    # Don't auto-trigger since we're already in a match analysis run
    fetch_result = _fetch_indeed_jobs_for_user(user_id, query_override=profession, auto_trigger_analysis=False)
    # Only fallback to WWR if we got zero results and it's a dev role (expensive operation)
    if fetch_result.get("stored", 0) == 0 and _is_developer_profession(profession):
        logger.info("Primary fetch returned 0 results for developer role, trying fallback")
        _fetch_wwr_programming_jobs()
    # Match against jobs from all enabled sources
    enabled_sources = _get_enabled_job_source_names()
    recent = JobPosting.objects.filter(source__in=enabled_sources).order_by("-fetched_at")[:10]

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

        if match_result["match_score"] >= 70:
            if groq_between_calls:
                time.sleep(groq_between_calls)
            prob_result = estimate_interview_probability(match_result)
            prob = prob_result["interview_probability"] if prob_result else 0
        else:
            prob = 0

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
    enabled_sources = _get_enabled_job_source_names()
    has_recent = JobPosting.objects.filter(
        source__in=enabled_sources,
        fetched_at__gte=timezone.now() - timedelta(minutes=RESUME_FETCH_FRESH_MINUTES),
    ).exists()
    if not has_recent:
        profession = get_profession_for_job_search(resume_text)
        # Don't auto-trigger since we're already in a chunk analysis run
        fetch_result = _fetch_indeed_jobs_for_user(user_id, query_override=profession, auto_trigger_analysis=False)
        if fetch_result.get("stored", 0) == 0 and _is_developer_profession(profession):
            _fetch_wwr_programming_jobs()
    # Match against jobs from all enabled sources
    recent = JobPosting.objects.filter(source__in=enabled_sources).order_by("-fetched_at")[:20]

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

        if match_result["match_score"] >= 70:
            if groq_between_calls:
                time.sleep(groq_between_calls)
            prob_result = estimate_interview_probability(match_result)
            prob = prob_result["interview_probability"] if prob_result else 0
        else:
            prob = 0

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


@shared_task(bind=True, name="core.tasks._fetch_indeed_jobs_for_user_async")
def _fetch_indeed_jobs_for_user_async(self, user_id: int) -> dict:
    """Fetch jobs for a user Profile and auto-trigger analysis (async wrapper)."""
    return _fetch_indeed_jobs_for_user(user_id, auto_trigger_analysis=True)


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


@shared_task(bind=True, name="core.tasks.generate_insights_for_user")
def generate_insights_for_user(self, user_id: int) -> dict:
    """Generate resume insights for the user's current resume and replace existing insights."""
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return {"error": "User not found"}

    resume = _get_current_resume(user)
    if not resume or not resume.raw_text:
        return {"error": "No resume with text"}

    try:
        from ai.insight_generator import generate_insights

        insights = generate_insights(resume.raw_text, resume.parsed_content or {})
        if insights is None:
            return {"user_id": user_id, "created": 0}
        # Replace existing insights for user
        ResumeInsight.objects.filter(user=user).delete()
        created = 0
        for item in insights:
            ResumeInsight.objects.create(
                user=user,
                resume=resume,
                category=item["category"],
                title=item["title"],
                description=item["description"],
                impact=item.get("impact", "low"),
            )
            created += 1
        return {"user_id": user_id, "created": created}
    except Exception as e:
        logger.exception("Insight generation failed for user %s: %s", user_id, e)
        return {"user_id": user_id, "error": str(e)}
