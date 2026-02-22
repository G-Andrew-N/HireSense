"""Generate AI-powered resume improvement insights."""
import json
import logging

from tenacity import retry, stop_after_attempt, wait_exponential
from django.conf import settings

from .client import chat_completion_json

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You analyze resumes and produce actionable improvement suggestions to increase job match rates.
Return valid JSON only, no markdown or extra text.
Use this exact structure:
{
  "insights": [
    {
      "category": "critical" | "important" | "suggestion",
      "title": "Short actionable title",
      "description": "1-2 sentences explaining the issue and how to fix it",
      "impact": "high" | "medium" | "low"
    }
  ]
}

Guidelines:
- category "critical": serious gaps (missing key section, major formatting issues, no quantifiable achievements)
- category "important": notable improvements (weak summary, missing skills keywords, generic language)
- category "suggestion": minor optimizations (add certifications, strengthen verbs, tailor for ATS)
- Be specific to the resume content. Generate 3-8 insights.
"""

USER_PROMPT_TEMPLATE = """Resume text:
{resume_text}

Parsed structure (for context):
{parsed_json}

Provide improvement insights as JSON."""


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def _call_ai(resume_text: str, parsed_content: dict) -> str:
    """Call AI to generate insights (OpenAI or Gemini based on AI_PROVIDER)."""
    import json as _json

    provider = getattr(settings, "AI_PROVIDER", "openai") or "openai"
    # Groq has a smaller TPM limit; reduce prompt size to avoid 413 errors.
    if provider == "groq":
        max_resume_chars = 6000
        max_parsed_chars = 2000
    else:
        max_resume_chars = 12000
        max_parsed_chars = 4000

    parsed_json = _json.dumps(parsed_content, indent=2) if parsed_content else "{}"
    return chat_completion_json(
        system=SYSTEM_PROMPT,
        user=USER_PROMPT_TEMPLATE.format(
            resume_text=resume_text[:max_resume_chars],
            parsed_json=parsed_json[:max_parsed_chars],
        ),
        temperature=0.3,
    )


def generate_insights(resume_text: str, parsed_content: dict) -> list[dict]:
    """
    Generate resume improvement insights using AI.

    Returns a list of dicts: {category, title, description, impact}.
    Returns [] on failure or if API key is missing.
    """
    if not resume_text or not resume_text.strip():
        return []

    try:
        content = _call_ai(resume_text, parsed_content or {})
        data = json.loads(content)
    except ValueError:
        raise
    except Exception as e:
        logger.exception("Insight generation failed: %s", e)
        raise

    insights_raw = data.get("insights")
    if not isinstance(insights_raw, list):
        return []

    valid_categories = {"critical", "important", "suggestion"}
    valid_impacts = {"high", "medium", "low"}
    result = []
    for item in insights_raw:
        if not isinstance(item, dict):
            continue
        cat = (item.get("category") or "").lower()
        if cat not in valid_categories:
            cat = "suggestion"
        impact = (item.get("impact") or "medium").lower()
        if impact not in valid_impacts:
            impact = "medium"
        title = str(item.get("title") or "Improvement suggestion").strip()[:255]
        desc = str(item.get("description") or "").strip()
        if not title or not desc:
            continue
        result.append({
            "category": cat,
            "title": title,
            "description": desc,
            "impact": impact,
        })
    return result
