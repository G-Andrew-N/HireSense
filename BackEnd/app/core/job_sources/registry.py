"""Registry and orchestration for job fetchers."""
from .adzuna_fetcher import RemotiveFetcher
from .base import BaseJobFetcher, JobFetcherResult
from .generic_fetcher import GenericJobFetcher
from .provider_stubs import (
    GlassdoorFetcher,
    IndeedFetcher,
    LinkedInFetcher,
    ZipRecruiterFetcher,
)
from .rss_fetcher import RSSJobFetcher


_FETCHER_MAP = {
    "rss": RSSJobFetcher,
    "generic": GenericJobFetcher,
    "indeed": IndeedFetcher,
    "remotive": RemotiveFetcher,
    "linkedin": LinkedInFetcher,
    "glassdoor": GlassdoorFetcher,
    "ziprecruiter": ZipRecruiterFetcher,
}


def get_fetcher(source_type: str, url: str, source_name: str, config: dict | None = None) -> BaseJobFetcher:
    """Return the appropriate fetcher for the source type."""
    cls = _FETCHER_MAP.get(source_type.lower(), RSSJobFetcher)
    return cls(url=url, source_name=source_name, config=config or {})


def fetch_jobs_for_site(site) -> JobFetcherResult:
    """
    Fetch jobs for a JobSite instance.

    site: JobSite model instance with url, source_type, name, scrape_config.
    """
    fetcher = get_fetcher(
        source_type=site.source_type,
        url=site.url,
        source_name=site.name,
        config=site.scrape_config,
    )
    return fetcher.fetch()
