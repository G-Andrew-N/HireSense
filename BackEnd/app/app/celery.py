"""Celery app for HireSense."""
import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

app = Celery("hiresense")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    "scan-job-sites-every-6h": {
        "task": "core.tasks.scan_all_job_sites",
        "schedule": crontab(minute=0, hour="*/6"),
    },
    "run-match-analysis-daily": {
        "task": "core.tasks.run_match_analysis_for_all_users",
        "schedule": crontab(minute=30, hour=7),
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
