"""Celery tasks for HireSense job scanning and match analysis."""
import os
import logging
from datetime import date, timedelta

from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db.models import Q
from django.utils import timezone

from .job_sources.registry import fetch_jobs_for_site
from .models import JobMatch, JobPosting, JobSite, Resume, ResumeInsight, UserProfile

User = get_user_model()
logger = logging.getLogger(__name__)


@shared_task(name="core.tasks.test_celery")
def test_celery():
    """Simple test task to verify Celery worker is running and processing tasks."""
    logger.info("🎉 CELERY WORKER IS ALIVE AND PROCESSING TASKS!")
    return {"status": "success", "message": "Celery is working"}


@shared_task(name="core.tasks.send_password_reset_email", bind=True, max_retries=3)
def send_password_reset_email(self, email: str, reset_link: str):
    """Send password reset email asynchronously to avoid blocking requests."""
    resend_api_key = os.getenv("RESEND_API_KEY")
    
    # Try Resend first (HTTP API) - works on Render free tier
    if resend_api_key:
        try:
            import resend
            resend.api_key = resend_api_key
            
            resend.Emails.send({
                "from": "HireSense <onboarding@resend.dev>",
                "to": email,
                "subject": "HireSense: Reset your password",
                "text": (
                    f"Hi,\n\nYou requested a password reset. Open the link below to set a new password:\n\n"
                    f"{reset_link}\n\nIf you didn't request this, you can ignore this email.\n\n— HireSense"
                ),
            })
            logger.info(f"✅ Password reset email sent to {email} via Resend")
            return {"status": "success", "email": email, "method": "resend"}
        except Exception as exc:
            logger.error(f"❌ Resend failed for {email}: {exc}")
    
    # Fallback to SMTP
    try:
        send_mail(
            subject="HireSense: Reset your password",
            message=(
                f"Hi,\n\nYou requested a password reset. Open the link below to set a new password:\n\n"
                f"{reset_link}\n\nIf you didn't request this, you can ignore this email.\n\n— HireSense"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        logger.info(f"✅ Password reset email sent to {email} via SMTP")
        return {"status": "success", "email": email, "method": "smtp"}
    except Exception as exc:
        logger.error(f"❌ Failed to send password reset email to {email}: {exc}")
        self.retry(exc=exc, countdown=60)


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


@shared_task(bind=True, name="core.tasks.parse_resume_async", time_limit=120, soft_time_limit=100)
def parse_resume_async(self, resume_id: int) -> dict:
    """
    Background task: Parse resume PDF/text and extract content.
    Called asynchronously to avoid blocking the upload request.
    Time limit: 120 seconds hard, 100 seconds soft (to prevent worker timeout on free tier).
    """
    logger.info("=" * 80)
    logger.info("🔄 PARSE_RESUME_ASYNC TASK STARTED: resume_id=%s", resume_id)
    logger.info("=" * 80)
    
    try:
        resume = Resume.objects.get(pk=resume_id)
        logger.info("✓ Resume found: id=%s, user=%s, filename=%s", resume_id, resume.user_id, resume.file.name if resume.file else "None")
        
        from .resume_pipeline import process_resume_file
        
        logger.info("📄 Starting PDF extraction and AI parsing...")
        
        # Set a marker that parsing is in progress
        resume.parsed_content = {"_parsing": True}
        resume.save(update_fields=["parsed_content"])
        logger.info("✓ Set parsing marker in database")
        
        result = process_resume_file(resume)
        logger.info("✓ PDF extraction completed: text_length=%d", len(result.raw_text or ""))
        
        # Save parsed content
        resume.raw_text = result.raw_text
        content = dict(result.parsed_content)
        if result.structure_hints:
            content["structure_hints"] = result.structure_hints
        resume.parsed_content = content
        resume.save(update_fields=["raw_text", "parsed_content"])
        
        logger.info("=" * 80)
        logger.info("✅ RESUME PARSING COMPLETED: resume_id=%s, success=%s", resume_id, result.success)
        logger.info("=" * 80)
        
        return {
            "success": result.success,
            "resume_id": resume_id,
            "user_id": resume.user_id,
            "has_text": bool(result.raw_text),
        }
    except Resume.DoesNotExist:
        logger.error("❌ Resume %s not found for parsing", resume_id)
        return {"success": False, "error": "Resume not found"}
    except Exception as e:
        logger.exception("❌ Resume parsing failed for resume %s: %s", resume_id, e)
        # Clear parsing marker on error
        try:
            resume = Resume.objects.get(pk=resume_id)
            resume.parsed_content = {"error": str(e)}
            resume.save(update_fields=["parsed_content"])
            logger.error("✓ Saved error state to database")
        except Exception as save_error:
            logger.error("❌ Failed to save error state: %s", save_error)
        return {"success": False, "error": str(e)}


@shared_task(bind=True, name="core.tasks.scan_jobs_after_resume_upload")
def scan_jobs_after_resume_upload(self, user_id: int) -> dict:
    """
    Background task: Scan job sites after resume upload.
    Called asynchronously to avoid blocking the upload request.
    """
    try:
        scan_result = _run_scan_all_limited(max_results_per_source=3, max_total=30)
        logger.info("Fresh job scan completed after resume upload for user %s: %s", user_id, scan_result)
        return scan_result
    except Exception as e:
        logger.exception("Job scan failed after resume upload for user %s: %s", user_id, e)
        return {
            "sites_scanned": 0,
            "total_fetched": 0,
            "total_stored": 0,
            "errors": [{"error": str(e)}],
        }


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


def _fetch_indeed_jobs_for_user(
    user_id: int,
    query_override: str | None = None,
    auto_trigger_analysis: bool = True,
    max_total_results: int | None = None,
) -> dict:
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
    min_results_to_stop = max_total_results if max_total_results else 5
    
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
            if total_stored >= min_results_to_stop:
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
    # Match against jobs from all enabled sources - process more jobs to match fetch count
    enabled_sources = _get_enabled_job_source_names()
    recent = JobPosting.objects.filter(source__in=enabled_sources).order_by("-fetched_at")[:30]

    from django.conf import settings

    from ai.job_matcher import match_resume_to_job
    from ai.interview_predictor import estimate_interview_probability

    provider = getattr(settings, "AI_PROVIDER", "openai") or "openai"
    groq_pace_seconds = 5 if provider == "groq" else 0
    groq_between_calls = 3 if provider == "groq" else 0

    import time
    created = 0
    analyzed = 0
    
    logger.info(f"🔍 Starting job analysis for user {user_id} - {len(recent)} jobs to check")
    
    for idx, jp in enumerate(recent, 1):
        if not jp.description:
            logger.info(f"  ⏭️  [{idx}/{len(recent)}] Skipping job {jp.id} (no description): {jp.title}")
            continue
        if JobMatch.objects.filter(user=user, job_posting=jp).exists():
            logger.info(f"  ✓ [{idx}/{len(recent)}] Already analyzed: {jp.title}")
            continue

        logger.info(f"  🔎 [{idx}/{len(recent)}] Analyzing: {jp.title} ({jp.company})")
        job_desc = f"Job title: {jp.title or 'N/A'}\n\n{jp.description or ''}"
        match_result = match_resume_to_job(resume_text, job_desc)
        
        # If analysis failed or score is very low (< 15), create a low-score record and skip
        if not match_result:
            logger.info(f"  ❌ [{idx}/{len(recent)}] Analysis failed: {jp.title}")
            if groq_pace_seconds:
                time.sleep(groq_pace_seconds)
            continue
        
        # Only save matches with 50% or higher score to ensure CV relevance
        match_score = match_result["match_score"]
        
        if match_score < 50:
            analyzed += 1
            logger.info(f"  ⏭️  [{idx}/{len(recent)}] Skipped low score ({match_score}%) - {jp.title}")
            if groq_pace_seconds:
                time.sleep(groq_pace_seconds)
            continue
        
        if match_score >= 70:
            if groq_between_calls:
                time.sleep(groq_between_calls)
            prob_result = estimate_interview_probability(match_result)
            prob = prob_result["interview_probability"] if prob_result else 0
        else:
            prob = 0

        job_match = JobMatch.objects.create(
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
            match_score=match_score,
            interview_probability=prob,
            skills=match_result.get("matched_skills", []),
            missing_skills=match_result.get("missing_skills", []),
        )
        analyzed += 1
        logger.info(f"  ✅ [{idx}/{len(recent)}] Match created - Score: {match_score}% | {jp.title}")
        
        # Create notification for high match (85%+) if user has alerts enabled
        if match_score >= 85:
            try:
                profile = user.profile
                if profile.high_match_alerts:
                    _create_user_notification(
                        user=user,
                        title=f"🎯 High Match Found: {match_score}%",
                        message=f"We found an excellent job match for you!\n\n"
                                f"**{jp.title}** at **{jp.company}**\n"
                                f"Match Score: {match_score}%\n"
                                f"Location: {jp.location or 'Not specified'}\n\n"
                                f"This job is a great fit for your skills and experience.",
                        notification_type="alert",
                    )
                    logger.info(f"  🔔 High match alert created for {match_score}% match")
            except Exception as e:
                logger.warning(f"Failed to create high match notification: {e}")
        
        if groq_pace_seconds:
            time.sleep(groq_pace_seconds)

    logger.info(f"✨ Analysis complete for user {user_id}: {analyzed} jobs analyzed, {created} new matches")
    return {"user_id": user_id, "matches_created": created, "jobs_analyzed": analyzed}



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
        fetch_result = _fetch_indeed_jobs_for_user(
            user_id,
            query_override=profession,
            auto_trigger_analysis=False,
            max_total_results=chunk_size,
        )
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
    analyzed = 0
    max_analysis_attempts = chunk_size * 2  # Analyze at most 2x chunk_size jobs (Render has 30s timeout)
    
    for jp in recent:
        if processed >= chunk_size:
            break
        # Safety limit: stop analyzing after max_analysis_attempts to prevent worker timeout
        if analyzed >= max_analysis_attempts:
            logger.info(f"  ⚠️  Reached max analysis attempts ({max_analysis_attempts}), stopping")
            break
        if not jp.description:
            continue
        if JobMatch.objects.filter(user=user, job_posting=jp).exists():
            continue

        job_desc = f"Job title: {jp.title or 'N/A'}\n\n{jp.description or ''}"
        match_result = match_resume_to_job(resume_text, job_desc)
        analyzed += 1  # Track how many jobs we actually analyzed
        
        if not match_result:
            if groq_pace_seconds:
                time.sleep(groq_pace_seconds)
            continue

        match_score = match_result["match_score"]
        
        # Only save matches with 50% or higher score to ensure CV relevance
        if match_score < 50:
            logger.info(f"  ⏭️  [{analyzed}] Skipped low score ({match_score}%) - {jp.title}")
            if groq_pace_seconds:
                time.sleep(groq_pace_seconds)
            continue

        if match_score >= 70:
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
            match_score=match_score,
            interview_probability=prob,
            skills=match_result.get("matched_skills", []),
            missing_skills=match_result.get("missing_skills", []),
        )
        created_matches.append(obj)
        processed += 1
        logger.info(f"  ✅ [{analyzed}] Match created - Score: {match_score}% | {jp.title}")
        
        # Create notification for high match (85%+) if user has alerts enabled
        if match_score >= 85:
            try:
                profile = user.profile
                if profile.high_match_alerts:
                    _create_user_notification(
                        user=user,
                        title=f"🎯 High Match Found: {match_score}%",
                        message=f"We found an excellent job match for you!\n\n"
                                f"**{jp.title}** at **{jp.company}**\n"
                                f"Match Score: {match_score}%\n"
                                f"Location: {jp.location or 'Not specified'}\n\n"
                                f"This job is a great fit for your skills and experience.",
                        notification_type="alert",
                    )
                    logger.info(f"  🔔 High match alert created for {match_score}% match")
            except Exception as e:
                logger.warning(f"Failed to create high match notification: {e}")
        
        if groq_pace_seconds:
            time.sleep(groq_pace_seconds)

    # If we got a full chunk, there are likely more unmatched jobs
    has_more = processed == chunk_size
    
    # Provide helpful message when jobs were analyzed but none passed threshold
    message = None
    if analyzed > 0 and processed == 0:
        message = f"Analyzed {analyzed} job(s), but none matched your CV well enough (need 50%+ relevance). Try again later for fresh job postings."
    elif analyzed > 0 and processed < chunk_size:
        logger.info(f"  ℹ️  Analyzed {analyzed} jobs, created {processed} matches (some jobs didn't meet 50% threshold)")

    return {"matches": created_matches, "has_more": has_more, "message": message, "analyzed": analyzed}


@shared_task(bind=True, name="core.tasks.run_match_analysis_for_user", max_retries=3, default_retry_delay=10)
def run_match_analysis_for_user(self, user_id: int) -> dict:
    """Run match analysis for a single user (async)."""
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return {"error": "User not found"}

    resume = _get_current_resume(user)
    if not resume:
        return {"error": "No resume found"}
    
    # If resume hasn't been parsed yet, retry in a few seconds
    if not resume.raw_text:
        logger.info("Resume %s not yet parsed, retrying match analysis in 10s...", resume.id)
        raise self.retry(countdown=10, exc=Exception("Resume not yet parsed"))
    
    return _run_match_analysis_for_user(user_id)


@shared_task(bind=True, name="core.tasks._fetch_indeed_jobs_for_user_async")
def _fetch_indeed_jobs_for_user_async(self, user_id: int) -> dict:
    """Fetch jobs for a user Profile and auto-trigger analysis (async wrapper)."""
    return _fetch_indeed_jobs_for_user(user_id, auto_trigger_analysis=True)


@shared_task(bind=True, name="core.tasks.analyze_new_jobs_for_all_users")
def analyze_new_jobs_for_all_users(self) -> dict:
    """
    Lightweight incremental task: analyze only recently fetched jobs for all users.
    This runs frequently (every 30 min) to provide quick updates when new jobs arrive.
    """
    from django.conf import settings
    from ai.job_matcher import match_resume_to_job
    from ai.interview_predictor import estimate_interview_probability
    import time

    users_with_resumes = User.objects.filter(
        resumes__raw_text__isnull=False,
    ).distinct()
    
    # Look at jobs fetched in the last 30 minutes for faster refresh
    thirty_min_ago = timezone.now() - timedelta(minutes=30)
    enabled_sources = _get_enabled_job_source_names()
    recent_jobs = JobPosting.objects.filter(
        source__in=enabled_sources,
        fetched_at__gte=thirty_min_ago,
    ).order_by("-fetched_at")[:50]  # Limit to 50 most recent
    
    if not recent_jobs.exists():
        logger.debug("No recently fetched jobs found (last 30 min)")
        return {"users_processed": 0, "jobs_analyzed": 0, "matches_created": 0}
    
    provider = getattr(settings, "AI_PROVIDER", "openai") or "openai"
    groq_pace_seconds = 5 if provider == "groq" else 0
    groq_between_calls = 3 if provider == "groq" else 0
    
    total_analyzed = 0
    total_matches = 0
    
    for user in users_with_resumes:
        resume = _get_current_resume(user)
        if not resume or not resume.raw_text:
            continue
        
        resume_text = resume.raw_text
        user_matches = JobMatch.objects.filter(user=user).values_list('job_posting_id', flat=True)
        
        for jp in recent_jobs:
            if jp.id in user_matches or not jp.description:
                continue  # Skip already matched or jobs without description
            
            try:
                job_desc = f"Job title: {jp.title or 'N/A'}\n\n{jp.description or ''}"
                match_result = match_resume_to_job(resume_text, job_desc)
                
                if not match_result:
                    if groq_pace_seconds:
                        time.sleep(groq_pace_seconds)
                    continue
                
                match_score = match_result["match_score"]
                
                # Only save matches with 50% or higher score to ensure CV relevance
                if match_score < 50:
                    total_analyzed += 1
                    if groq_pace_seconds:
                        time.sleep(groq_pace_seconds)
                    continue
                
                if match_score >= 70:
                    if groq_between_calls:
                        time.sleep(groq_between_calls)
                    prob_result = estimate_interview_probability(match_result)
                    prob = prob_result["interview_probability"] if prob_result else 0
                else:
                    prob = 0
                
                job_match = JobMatch.objects.create(
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
                    match_score=match_score,
                    interview_probability=prob,
                    skills=match_result.get("matched_skills", []),
                    missing_skills=match_result.get("missing_skills", []),
                )
                total_matches += 1
                total_analyzed += 1
                
                # Create notification for high match (85%+) if user has alerts enabled
                if match_score >= 85:
                    try:
                        profile = user.profile
                        if profile.high_match_alerts:
                            _create_user_notification(
                                user=user,
                                title=f"🎯 High Match Found: {match_score}%",
                                message=f"We found an excellent job match for you!\n\n"
                                        f"**{jp.title}** at **{jp.company}**\n"
                                        f"Match Score: {match_score}%\n"
                                        f"Location: {jp.location or 'Not specified'}\n\n"
                                        f"This job is a great fit for your skills and experience.",
                                notification_type="alert",
                            )
                            logger.info(f"🔔 High match alert created for {user.email} - {match_score}% match")
                    except Exception as notif_err:
                        logger.warning(f"Failed to create high match notification: {notif_err}")
                
                if groq_pace_seconds:
                    time.sleep(groq_pace_seconds)
            except Exception as e:
                logger.warning(f"Failed to analyze job {jp.id} for user {user.id}: {e}")
                continue
    
    logger.info(f"Incremental analysis complete: {total_analyzed} new matches from {recent_jobs.count()} recent jobs")
    return {
        "users_processed": users_with_resumes.count(),
        "jobs_analyzed": total_analyzed,
        "matches_created": total_matches,
    }


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


@shared_task(bind=True, name="core.tasks.generate_insights_for_user", max_retries=3, default_retry_delay=10)
def generate_insights_for_user(self, user_id: int) -> dict:
    """Generate resume insights for the user's current resume and replace existing insights."""
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return {"error": "User not found"}

    resume = _get_current_resume(user)
    if not resume:
        return {"error": "No resume found"}
    
    # If resume hasn't been parsed yet, retry in a few seconds
    if not resume.raw_text:
        logger.info("Resume %s not yet parsed, retrying insight generation in 10s...", resume.id)
        raise self.retry(countdown=10, exc=Exception("Resume not yet parsed"))

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
        logger.info("Generated %d insights for user %s", created, user_id)
        return {"user_id": user_id, "created": created}
    except Exception as e:
        logger.exception("Insight generation failed for user %s: %s", user_id, e)
        return {"user_id": user_id, "error": str(e)}


# ----- Email Notifications Tasks -----


@shared_task(bind=True, name="core.tasks.send_daily_match_notifications")
def send_daily_match_notifications(self) -> dict:
    """
    Send daily email digests of new job matches to users with email_notifications enabled.
    Runs once daily (typically at 8 AM).
    """
    try:
        from django.conf import settings
        
        enabled_sources = _get_enabled_job_source_names()
        users_sent = 0
        users_skipped = 0
        total_matches_sent = 0
        
        # Get all users with email notifications enabled
        users = User.objects.filter(
            is_active=True,
            profile__email_notifications=True,
        ).select_related("profile").distinct()
        
        # Timestamp for filtering new matches (last 24 hours by default)
        cutoff_time = timezone.now() - timedelta(hours=24)
        
        for user in users:
            try:
                # Get unreviewed matches created in the last 24 hours
                recent_matches = JobMatch.objects.filter(
                    user=user,
                    source__in=enabled_sources,
                    created_at__gte=cutoff_time,
                    match_score__gte=25,
                ).order_by("-match_score", "-created_at")
                
                if not recent_matches.exists():
                    users_skipped += 1
                    continue
                
                # Prepare email content
                match_list = []
                for match in recent_matches[:20]:  # Limit to 20 matches per email
                    match_list.append({
                        "title": match.title,
                        "company": match.company,
                        "score": match.match_score,
                        "location": match.location,
                        "source": match.source,
                    })
                
                # Build HTML email
                email_html = _build_daily_notification_html(user, match_list)
                
                # Send email
                email_msg = EmailMessage(
                    subject=f"HireSense: {recent_matches.count()} New Job Matches for You",
                    body=email_html,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user.email],
                )
                email_msg.content_subtype = "html"
                email_msg.send(fail_silently=False)
                
                users_sent += 1
                total_matches_sent += recent_matches.count()
                logger.info(f"Daily notification sent to {user.email}: {recent_matches.count()} matches")
                
            except Exception as e:
                logger.warning(f"Failed to send daily notification to user {user.id}: {e}")
                users_skipped += 1
                continue
        
        logger.info(
            f"Daily match notifications complete: sent to {users_sent} users with {total_matches_sent} total matches"
        )
        return {
            "users_sent": users_sent,
            "users_skipped": users_skipped,
            "total_matches_sent": total_matches_sent,
        }
        
    except Exception as e:
        logger.exception("Daily notification task failed: %s", e)
        return {"error": str(e)}


