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
    "analyze-new-jobs-every-30min": {
        "task": "core.tasks.analyze_new_jobs_for_all_users",
        "schedule": crontab(minute="*/30"),  # Every 30 minutes for faster updates
    },
    "run-full-match-analysis-4x-daily": {
        "task": "core.tasks.run_match_analysis_for_all_users",
        "schedule": crontab(minute=0, hour="*/6"),  # 12:00 AM, 6:00 AM, 12:00 PM, 6:00 PM
    },
    "send-daily-match-notifications": {
        "task": "core.tasks.send_daily_match_notifications",
        "schedule": crontab(minute=0, hour=8),  # 8:00 AM daily for email digests
    },
    "send-high-match-alerts": {
        "task": "core.tasks.send_high_match_alerts",
        "schedule": crontab(minute="*/30"),  # Every 30 minutes for instant alerts
    },
    "send-weekly-reports": {
        "task": "core.tasks.send_weekly_reports",
        "schedule": crontab(minute=0, hour=9, day_of_week=1),  # Monday at 9:00 AM
    },
}


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
