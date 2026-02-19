"""
Determine the primary profession from a resume for targeted job search.
AI reviews the document and returns a short job-search query (e.g. "Real Estate Agent").
"""
import hashlib
import json
import logging

from django.core.cache import cache

from .client import chat_completion_json

logger = logging.getLogger(__name__)
CACHE_TTL = 86400  # 24 hours

SYSTEM_PROMPT = (
    "You review resumes and determine the primary profession or job title to use when searching for jobs. "
    "Return valid JSON only, no markdown or extra text. Use this exact structure: {\"profession\": \"\"}. "
    "The profession must be a short phrase (2–4 words) that would be typed into a job search, e.g. "
    "\"Software Engineer\", \"Real Estate Agent\", \"Registered Nurse\", \"Marketing Manager\". "
    "Base it on the person's most recent role, skills, and summary. One profession only."
)

USER_PROMPT_TEMPLATE = "Determine the primary profession for job search from this resume:\n\n{resume_text}"


def get_profession_for_job_search(resume_text: str) -> str:
    """
    AI reviews the resume and returns the profession to use for fetching jobs.
    Results are cached for 24h by resume content.
    """
    if not (resume_text or "").strip():
        return "jobs"
    text = resume_text.strip()[:12000]
    cache_key = "profession:v1:" + hashlib.sha256(text.encode()).hexdigest()
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    try:
        content = chat_completion_json(
            system=SYSTEM_PROMPT,
            user=USER_PROMPT_TEMPLATE.format(resume_text=text),
            temperature=0.2,
        )
        data = json.loads(content)
        profession = (data.get("profession") or "").strip()
        if not profession:
            return "jobs"
        # Normalize: first 4 words, alphanumeric + spaces
        words = [w for w in profession.replace("-", " ").split() if w.isalnum()][:4]
        result = " ".join(words) if words else "jobs"
        cache.set(cache_key, result, CACHE_TTL)
        return result
    except Exception as e:
        logger.warning("get_profession_for_job_search failed: %s", e)
        return "jobs"