@shared_task(bind=True, name="core.tasks.send_high_match_alerts")
def send_high_match_alerts(self) -> dict:
    """
    Send instant email alerts for high-matching jobs (85%+ match score).
    Runs frequently to catch recent high-scoring matches.
    """
    try:
        from django.conf import settings
        
        enabled_sources = _get_enabled_job_source_names()
        emails_sent = 0
        errors = 0
        
        # Get all users with high match alerts enabled
        users = User.objects.filter(
            is_active=True,
            profile__high_match_alerts=True,
        ).select_related("profile").distinct()
        
        # Check for high-scoring matches in the last 2 hours (sent via alert)
        cutoff_time = timezone.now() - timedelta(hours=2)
        
        for user in users:
            try:
                # Get high-scoring recent matches that haven't been alerted yet
                high_matches = JobMatch.objects.filter(
                    user=user,
                    source__in=enabled_sources,
                    match_score__gte=85,
                    created_at__gte=cutoff_time,
                ).order_by("-match_score", "-created_at")[:5]  # Top 5 matches
                
                if not high_matches.exists():
                    continue
                
                # Prepare email content
                match_list = []
                for match in high_matches:
                    match_list.append({
                        "title": match.title,
                        "company": match.company,
                        "score": match.match_score,
                        "location": match.location,
                        "source": match.source,
                    })
                
                # Build HTML email for high match alert
                email_html = _build_high_match_alert_html(user, match_list)
                
                # Send email
                email_msg = EmailMessage(
                    subject=f"🎯 HireSense: Excellent Job Match Alert! ({high_matches.count()} match{'es' if high_matches.count() > 1 else ''})",
                    body=email_html,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user.email],
                )
                email_msg.content_subtype = "html"
                email_msg.send(fail_silently=False)
                
                emails_sent += 1
                logger.info(f"High match alert sent to {user.email}: {high_matches.count()} matches >= 85%")
                
            except Exception as e:
                logger.warning(f"Failed to send high match alert to user {user.id}: {e}")
                errors += 1
                continue
        
        logger.info(f"High match alerts complete: sent {emails_sent} alerts (errors: {errors})")
        return {
            "alerts_sent": emails_sent,
            "errors": errors,
        }
        
    except Exception as e:
        logger.exception("High match alert task failed: %s", e)
        return {"error": str(e)}


