"""
Generic HTTP scraper for user-added job sites.

Respects robots.txt. Uses simple heuristics to extract job-like content.
For complex sites, use RSS if available.
"""
import logging
from datetime import date
from urllib.robotparser import RobotFileParser
from urllib.parse import urljoin, urlparse

import time
import requests
from bs4 import BeautifulSoup

from .base import BaseJobFetcher, JobFetcherResult, RawJob

logger = logging.getLogger(__name__)

USER_AGENT = "HireSense/1.0 (Job Aggregator; +https://hiresense.ai)"


def _can_fetch(url: str) -> bool:
    """Check robots.txt. Returns True if allowed."""
    try:
        parsed = urlparse(url)
        base = f"{parsed.scheme}://{parsed.netloc}"
        rp = RobotFileParser()
        rp.set_url(f"{base}/robots.txt")
        rp.read()
        return rp.can_fetch(USER_AGENT, url)
    except Exception as e:
        logger.warning("robots.txt check failed for %s: %s", url, e)
        return True


class GenericJobFetcher(BaseJobFetcher):
    """
    Generic scraper. Tries common patterns: job cards, links with /job/ in URL, etc.
    """

    def fetch(self) -> JobFetcherResult:
        if not _can_fetch(self.url):
            return JobFetcherResult(jobs=[], error="Blocked by robots.txt")

        # Retry on transient errors (429 Too Many Requests) with exponential backoff
        max_attempts = self.config.get("max_attempts", 3)
        backoff_base = float(self.config.get("backoff_base", 2))
        resp = None
        for attempt in range(1, max_attempts + 1):
            try:
                resp = requests.get(
                    self.url,
                    headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"},
                    timeout=30,
                )
                if resp.status_code == 429:
                    # Honor Retry-After if provided, otherwise exponential backoff
                    ra = resp.headers.get("Retry-After")
                    wait = int(ra) if ra and ra.isdigit() else (backoff_base ** attempt)
                    logger.warning("Received 429 from %s; retrying after %s seconds (attempt %d)", self.url, wait, attempt)
                    time.sleep(wait)
                    continue
                resp.raise_for_status()
                break
            except requests.RequestException as e:
                # If last attempt, return error
                if attempt == max_attempts:
                    logger.exception("Generic fetch failed for %s: %s", self.url, e)
                    return JobFetcherResult(jobs=[], error=str(e))
                wait = backoff_base ** attempt
                logger.warning("Generic fetch transient error for %s: %s (attempt %d), retrying in %s seconds", self.url, e, attempt, wait)
                time.sleep(wait)

        if resp is None:
            return JobFetcherResult(jobs=[], error="No response after retries")

        try:
            soup = BeautifulSoup(resp.text, "html.parser")
        except Exception as e:
            return JobFetcherResult(jobs=[], error=f"Parse error: {e}")

        jobs = []
        seen_urls = set()

        # Common selectors for job links (configurable)
        selectors = self.config.get("selectors", [])
        if not selectors:
            selectors = [
                "a[href*='/job/']",
                "a[href*='/jobs/']",
                "a[href*='/careers/']",
                "a[href*='/position/']",
                ".job-listing a",
                ".job-card a",
                "[data-job-id] a",
            ]

        for sel in selectors:
            for a in soup.select(sel):
                href = a.get("href")
                if not href or not href.startswith("http"):
                    href = urljoin(self.url, href) if href else ""
                if not href or href in seen_urls:
                    continue

                title = a.get_text(strip=True) or "Job"
                if len(title) < 3:
                    continue

                seen_urls.add(href)
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
                        raw_data={},
                    )
                )

        return JobFetcherResult(jobs=jobs, fetched_count=len(jobs))
