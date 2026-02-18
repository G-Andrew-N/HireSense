"""
Provider-specific fetchers (Indeed, LinkedIn, Glassdoor, ZipRecruiter).

Note on ToS and APIs:
- LinkedIn: No public job API. Scraping violates ToS. Use official partner APIs if available.
- Indeed: Has Indeed Publisher API (employers) and RSS for saved searches (region-dependent).
- Glassdoor: No public API. Scraping against ToS.
- ZipRecruiter: Partner API for employers, not job seekers.

These stubs use RSS where available (e.g. Indeed) or return empty with a note.
"""

import logging
from urllib.parse import urlencode

from .base import JobFetcherResult, RawJob
from .rss_fetcher import RSSJobFetcher

logger = logging.getLogger(__name__)


class IndeedFetcher(RSSJobFetcher):
    """
    Indeed: Use RSS feed. Build URL from config: q=keywords, l=location.
    Example: https://www.indeed.com/rss?q=python&l=Remote
    """

    def fetch(self) -> JobFetcherResult:
        q = self.config.get("keywords", "").strip() or "jobs"
        l = self.config.get("location", "").strip()
        params = {"q": q}
        if l:
            params["l"] = l
        rss_url = f"https://www.indeed.com/rss?{urlencode(params)}"
        self.url = rss_url
        return super().fetch()


class LinkedInFetcher:
    """
    LinkedIn: No public job API for job seekers.
    Scraping violates LinkedIn ToS.
    Implement when/if official API access is available.
    """

    def __init__(self, url: str, source_name: str, config: dict | None = None):
        self.url = url
        self.source_name = source_name
        self.config = config or {}

    def fetch(self) -> JobFetcherResult:
        logger.warning("LinkedIn fetcher: No public API. Use official partner integration.")
        return JobFetcherResult(jobs=[], error="LinkedIn requires API partnership")


class GlassdoorFetcher:
    """Glassdoor: No public API. Scraping against ToS."""

    def __init__(self, url: str, source_name: str, config: dict | None = None):
        self.url = url
        self.source_name = source_name
        self.config = config or {}

    def fetch(self) -> JobFetcherResult:
        logger.warning("Glassdoor fetcher: No public API.")
        return JobFetcherResult(jobs=[], error="Glassdoor has no public job API")


class ZipRecruiterFetcher:
    """ZipRecruiter: Partner API is for employers, not job seekers."""

    def __init__(self, url: str, source_name: str, config: dict | None = None):
        self.url = url
        self.source_name = source_name
        self.config = config or {}

    def fetch(self) -> JobFetcherResult:
        logger.warning("ZipRecruiter fetcher: Partner API for employers only.")
        return JobFetcherResult(jobs=[], error="ZipRecruiter API is employer-only")
