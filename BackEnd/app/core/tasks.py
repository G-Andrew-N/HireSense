"""Celery tasks for HireSense job scanning and match analysis."""
import logging
from datetime import date

from celery import shared_task
from django.contrib.auth import get_user_model
from django.db.models import Q

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


def _run_match_analysis_for_user(user_id: int) -> dict:
    """Run match analysis for a user: fetch latest resume, match against recent JobPostings."""
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return {"error": "User not found"}

    resume = Resume.objects.filter(user=user).order_by("-uploaded_at").first()
    if not resume or not resume.raw_text:
        return {"error": "No resume with text"}

    from ai.job_matcher import match_resume_to_job
    from ai.interview_predictor import estimate_interview_probability

    resume_text = resume.raw_text
    # Limit to 15 jobs for sync mode (each job = 2 OpenAI calls; ~1 min total)
    recent = JobPosting.objects.filter(fetched_at__isnull=False).order_by("-fetched_at")[:15]

    created = 0
    for jp in recent:
        if not jp.description:
            continue
        if JobMatch.objects.filter(user=user, job_posting=jp).exists():
            continue

        match_result = match_resume_to_job(resume_text, jp.description)
        if not match_result:
            continue

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

    resume = Resume.objects.filter(user=user).order_by("-uploaded_at").first()
    if not resume or not resume.raw_text:
        return {"error": "No resume with text"}

    from ai.job_matcher import match_resume_to_job
    from ai.interview_predictor import estimate_interview_probability

    resume_text = resume.raw_text
    recent = JobPosting.objects.filter(fetched_at__isnull=False).order_by("-fetched_at")[:50]

    created_matches = []
    processed = 0
    for jp in recent:
        if processed >= chunk_size:
            break
        if not jp.description:
            continue
        if JobMatch.objects.filter(user=user, job_posting=jp).exists():
            continue

        match_result = match_resume_to_job(resume_text, jp.description)
        if not match_result:
            continue

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
