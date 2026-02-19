"""Estimate interview probability from resume-job match analysis using OpenAI."""
import hashlib
import json
import logging

from django.core.cache import cache
from tenacity import retry, stop_after_attempt, wait_exponential

from .client import chat_completion_json

logger = logging.getLogger(__name__)
CACHE_TTL = 86400  # 24 hours

SYSTEM_PROMPT = (
    "Based on resume-job match analysis, estimate the probability (0-100) "
    "that the candidate will get an interview. Return valid JSON only: "
    "{\"interview_probability\": <0-100>, \"key_factors\": [\"factor1\", \"factor2\"]}. "
    "Consider match quality, experience fit, skill gaps, and typical hiring patterns."
)

USER_PROMPT_TEMPLATE = "Match analysis:\n{match_analysis}\n\nReturn JSON: interview_probability, key_factors."


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def _call_ai(match_analysis: str) -> str:
    """Call AI chat completion with retries (OpenAI or Gemini based on AI_PROVIDER)."""
    return chat_completion_json(
        system=SYSTEM_PROMPT,
        user=USER_PROMPT_TEMPLATE.format(match_analysis=match_analysis[:5000]),
        temperature=0.2,
    )


def estimate_interview_probability(match_analysis: dict | str) -> dict | None:
    """
    Estimate interview probability from match analysis.

    match_analysis: dict from job_matcher or a string description.
    Returns a dict with: interview_probability, key_factors.
    Returns None on failure.
    """
    if isinstance(match_analysis, dict):
        parts = [
            f"Match score: {match_analysis.get('match_score', 0)}",
            f"Matched skills: {match_analysis.get('matched_skills', [])}",
            f"Missing skills: {match_analysis.get('missing_skills', [])}",
            f"Reasoning: {match_analysis.get('reasoning', '')}",
        ]
        text = "\n".join(parts)
    elif isinstance(match_analysis, str) and match_analysis.strip():
        text = match_analysis
    else:
        logger.warning("estimate_interview_probability called with empty/invalid input")
        return None

    cache_key = "interview_prob:v1:" + hashlib.sha256(text.encode()).hexdigest()
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    try:
        content = _call_ai(text)
        data = json.loads(content)

        prob = data.get("interview_probability", 0)
        if isinstance(prob, (int, float)):
            prob = max(0, min(100, int(prob)))
        else:
            prob = 0

        result = {
            "interview_probability": prob,
            "key_factors": data.get("key_factors", [])
            if isinstance(data.get("key_factors"), list)
            else [],
        }
        cache.set(cache_key, result, CACHE_TTL)
        return result

    except Exception as e:
        logger.exception("Interview probability estimation failed: %s", e)
        return None
