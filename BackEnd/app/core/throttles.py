"""Rate limit throttles for HireSense API."""
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class AIEndpointThrottle(UserRateThrottle):
    """Strict limit for AI endpoints (OpenAI usage)."""

    scope = "ai"


class AuthRateThrottle(AnonRateThrottle):
    """Limit for auth endpoints to prevent brute force (by IP for unauthenticated)."""

    scope = "auth"