@shared_task(bind=True, name="core.tasks.send_weekly_reports")
def send_weekly_reports(self) -> dict:
    """
    Send weekly activity reports to users with weekly_reports enabled.
    Runs once weekly (typically on Monday morning).
    """
    try:
        from django.conf import settings
        
        enabled_sources = _get_enabled_job_source_names()
        reports_sent = 0
        errors = 0
        
        # Get all users with weekly reports enabled
        users = User.objects.filter(
            is_active=True,
            profile__weekly_reports=True,
        ).select_related("profile").distinct()
        
        # Last 7 days
        cutoff_time = timezone.now() - timedelta(days=7)
        
        for user in users:
            try:
                # Get weekly stats
                total_matches = JobMatch.objects.filter(
                    user=user,
                    source__in=enabled_sources,
                    created_at__gte=cutoff_time,
                ).count()
                
                high_matches = JobMatch.objects.filter(
                    user=user,
                    source__in=enabled_sources,
                    match_score__gte=85,
                    created_at__gte=cutoff_time,
                ).count()
                
                top_matches = JobMatch.objects.filter(
                    user=user,
                    source__in=enabled_sources,
                    created_at__gte=cutoff_time,
                ).order_by("-match_score")[:5]
                
                if total_matches == 0:
                    # Skip if no matches in the period
                    continue
                
                # Prepare email content
                match_list = []
                for match in top_matches:
                    match_list.append({
                        "title": match.title,
                        "company": match.company,
                        "score": match.match_score,
                        "location": match.location,
                        "source": match.source,
                    })
                
                # Build HTML email for weekly report
                email_html = _build_weekly_report_html(
                    user, 
                    total_matches, 
                    high_matches, 
                    match_list
                )
                
                # Send email
                email_msg = EmailMessage(
                    subject=f"HireSense Weekly Report: {total_matches} New Opportunities This Week",
                    body=email_html,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user.email],
                )
                email_msg.content_subtype = "html"
                email_msg.send(fail_silently=False)
                
                # Create in-app notification for weekly report
                top_matches_text = "\n".join([
                    f"• **{m['title']}** at {m['company']} ({m['score']}%)"
                    for m in match_list[:3]
                ])
                
                notification_message = (
                    f"Your weekly activity summary for the past 7 days:\n\n"
                    f"📊 **Total Matches:** {total_matches}\n"
                    f"🎯 **High Matches (85%+):** {high_matches}\n\n"
                )
                
                if top_matches_text:
                    notification_message += f"**Top Matches:**\n{top_matches_text}\n\n"
                
                notification_message += "Check your Job Matches page to review all opportunities!"
                
                _create_user_notification(
                    user=user,
                    title=f"📈 Weekly Report: {total_matches} New Opportunities",
                    message=notification_message,
                    notification_type="info",
                )
                
                reports_sent += 1
                logger.info(f"Weekly report sent to {user.email}: {total_matches} matches this week")
                
            except Exception as e:
                logger.warning(f"Failed to send weekly report to user {user.id}: {e}")
                errors += 1
                continue
        
        logger.info(f"Weekly reports complete: sent {reports_sent} reports (errors: {errors})")
        return {
            "reports_sent": reports_sent,
            "errors": errors,
        }
        
    except Exception as e:
        logger.exception("Weekly report task failed: %s", e)
        return {"error": str(e)}


