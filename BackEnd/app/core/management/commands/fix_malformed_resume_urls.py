from django.core.management.base import BaseCommand

from core.models import Resume


class Command(BaseCommand):
    help = "Fix malformed resume file URLs missing a slash after the protocol."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would change without saving.",
        )

    def handle(self, *args, **options):
        dry_run = options.get("dry_run", False)
        updated = 0
        scanned = 0

        for resume in Resume.objects.exclude(file=""):
            scanned += 1
            if not resume.file or not isinstance(resume.file.name, str):
                continue

            file_name = resume.file.name
            fixed_name = self._fix_url(file_name)
            if fixed_name and fixed_name != file_name:
                updated += 1
                if dry_run:
                    self.stdout.write(
                        f"DRY RUN: Resume {resume.id} -> {file_name} => {fixed_name}"
                    )
                    continue
                resume.file.name = fixed_name
                resume.save(update_fields=["file"])
                self.stdout.write(
                    f"Updated resume {resume.id}: {file_name} => {fixed_name}"
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Scanned {scanned}, updated {updated} (dry_run={dry_run})."
            )
        )

    @staticmethod
    def _fix_url(url):
        if not url or not isinstance(url, str):
            return None
        if url.startswith("https:/") and not url.startswith("https://"):
            return "https://" + url[len("https:/") :]
        if url.startswith("http:/") and not url.startswith("http://"):
            return "http://" + url[len("http:/") :]
        return url
