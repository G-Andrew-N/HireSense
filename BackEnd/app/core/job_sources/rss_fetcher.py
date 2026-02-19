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

            feed = feedparser.parse(
                self.url,
                request_headers={"User-Agent": "HireSense/1.0 (Job Aggregator)"},
            )
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