# ----- Email Template Helpers -----


def _build_daily_notification_html(user, matches):
    """Build HTML email for daily match notification."""
    match_rows = ""
    for match in matches:
        score_color = "green" if match["score"] >= 75 else "orange" if match["score"] >= 50 else "gray"
        match_rows += f"""
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; vertical-align: top;">
                <div style="font-weight: 600; color: #333;">{match['title']}</div>
                <div style="font-size: 14px; color: #666;">{match['company']}</div>
                <div style="font-size: 12px; color: #999;">{match['location']} • {match['source']}</div>
            </td>
            <td style="padding: 12px; text-align: center; vertical-align: top;">
                <div style="
                    background-color: {score_color}; 
                    color: white; 
                    padding: 6px 12px; 
                    border-radius: 4px; 
                    font-weight: 600;
                    font-size: 14px;
                ">{match['score']}%</div>
            </td>
        </tr>
        """
    
    return f"""
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
            .header h1 {{ margin: 0; font-size: 24px; }}
            .header p {{ margin: 8px 0 0 0; opacity: 0.9; }}
            .matches-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            .footer {{ font-size: 12px; color: #999; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }}
            .button {{ display: inline-block; background-color: #059669; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin: 10px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 Your Daily Job Matches</h1>
                <p>Hi {user.first_name or user.username}, we found {len(matches)} great opportunities for you today!</p>
            </div>
            
            <p>Here are your top job matches from the last 24 hours:</p>
            
            <table class="matches-table">
                <thead style="background-color: #f3f4f6;">
                    <tr>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Job Opportunity</th>
                        <th style="padding: 12px; text-align: center; font-weight: 600;">Match Score</th>
                    </tr>
                </thead>
                <tbody>
                    {match_rows}
                </tbody>
            </table>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="https://hiresense.local/job-matches" class="button">View All Matches</a>
            </p>
            
            <div class="footer">
                <p>This is an automated email from HireSense. You're receiving this because you have daily notifications enabled.</p>
                <p><a href="https://hiresense.local/settings" style="color: #059669; text-decoration: none;">Manage your notification preferences</a></p>
            </div>
        </div>
    </body>
    </html>
    """


