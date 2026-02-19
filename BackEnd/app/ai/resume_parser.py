"""Parse resume text into structured data using OpenAI."""
import hashlib
import json
import logging

from django.core.cache import cache
from tenacity import retry, stop_after_attempt, wait_exponential

from .client import chat_completion_json

logger = logging.getLogger(__name__)
CACHE_TTL = 86400  # 24 hours

SYSTEM_PROMPT = (
    "You extract structured data from resumes. Return valid JSON only, no markdown or extra text. "
    "Use this exact structure: {\"skills\": [\"skill1\", \"skill2\"], "
    "\"experience\": [{\"title\": \"\", \"company\": \"\", \"dates\": \"\", \"description\": \"\"}], "
    "\"education\": [{\"degree\": \"\", \"institution\": \"\", \"dates\": \"\"}], "
    "\"summary\": \"\"}. "
    "If a section is missing or unclear, use empty list/string."
)

USER_PROMPT_TEMPLATE = "Extract structured data from this resume:\n\n{resume_text}"


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def _call_ai(resume_text: str) -> str:
    """Call AI chat completion with retries (OpenAI or Gemini based on AI_PROVIDER)."""
    return chat_completion_json(
        system=SYSTEM_PROMPT,
        user=USER_PROMPT_TEMPLATE.format(resume_text=resume_text[:15000]),
        temperature=0.2,
    )


def parse_resume(resume_text: str) -> dict | None:
    """
    Parse resume text into structured data.
    Results are cached for 24h to avoid redundant AI calls for identical resumes.

    Returns a dict with keys: skills, experience, education, summary.
    Returns None on failure.
    """
    if not resume_text or not resume_text.strip():
        logger.warning("parse_resume called with empty text")
        return None

    cache_key = "parse_resume:v1:" + hashlib.sha256(resume_text[:15000].encode()).hexdigest()
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    try:
        content = _call_ai(resume_text)
        data = json.loads(content)

        # Ensure required keys exist
        result = {
            "skills": data.get("skills", []) if isinstance(data.get("skills"), list) else [],
            "experience": data.get("experience", []) if isinstance(data.get("experience"), list) else [],
            "education": data.get("education", []) if isinstance(data.get("education"), list) else [],
            "summary": data.get("summary", "") or "",
        }
        cache.set(cache_key, result, CACHE_TTL)
        return result

    except Exception as e:
        logger.exception("Resume parsing failed: %s", e)
        return None
