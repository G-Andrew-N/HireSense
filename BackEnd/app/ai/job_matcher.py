"""Match resume to job description and compute match score using OpenAI."""
import json
import logging

from tenacity import retry, stop_after_attempt, wait_exponential

from .client import chat_completion_json

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You compare resumes to job descriptions and return match analysis as JSON only. "
    "Use this exact structure: {\"match_score\": <0-100>, "
    "\"matched_skills\": [\"skill1\", \"skill2\"], "
    "\"missing_skills\": [\"skill1\", \"skill2\"], "
    "\"reasoning\": \"\"}. "
    "Be fair: match_score reflects how well the resume fits the job. "
    "matched_skills are skills from the job description that appear in the resume. "
    "missing_skills are important job requirements not clearly present."
)

USER_PROMPT_TEMPLATE = """Resume:

{resume_text}

Job description:

{job_description}

Return JSON: match_score (0-100), matched_skills, missing_skills, reasoning."""


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def _call_ai(resume_text: str, job_description: str) -> str:
    """Call AI chat completion with retries (OpenAI or Gemini based on AI_PROVIDER)."""
    return chat_completion_json(
        system=SYSTEM_PROMPT,
        user=USER_PROMPT_TEMPLATE.format(
            resume_text=resume_text[:10000],
            job_description=job_description[:8000],
        ),
        temperature=0.2,
    )


def match_resume_to_job(resume_text: str, job_description: str) -> dict | None:
    """
    Compare resume to job description and return match analysis.

    Returns a dict with: match_score, matched_skills, missing_skills, reasoning.
    Returns None on failure.
    """
    if not resume_text or not resume_text.strip():
        logger.warning("match_resume_to_job called with empty resume text")
        return None
    if not job_description or not job_description.strip():
        logger.warning("match_resume_to_job called with empty job description")
        return None

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
        return result

    except Exception as e:
        logger.exception("Job matching failed: %s", e)
        return None
