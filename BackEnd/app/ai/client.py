"""Unified AI client for HireSense. Supports OpenAI, Google Gemini, and Groq."""
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def _get_provider():
    return getattr(settings, "AI_PROVIDER", "openai") or "openai"


def get_openai_client():
    """Return configured OpenAI client."""
    from openai import OpenAI

    api_key = getattr(settings, "OPENAI_API_KEY", None)
    if not api_key:
        raise ValueError("OPENAI_API_KEY must be set in Django settings")
    return OpenAI(api_key=api_key)


def get_client():
    """Legacy: return OpenAI client. Use chat_completion_json for provider-agnostic calls."""
    return get_openai_client()


def chat_completion_json(
    system: str,
    user: str,
    temperature: float = 0.2,
) -> str:
    """
    Call AI chat completion and return JSON text. Uses OpenAI, Gemini, or Groq based on AI_PROVIDER.
    Raises ValueError if no API key. Raises on API errors.
    """
    provider = _get_provider()
    if provider == "gemini":
        return _chat_gemini(system, user, temperature)
    if provider == "groq":
        return _chat_groq(system, user, temperature)
    return _chat_openai(system, user, temperature)


def _chat_openai(system: str, user: str, temperature: float) -> str:
    from openai import OpenAI

    api_key = getattr(settings, "OPENAI_API_KEY", None)
    if not api_key:
        raise ValueError("OPENAI_API_KEY must be set in Django settings")
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        response_format={"type": "json_object"},
        temperature=temperature,
    )
    return response.choices[0].message.content or ""


def _chat_gemini(system: str, user: str, temperature: float) -> str:
    from google import genai
    from google.genai import types

    api_key = getattr(settings, "GEMINI_API_KEY", None)
    if not api_key:
        raise ValueError("GEMINI_API_KEY must be set when AI_PROVIDER=gemini")
    client = genai.Client(api_key=api_key)
    prompt = f"{system}\n\n---\n\n{user}"
    config = types.GenerateContentConfig(
        system_instruction=system,
        temperature=temperature,
        response_mime_type="application/json",
    )
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=user,
        config=config,
    )
    text = getattr(response, "text", None)
    if not text and getattr(response, "candidates", None) and len(response.candidates) > 0:
        c = response.candidates[0]
        if getattr(c, "content", None) and getattr(c.content, "parts", None) and len(c.content.parts) > 0:
            text = getattr(c.content.parts[0], "text", None)
    if not text:
        raise ValueError("Gemini returned empty response")
    return text


def _chat_groq(system: str, user: str, temperature: float) -> str:
    import time

    from groq import APIConnectionError, Groq, RateLimitError

    api_key = getattr(settings, "GROQ_API_KEY", None)
    if not api_key:
        raise ValueError("GROQ_API_KEY must be set when AI_PROVIDER=groq")
    client = Groq(api_key=api_key)

    # Simple distributed RPM limiter using Django cache (works when CACHE_URL is redis://...)
    # Prevents exceeding Groq RPM limits by gating requests per minute.
    from django.core.cache import cache
    from django.utils import timezone

    def _reserve_slot(attempts=1):
        """Try to reserve a slot for this minute. Returns (allowed: bool, current_count:int, limit:int)."""
        limit = int(getattr(settings, "GROQ_RPM", 30))
        key = f"groq_rpm:{timezone.now().strftime('%Y%m%d%H%M')}"
        try:
            # Ensure key exists with 80s TTL to cover minute boundary
            added = cache.add(key, 0, timeout=80)
            # Some cache backends (locmem) may not implement incr; guard it
            try:
                current = cache.incr(key, 1)
            except Exception:
                # fallback: read/replace (not atomic) — best-effort
                current = (cache.get(key) or 0) + 1
                cache.set(key, current, timeout=80)
            if current > limit:
                return False, current, limit
            return True, current, limit
        except Exception:
            # If cache not available or incr unsupported, allow by default
            return True, 0, limit

    last_err = None
    for attempt in range(6):
        # Try to reserve a slot before making the request
        allowed, current, limit = _reserve_slot()
        if not allowed:
            # If we're over limit, wait a short time proportional to attempts
            backoff = min(5 * (attempt + 1), 30)
            logger.warning(
                "Groq RPM limit reached (%d/%d). Waiting %ds before attempt %d.",
                current,
                limit,
                backoff,
                attempt + 1,
            )
            time.sleep(backoff)
            continue

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                response_format={"type": "json_object"},
                temperature=temperature,
            )
            return response.choices[0].message.content or ""
        except RateLimitError as e:
            last_err = e
            # Try to parse Retry info from message; fall back to 25s
            wait = 25
            try:
                # message may include seconds like 'Please try again in 17.27s'
                msg = str(e)
                import re

                m = re.search(r"in (\d+(?:\.\d+)?)s", msg)
                if m:
                    wait = max(5, int(float(m.group(1))))
            except Exception:
                pass
            if attempt < 5:
                logger.warning("Groq rate limit, waiting %ds before retry: %s", wait, e)
                time.sleep(wait)
                continue
            else:
                raise
        except APIConnectionError as e:
            last_err = e
            wait = 5 * (attempt + 1)
            if attempt < 5:
                logger.warning("Groq connection error, retry in %ds: %s", wait, e)
                time.sleep(wait)
                continue
            else:
                raise
    raise last_err