def _build_high_match_alert_html(user, matches):
    """Build HTML email for high match alerts."""
    match_rows = ""
    for match in matches:
        match_rows += f"""
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 10px; border-radius: 4px;">
            <div style="font-weight: 600; color: #333; font-size: 16px;">{match['title']}</div>
            <div style="color: #666; font-size: 14px; margin: 4px 0;">{match['company']}</div>
            <div style="color: #999; font-size: 12px; margin: 8px 0;">📍 {match['location']} • 📰 {match['source']}</div>
            <div style="background-color: #10b981; color: white; padding: 6px 12px; border-radius: 4px; font-weight: 600; font-size: 14px; display: inline-block; margin-top: 8px;">
                {match['score']}% Match
            </div>
        </div>
        """
    
    return f"""
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 28px; }}
            .header .emoji {{ font-size: 40px; margin-bottom: 10px; }}
            .footer {{ font-size: 12px; color: #999; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }}
            .button {{ display: inline-block; background-color: #059669; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 600; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="emoji">🎯</div>
                <h1>Excellent Job Match Alert!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">We found some amazing opportunities for you</p>
            </div>
            
            <p style="font-size: 16px;">Hi {user.first_name or user.username},</p>
            <p>We just discovered {len(matches)} job(s) with an 85%+ match score! These are exceptional matches for your profile:</p>
            
            {match_rows}
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="https://hiresense.local/job-matches" class="button">View All High-Scoring Matches</a>
            </p>
            
            <div class="footer">
                <p>This is a high-match alert from HireSense. You're receiving this because you have instant alerts enabled for 85%+ matches.</p>
                <p><a href="https://hiresense.local/settings" style="color: #059669; text-decoration: none;">Adjust notification settings</a></p>
            </div>
        </div>
    </body>
    </html>
    """


