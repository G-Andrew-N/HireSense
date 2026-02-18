# Job source fetchers: RSS, generic scraper, and provider stubs
from .base import JobFetcherResult, RawJob
from .registry import get_fetcher, fetch_jobs_for_site

__all__ = [
    "JobFetcherResult",
    "RawJob",
    "get_fetcher",
    "fetch_jobs_for_site",
]
