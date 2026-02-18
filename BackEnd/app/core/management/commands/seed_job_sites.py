"""Seed built-in job sites with RSS URLs and source types."""
from django.core.management.base import BaseCommand

from core.builtin_job_sites import ensure_builtin_job_sites


class Command(BaseCommand):
    help = "Seed built-in job sites (run after migrate)"

    def handle(self, *args, **options):
        created = ensure_builtin_job_sites()
        self.stdout.write(self.style.SUCCESS(f"Done. Created {created} sites."))
