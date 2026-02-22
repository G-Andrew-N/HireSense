"""Built-in job site definitions. Used for seeding and auto-creation."""
from core.models import JobSite

BUILTIN_SITES = [
    # Remote Job Boards
    {
        "name": "We Work Remotely",
        "url": "https://weworkremotely.com/categories/remote-programming-jobs.rss",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {},
    },
    {
        "name": "Remote.ok",
        "url": "https://remote.ok/jobs.rss",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {},
    },
    {
        "name": "JustRemote",
        "url": "https://justremote.co/feed.rss",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {},
    },
    # Remotive RSS feed returns 404 - using RemotiveFetcher API instead (profession-aware fetch)
    # {
    #     "name": "Remotive",
    #     "url": "https://remotive.com/remote-jobs/all/feed",
    #     "source_type": JobSite.SourceType.RSS,
    #     "scrape_config": {"keywords": "remote"},
    # },
    # Tech Job Boards
    {
        "name": "GitHub Jobs",
        "url": "https://github.com/jobs/feed",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {},
    },
    {
        "name": "Stack Overflow Jobs",
        "url": "https://stackoverflow.com/jobs/feed",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {},
    },
    {
        "name": "DEV Community Jobs",
        "url": "https://dev.to/api/articles?tags=jobs",
        "source_type": JobSite.SourceType.GENERIC,
        "scrape_config": {"keywords": "remote, job"},
    },
    # Design & Creative Jobs
    {
        "name": "Dribbble Remote",
        "url": "https://dribbble.com/jobs/feeds/remote",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {"keywords": "remote"},
    },
    # General Job Boards
    {
        "name": "Indeed",
        "url": "https://www.indeed.com/rss?q=remote&l=Remote",
        "source_type": JobSite.SourceType.INDEED,
        "scrape_config": {"keywords": "remote", "location": "Remote"},
    },
    {
        "name": "LinkedIn",
        "url": "https://www.linkedin.com/jobs/",
        "source_type": JobSite.SourceType.LINKEDIN,
        "scrape_config": {"keywords": "remote"},
    },
    {
        "name": "Glassdoor",
        "url": "https://www.glassdoor.com/Job/",
        "source_type": JobSite.SourceType.GLASSDOOR,
        "scrape_config": {"keywords": "remote"},
    },
    {
        "name": "ZipRecruiter",
        "url": "https://www.ziprecruiter.com/jobs",
        "source_type": JobSite.SourceType.ZIPRECRUITER,
        "scrape_config": {"keywords": "remote"},
    },
    # Startup & IT Jobs
    {
        "name": "AngelList",
        "url": "https://angel.co/jobs?filters[job_types][]=Full%20Time&filters[remote_ok][]=true",
        "source_type": JobSite.SourceType.GENERIC,
        "scrape_config": {"keywords": "remote, startup"},
    },
    # Freelance & Contract
    {
        "name": "We Work Remotely - Design",
        "url": "https://weworkremotely.com/categories/remote-design-jobs.rss",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {"keywords": "design"},
    },
    {
        "name": "We Work Remotely - Marketing",
        "url": "https://weworkremotely.com/categories/remote-marketing-jobs.rss",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {"keywords": "marketing"},
    },
    {
        "name": "We Work Remotely - Sales",
        "url": "https://weworkremotely.com/categories/remote-sales-jobs.rss",
        "source_type": JobSite.SourceType.RSS,
        "scrape_config": {"keywords": "sales"},
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
