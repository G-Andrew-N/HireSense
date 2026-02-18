"""Built-in job site definitions. Used for seeding and auto-creation."""
from core.models import JobSite

BUILTIN_SITES = [
    {
        "name": "We Work Remotely",
        "url": "https://weworkremotely.com/categories/remote-programming-jobs.rss",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {},
    },
    {
        "name": "Indeed",
        "url": "https://www.indeed.com/rss?q=software+engineer&l=Remote",
        "source_type": JobSite.SourceType.INDEED,
        "scrape_config": {"keywords": "software engineer", "location": "Remote"},
    },
    {
        "name": "LinkedIn",
        "url": "https://www.linkedin.com/jobs/",
        "source_type": JobSite.SourceType.LINKEDIN,
        "scrape_config": {},
    },
    {
        "name": "Glassdoor",
        "url": "https://www.glassdoor.com/Job/",
        "source_type": JobSite.SourceType.GLASSDOOR,
        "scrape_config": {},
    },
    {
        "name": "ZipRecruiter",
        "url": "https://www.ziprecruiter.com/jobs",
        "source_type": JobSite.SourceType.ZIPRECRUITER,
        "scrape_config": {},
    },
]


def ensure_builtin_job_sites() -> int:
    """Create built-in job sites if they don't exist. Returns count created."""
    created = 0
    for data in BUILTIN_SITES:
        _, was_created = JobSite.objects.get_or_create(
            defaults={
                "url": data["url"],
                "enabled": True,
                "is_builtin": True,
                "source_type": data["source_type"],
                "scrape_config": data["scrape_config"],
            },
            name=data["name"],
            user=None,
        )
        if was_created:
            created += 1
    return created
