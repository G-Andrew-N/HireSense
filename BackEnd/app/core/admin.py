from django.contrib import admin
from django.contrib.auth import get_user_model

from .models import JobMatch, JobPosting, JobSite, Resume, ResumeInsight, UserProfile

User = get_user_model()


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")
    search_fields = ("user__email",)


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "source", "fetched_at")
    list_filter = ("source",)
    search_fields = ("title", "company", "source")


@admin.register(JobSite)
class JobSiteAdmin(admin.ModelAdmin):
    list_display = ("name", "url", "enabled", "is_builtin", "user")
    list_filter = ("enabled", "is_builtin")
    search_fields = ("name", "url")


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ("user", "original_filename", "version", "uploaded_at")
    list_filter = ("uploaded_at",)
    search_fields = ("user__email", "original_filename")


@admin.register(JobMatch)
class JobMatchAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "match_score", "interview_probability", "user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("title", "company", "user__email")


@admin.register(ResumeInsight)
class ResumeInsightAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "impact", "user", "created_at")
    list_filter = ("category", "impact")
    search_fields = ("title", "description", "user__email")
