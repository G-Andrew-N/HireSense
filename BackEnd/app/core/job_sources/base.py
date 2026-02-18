"""Base classes for job source fetchers."""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import date
from typing import Any


@dataclass
class RawJob:
    """A single raw job from any source."""

    source: str
    external_url: str
    title: str
    company: str
    location: str = ""
    salary: str = ""
    description: str = ""
    posted_date: date | None = None
    logo: str = ""
    raw_data: dict[str, Any] | None = None


@dataclass
class JobFetcherResult:
    """Result of fetching jobs from a source."""

    jobs: list[RawJob]
    error: str | None = None
    fetched_count: int = 0


class BaseJobFetcher(ABC):
    """Abstract base for job fetchers. Respects robots.txt where applicable."""

    def __init__(self, url: str, source_name: str, config: dict | None = None):
        self.url = url
        self.source_name = source_name
        self.config = config or {}

    @abstractmethod
    def fetch(self) -> JobFetcherResult:
        """Fetch jobs from this source."""
        pass