def _build_weekly_report_html(user, total_matches, high_matches, top_matches):
    """Build HTML email for weekly reports."""
    match_rows = ""
    for match in top_matches:
        score_color = "green" if match["score"] >= 75 else "orange" if match["score"] >= 50 else "gray"
        match_rows += f"""
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; text-align: left;">
                <div style="font-weight: 600; color: #333;">{match['title']}</div>
                <div style="font-size: 13px; color: #666;">{match['company']}</div>
            </td>
            <td style="padding: 10px; text-align: center;">
                <div style="
                    background-color: {score_color}; 
                    color: white; 
                    padding: 4px 10px; 
                    border-radius: 4px; 
                    font-weight: 600;
                    font-size: 13px;
                ">{match['score']}%</div>
            </td>
        </tr>
        """
    
    high_match_text = f"{high_matches} excellent match{'es' if high_matches != 1 else ''} (85%+)"
    
    return f"""
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
            .header h1 {{ margin: 0; font-size: 24px; }}
            .stats {{ display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }}
            .stat-box {{ background-color: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #059669; }}
            .stat-number {{ font-size: 28px; font-weight: 700; color: #059669; line-height: 1; }}
            .stat-label {{ font-size: 12px; color: #666; margin-top: 8px; }}
            .matches-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            .footer {{ font-size: 12px; color: #999; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }}
            .button {{ display: inline-block; background-color: #059669; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Your Weekly Report</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.95;">Week of {(timezone.now() - timedelta(days=7)).strftime('%B %d, %Y')}</p>
            </div>
            
            <p>Hi {user.first_name or user.username},</p>
            <p>Here's your weekly summary of job opportunities:</p>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-number">{total_matches}</div>
                    <div class="stat-label">New Matches Found</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">{high_matches}</div>
                    <div class="stat-label">Excellent Matches (85%+)</div>
                </div>
            </div>
            
            <h3 style="margin-top: 25px; margin-bottom: 15px; color: #333;">Top Opportunities This Week</h3>
            <table class="matches-table">
                <thead style="background-color: #f3f4f6;">
                    <tr>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Job Title & Company</th>
                        <th style="padding: 12px; text-align: center; font-weight: 600;">Match</th>
                    </tr>
                </thead>
                <tbody>
                    {match_rows}
                </tbody>
            </table>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="https://hiresense.local/job-matches" class="button">Explore All Opportunities</a>
            </p>
            
            <div class="footer">
                <p>This is an automated weekly report from HireSense.</p>
                <p><a href="https://hiresense.local/settings" style="color: #059669; text-decoration: none;">Manage notification preferences</a></p>
            </div>
        </div>
    </body>
    </html>
    """

