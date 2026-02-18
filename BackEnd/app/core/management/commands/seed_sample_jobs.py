"""Seed sample job postings for development/demo when RSS feeds return no data."""
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from core.models import JobPosting


SAMPLE_JOBS = [
    {
        "source": "Demo",
        "external_url": "https://example.com/jobs/1",
        "title": "Senior Software Engineer",
        "company": "Tech Corp",
        "location": "Remote",
        "salary": "$120k - $180k",
        "description": "We're looking for a Senior Software Engineer with 5+ years of experience in Python, React, and cloud services. You'll build scalable web applications and work with our AI/ML team. Strong communication skills and experience with Agile required.",
        "posted_date": date.today() - timedelta(days=2),
    },
    {
        "source": "Demo",
        "external_url": "https://example.com/jobs/2",
        "title": "Full Stack Developer",
        "company": "StartupXYZ",
        "location": "New York, NY (Remote)",
        "salary": "$100k - $150k",
        "description": "Full stack developer needed for fast-growing SaaS startup. Requirements: JavaScript/TypeScript, Node.js, PostgreSQL, React. Experience with AWS or GCP preferred. Join our small team and have real impact.",
        "posted_date": date.today() - timedelta(days=1),
    },
    {
        "source": "Demo",
        "external_url": "https://example.com/jobs/3",
        "title": "Backend Engineer",
        "company": "DataFlow Inc",
        "location": "San Francisco, CA",
        "salary": "$130k - $190k",
        "description": "Backend engineer to design and build our data pipeline infrastructure. Python, Django, Celery, Redis, Kafka. Experience with ETL and data warehousing a plus. We value clean code and system design.",
        "posted_date": date.today(),
    },
    {
        "source": "Demo",
        "external_url": "https://example.com/jobs/4",
        "title": "Frontend Engineer",
        "company": "Design Studio",
        "location": "Remote (US)",
        "salary": "$90k - $140k",
        "description": "Frontend engineer for design-forward product team. React, TypeScript, Tailwind CSS. You care about accessibility, performance, and beautiful UX. Portfolio of shipped products required.",
        "posted_date": date.today() - timedelta(days=3),
    },
    {
        "source": "Demo",
        "external_url": "https://example.com/jobs/5",
        "title": "DevOps Engineer",
        "company": "CloudScale",
        "location": "Austin, TX",
        "salary": "$110k - $160k",
        "description": "DevOps/SRE to own our Kubernetes and CI/CD infrastructure. Terraform, Docker, GitHub Actions, Prometheus. On-call rotation. Help us scale to millions of users.",
        "posted_date": date.today() - timedelta(days=1),
    },
]


class Command(BaseCommand):
    help = "Seed sample job postings for demo (run before match analysis if RSS returns nothing)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Remove existing Demo jobs before seeding",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            deleted, _ = JobPosting.objects.filter(source="Demo").delete()
            if deleted:
                self.stdout.write(f"Removed {deleted} existing Demo jobs.")

        created = 0
        for data in SAMPLE_JOBS:
            obj, was_created = JobPosting.objects.update_or_create(
                source=data["source"],
                external_url=data["external_url"],
                defaults={
                    "title": data["title"],
                    "company": data["company"],
                    "location": data["location"],
                    "salary": data["salary"],
                    "description": data["description"],
                    "posted_date": data["posted_date"],
                },
            )
            if was_created:
                created += 1

        self.stdout.write(self.style.SUCCESS(f"Done. Created {created} sample jobs. Run match analysis to get matches."))
