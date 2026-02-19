"""Remotive API fetcher for remote job listings (free, no API key required)."""
import logging
from datetime import datetime
from urllib.parse import urlencode

import requests

from .base import BaseJobFetcher, JobFetcherResult, RawJob

logger = logging.getLogger(__name__)

REMOTIVE_API_BASE = "https://remotive.com/api/remote-jobs"
USER_AGENT = "HireSense/1.0 (Job Aggregator; +https://hiresense.ai)"


class RemotiveFetcher(BaseJobFetcher):
    """
    Remotive job search API fetcher.
    Completely free, no API key required. Covers remote positions across all industries.
    """

    def fetch(self) -> JobFetcherResult:
        try:
            keywords = self.config.get("keywords", "").strip() or "jobs"
            
            # Build Remotive API URL with search
            params = {
                "search": keywords,
                "limit": 30,
            }
            
            url = f"{REMOTIVE_API_BASE}?{urlencode(params)}"
            
            resp = requests.get(
                url,
                headers={"User-Agent": USER_AGENT},
                timeout=20,
            )
            resp.raise_for_status()
            
            data = resp.json()
            jobs = []
            
            # Parse Remotive results format
            for result in data.get("jobs", []):
                try:
                    posted_date = None
                    if result.get("publication_date"):
                        try:
                            dt = datetime.fromisoformat(result["publication_date"].replace("Z", "+00:00"))
                            posted_date = dt.date()
                        except (ValueError, AttributeError):
                            pass
                    
                    jobs.append(
                        RawJob(
                            source=self.source_name,
                            external_url=result.get("url", ""),
                            title=result.get("title", "Untitled")[:500],
                            company=result.get("company_name", "Unknown"),
                            location="Remote",  # Remotive only has remote jobs
                            salary=result.get("salary", ""),
                            description=result.get("description", "")[:2000],
                            posted_date=posted_date,
                            logo=result.get("company_logo_url", ""),
                            raw_data={"remotive_id": result.get("id", "")},
                        )
                    )
                except Exception as e:
                    logger.warning("Error parsing Remotive job result: %s", e)
            
            return JobFetcherResult(jobs=jobs, fetched_count=len(jobs))
        
        except requests.RequestException as e:
            logger.exception("Remotive fetch failed: %s", e)
            return JobFetcherResult(jobs=[], error=str(e))
        except Exception as e:
            logger.exception("Remotive parse error: %s", e)
            return JobFetcherResult(jobs=[], error=str(e))