# ----- System Notifications -----


def _create_user_notification(user, title, message, notification_type="info"):
    """Helper to create a notification for a specific user (in-app only).
    
    Args:
        user: User object
        title: Notification title
        message: Notification message body
        notification_type: One of 'info', 'alert', 'warning', 'important', 'maintenance'
    
    Returns:
        UserNotification object or None if failed
    """
    from .models import SystemNotification, UserNotification
    
    try:
        # Map notification_type string to SystemNotification.NotificationType
        type_map = {
            "info": SystemNotification.NotificationType.INFO,
            "alert": SystemNotification.NotificationType.ALERT,
            "warning": SystemNotification.NotificationType.WARNING,
            "important": SystemNotification.NotificationType.IMPORTANT,
            "maintenance": SystemNotification.NotificationType.MAINTENANCE,
        }
        notif_type = type_map.get(notification_type.lower(), SystemNotification.NotificationType.INFO)
        
        # Create system notification (not sent to all users, just stored)
        sys_notif = SystemNotification.objects.create(
            title=title,
            message=message,
            notification_type=notif_type,
            created_by=user,  # Use the user as creator for user-specific notifications
            is_sent=True,  # Mark as sent since we're creating the user notification immediately
            send_immediately=False,  # This is a user-specific notification, not broadcast
            sent_at=timezone.now(),
        )
        
        # Create user notification receipt
        user_notif = UserNotification.objects.create(
            user=user,
            notification=sys_notif,
            is_read=False,
        )
        
        logger.info(f"Created notification for {user.email}: {title}")
        return user_notif
        
    except Exception as e:
        logger.error(f"Failed to create notification for {user.email}: {str(e)}")
        return None


