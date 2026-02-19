"""RSS/Atom feed fetcher for job listings."""
import logging
from datetime import date
from time import struct_time

from .base import BaseJobFetcher, JobFetcherResult, RawJob

logger = logging.getLogger(__name__)


class RSSJobFetcher(BaseJobFetcher):
    """Fetch jobs from RSS/Atom feeds."""

    def fetch(self) -> JobFetcherResult:
        try:
            import feedparser
            import requests
            import time

            # Use requests first so we can handle 429 / Retry-After headers
            max_attempts = self.config.get("max_attempts", 3)
            backoff_base = float(self.config.get("backoff_base", 2))
            resp = None
            for attempt in range(1, max_attempts + 1):
                try:
                    resp = requests.get(self.url, headers={"User-Agent": "HireSense/1.0 (Job Aggregator)"}, timeout=20)
                    if resp.status_code == 429:
                        ra = resp.headers.get("Retry-After")
                        wait = int(ra) if ra and ra.isdigit() else (backoff_base ** attempt)
                        logger.warning("RSS fetch 429 for %s; retrying after %s seconds (attempt %d)", self.url, wait, attempt)
                        time.sleep(wait)
                        continue
                    resp.raise_for_status()
                    break
                except requests.RequestException as e:
                    if attempt == max_attempts:
                        logger.exception("RSS HTTP fetch failed for %s: %s", self.url, e)
                        return JobFetcherResult(jobs=[], error=str(e))
                    wait = backoff_base ** attempt
                    logger.warning("RSS HTTP transient error for %s: %s (attempt %d), retrying in %s seconds", self.url, e, attempt, wait)
                    time.sleep(wait)

            feed = feedparser.parse(resp.content if resp is not None else self.url)
        except Exception as e:
            err_str = str(e)
            # Indeed and some sites return HTML instead of RSS, causing XML parse errors; no traceback needed
            is_parse_error = (
                "SAXParseException" in type(e).__name__
                or "ExpatError" in type(e).__name__
                or "SAXParseException" in err_str
            )
            if is_parse_error:
                logger.debug("RSS parse failed (likely non-RSS response) for %s: %s", self.url, err_str)
            else:
                logger.exception("RSS fetch failed for %s: %s", self.url, e)
            return JobFetcherResult(jobs=[], error=err_str)

        if feed.bozo and not feed.entries:
            return JobFetcherResult(
                jobs=[],
                error=feed.bozo_exception.__class__.__name__ if feed.bozo_exception else "Parse error",
            )

        jobs = []
        for entry in feed.entries:
            link = getattr(entry, "link", "") or ""
            if not link:
                continue

            title = getattr(entry, "title", "") or "Untitled"
            summary = getattr(entry, "summary", "") or getattr(entry, "description", "") or ""

            company = ""
            if hasattr(entry, "author") and entry.author:
                company = entry.author
            elif hasattr(entry, "source") and hasattr(entry.source, "title"):
                company = entry.source.title

            published = getattr(entry, "published_parsed", None) or getattr(entry, "updated_parsed", None)
            posted_date = None
            if published and isinstance(published, struct_time):
                try:
                    posted_date = date(published.tm_year, published.tm_mon, published.tm_mday)
                except (ValueError, TypeError):
                    pass

            jobs.append(
                RawJob(
                    source=self.source_name,
                    external_url=link,
                    title=title,
                    company=company or "Unknown",
                    location="",
                    salary="",
                    description=summary,
                    posted_date=posted_date,
                    logo="",
                    raw_data={"entry_id": getattr(entry, "id", "")},
                )
            )

        return JobFetcherResult(jobs=jobs, fetched_count=len(jobs))
