"""Match resume to job description and compute match score using OpenAI."""
import hashlib
import json
import logging

from django.core.cache import cache
from tenacity import retry, stop_after_attempt, wait_exponential

from .client import chat_completion_json

logger = logging.getLogger(__name__)
CACHE_TTL = 86400  # 24 hours

SYSTEM_PROMPT = (
    "You compare resumes to job descriptions and return match analysis as JSON only. "
    "Use this exact structure: {\"match_score\": <0-100>, "
    "\"matched_skills\": [\"skill1\", \"skill2\"], "
    "\"missing_skills\": [\"skill1\", \"skill2\"], "
    "\"reasoning\": \"\"}. "
    "CRITICAL - Role/industry alignment: The job MUST match the candidate's career field. "
    "Examples: real estate agent CV → only real estate agent/broker jobs; web developer CV → only software/tech dev jobs; nurse CV → only healthcare/nursing jobs. "
    "If the job is in a completely different industry or role, set match_score to 0-15 and explain in reasoning that the job does not match the candidate's field. "
    "Only give scores above 30 when the job role aligns with the resume. "
    "matched_skills = skills from the job that appear in the resume. missing_skills = important job requirements not on the resume."
)

USER_PROMPT_TEMPLATE = """Resume:

{resume_text}

Job title and description:

{job_description}

Return JSON: match_score (0-100; 0-15 if job is in a different field than the candidate), matched_skills, missing_skills, reasoning."""


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def _call_ai(resume_text: str, job_description: str) -> str:
    """Call AI chat completion with retries (OpenAI or Gemini based on AI_PROVIDER)."""
    # Groq free tier: 6000 TPM; truncate to reduce token usage
    from django.conf import settings
    provider = getattr(settings, "AI_PROVIDER", "openai") or "openai"
    max_resume = 5000 if provider == "groq" else 10000
    max_job = 4000 if provider == "groq" else 8000

    return chat_completion_json(
        system=SYSTEM_PROMPT,
        user=USER_PROMPT_TEMPLATE.format(
            resume_text=resume_text[:max_resume],
            job_description=job_description[:max_job],
        ),
        temperature=0.2,
    )


def match_resume_to_job(resume_text: str, job_description: str) -> dict | None:
    """
    Compare resume to job description and return match analysis.
    Results are cached for 24h to avoid redundant AI calls.

    Returns a dict with: match_score, matched_skills, missing_skills, reasoning.
    Returns None on failure.
    """
    if not resume_text or not resume_text.strip():
        logger.warning("match_resume_to_job called with empty resume text")
        return None
    if not job_description or not job_description.strip():
        logger.warning("match_resume_to_job called with empty job description")
        return None

    cache_key = "job_match:v1:" + hashlib.sha256(
        (resume_text[:8000] + "|" + job_description[:6000]).encode()
    ).hexdigest()
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    try:
        content = _call_ai(resume_text, job_description)
        data = json.loads(content)

        score = data.get("match_score", 0)
        if isinstance(score, (int, float)):
            score = max(0, min(100, int(score)))
        else:
            score = 0

        result = {
            "match_score": score,
            "matched_skills": data.get("matched_skills", [])
            if isinstance(data.get("matched_skills"), list)
            else [],
            "missing_skills": data.get("missing_skills", [])
            if isinstance(data.get("missing_skills"), list)
            else [],
            "reasoning": data.get("reasoning", "") or "",
        }
        cache.set(cache_key, result, CACHE_TTL)
        return result

    except Exception as e:
        logger.exception("Job matching failed: %s", e)
        return None
