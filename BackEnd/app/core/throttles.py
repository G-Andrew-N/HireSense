"""Rate limit throttles for HireSense API."""
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class AIEndpointThrottle(UserRateThrottle):
    """Limit for AI endpoints (resume parse, job match analysis)."""

    scope = "ai"


class AIInsightsThrottle(UserRateThrottle):
    """Stricter limit for insights generate (expensive, one AI call per request)."""

    scope = "ai_insights"


class AIMatchThrottle(UserRateThrottle):
    """Limit for job match analysis trigger (multiple AI calls)."""

    scope = "ai_match"


class ScanThrottle(UserRateThrottle):
    """Limit for job scan (external fetches)."""

    scope = "scan"


class AuthRateThrottle(AnonRateThrottle):
    """Limit for auth endpoints to prevent brute force (by IP for unauthenticated)."""

    scope = "auth"