@shared_task
def send_notification_to_users(notification_id):
    """Send a system notification to all users (local database only).
    
    NOTE: Email functionality is currently disabled. This iteration relies on
    in-app notifications only. Email will be re-enabled in a future iteration.
    Users will see notifications in the Notifications page and header badge.
    """
    from .models import SystemNotification, UserNotification
    
    try:
        notification = SystemNotification.objects.get(id=notification_id)
    except SystemNotification.DoesNotExist:
        logger.error(f"Notification {notification_id} not found")
        return {"error": "Notification not found"}
    
    if notification.is_sent:
        logger.warning(f"Notification {notification_id} already sent")
        return {"error": "Notification already sent"}
    
    # Get all active users
    users = User.objects.filter(is_active=True)
    
    # Create notification receipts for all active users (local database storage only)
    user_notifications = []
    
    for user in users:
        try:
            # Create user notification receipt
            user_notifications.append(
                UserNotification(
                    user=user,
                    notification=notification,
                    is_read=False
                )
            )
        except Exception as e:
            logger.error(f"Failed to create notification receipt for {user.email}: {str(e)}")
    
    # Bulk create user notification records
    if user_notifications:
        UserNotification.objects.bulk_create(user_notifications, ignore_conflicts=True)
    
    # Mark notification as sent
    notification.is_sent = True
    notification.sent_at = timezone.now()
    notification.save()
    
    sent_count = len(user_notifications)
    logger.info(f"Notification {notification_id} created for {sent_count} users (email disabled, using local notifications)")
    
    return {
        "notification_id": notification_id,
        "sent_count": sent_count,
        "failed_count": 0,
    }