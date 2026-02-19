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
from urllib.parse import urlencode, urljoin

from .base import JobFetcherResult, RawJob
from .rss_fetcher import RSSJobFetcher
from bs4 import BeautifulSoup
import requests
import time
from django.core.cache import cache
from django.conf import settings

logger = logging.getLogger(__name__)


class IndeedFetcher(RSSJobFetcher):
    """
    Indeed: Use RSS feed. Build URL from config: q=keywords, l=location.
    Example: https://www.indeed.com/rss?q=python&l=Remote
    """

    def fetch(self) -> JobFetcherResult:
        # Circuit-breaker: skip Indeed fetches for a short period if site blocked
        block_key = "job_fetch_block:indeed"
        block_ttl = int(getattr(settings, "JOB_FETCH_BLOCK_TTL", 3600))
        if cache.get(block_key):
            return JobFetcherResult(jobs=[], error="Skipped Indeed fetch: site temporarily blocked")

        q = self.config.get("keywords", "").strip() or "jobs"
        l = self.config.get("location", "").strip()
        params = {"q": q}
        if l:
            params["l"] = l
        rss_url = f"https://www.indeed.com/rss?{urlencode(params)}"
        self.url = rss_url
        # Try RSS first
        result = super().fetch()
        # If RSS parse failed or returned no entries, attempt an HTML search fallback
        if result.error or not result.jobs:
            # If RSS returned a 403/404/429-like error, mark as blocked to avoid repeated attempts
            err = (result.error or "").lower()
            if any(code in err for code in ("403", "forbidden", "404", "not found", "429", "too many")):
                cache.set(block_key, True, timeout=block_ttl)
                logger.info("Indeed appears blocked (RSS error '%s'); skipping further attempts for %s seconds", err, block_ttl)
            try:
                search_q = urlencode({"q": q})
                search_url = f"https://www.indeed.com/jobs?{search_q}"
                if l:
                    search_url += f"&l={urlencode({'l': l})[2:]}"

                headers = {"User-Agent": "HireSense/1.0 (Job Aggregator)"}
                resp = requests.get(search_url, headers=headers, timeout=20)
                if resp.status_code == 429:
                    ra = resp.headers.get("Retry-After")
                    wait = int(ra) if ra and ra.isdigit() else 5
                    logger.warning("Indeed HTML search got 429; waiting %s seconds", wait)
                    time.sleep(wait)
                    resp = requests.get(search_url, headers=headers, timeout=20)
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "html.parser")
                jobs = []
                # Common Indeed selectors for job cards/links
                selectors = ["a.tapItem", "a[data-jk]", "a.jobTitle", "a.jcs-JobTitle"]
                seen = set()
                for sel in selectors:
                    for a in soup.select(sel):
                        href = a.get("href") or ""
                        if href and not href.startswith("http"):
                            href = urljoin("https://www.indeed.com", href)
                        if not href or href in seen:
                            continue
                        title = a.get_text(strip=True) or "Job"
                        seen.add(href)
                        jobs.append(
                            RawJob(
                                source=self.source_name,
                                external_url=href,
                                title=title[:500],
                                company="",
                                location="",
                                salary="",
                                description="",
                                posted_date=None,
                                logo="",
                                raw_data={"fetched_via": "indeed_html"},
                            )
                        )
                if jobs:
                    return JobFetcherResult(jobs=jobs, fetched_count=len(jobs))
            except Exception as e:
                # If HTML fallback failed with an HTTP error, set block key for transient blocking status
                try:
                    import requests as _req

                    if isinstance(e, _req.HTTPError) and getattr(e, "response", None) is not None:
                        status = e.response.status_code
                        if status in (403, 404, 429):
                            cache.set(block_key, True, timeout=block_ttl)
                except Exception:
                    pass
                logger.info("Indeed HTML fallback failed: %s", e)
        return result


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
