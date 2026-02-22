from django.core.management.base import BaseCommand

from core.models import UserProfile


class Command(BaseCommand):
    help = "Fix malformed avatar URLs missing a slash after the protocol."

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

        for profile in UserProfile.objects.exclude(avatar=""):
            scanned += 1
            if not profile.avatar or not isinstance(profile.avatar.name, str):
                continue

            avatar_name = profile.avatar.name
            fixed_name = self._fix_url(avatar_name)
            if fixed_name and fixed_name != avatar_name:
                updated += 1
                if dry_run:
                    self.stdout.write(
                        f"DRY RUN: Profile {profile.id} -> {avatar_name} => {fixed_name}"
                    )
                    continue
                profile.avatar.name = fixed_name
                profile.save(update_fields=["avatar"])
                self.stdout.write(
                    f"Updated profile {profile.id}: {avatar_name} => {fixed_name}"
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
