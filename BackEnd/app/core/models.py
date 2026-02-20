from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    """
    Extension of Django's User for HireSense-specific profile data.
    Use get_user_model() for auth; this holds optional extra fields.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    avatar = models.ImageField(
        upload_to="avatars/%Y/%m/",
        null=True,
        blank=True,
        help_text="Profile photo.",
    )
    primary_resume = models.ForeignKey(
        "Resume",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="primary_for_profiles",
        help_text="Resume used for job matches and insights when set; otherwise latest by upload.",
    )
    email_notifications = models.BooleanField(
        default=True,
        help_text="Get daily summaries of new matches via email.",
    )
    high_match_alerts = models.BooleanField(
        default=True,
        help_text="Instant alerts for 85%+ matches.",
    )
    weekly_reports = models.BooleanField(
        default=False,
        help_text="Summary of activity and insights sent weekly.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "core_user_profile"

    def __str__(self):
        return f"Profile for {self.user.email}"


class JobPosting(models.Model):
    """
    Raw job posting from any source. Deduplicated by (source, external_url).
    """

    source = models.CharField(max_length=100, db_index=True)
    external_url = models.URLField(max_length=1000, unique=False)
    title = models.CharField(max_length=500)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    salary = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True, help_text="Job description for matching.")
    posted_date = models.DateField(null=True, blank=True)
    logo = models.URLField(max_length=500, blank=True)
    fetched_at = models.DateTimeField(auto_now_add=True)
    raw_data = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "core_job_posting"
        ordering = ["-fetched_at"]
        unique_together = [["source", "external_url"]]
        indexes = [
            models.Index(fields=["source"]),
            models.Index(fields=["fetched_at"]),
        ]

    def __str__(self):
        return f"{self.title} @ {self.company} ({self.source})"


class JobSite(models.Model):
    """
    Job board / posting site. Can be built-in (is_builtin=True) or user-added.
    """

    class SourceType(models.TextChoices):
        RSS = "rss", "RSS/Atom Feed"
        GENERIC = "generic", "Generic Scraper"
        INDEED = "indeed", "Indeed (API/RSS)"
        LINKEDIN = "linkedin", "LinkedIn (API key required)"
        GLASSDOOR = "glassdoor", "Glassdoor"
        ZIPRECRUITER = "ziprecruiter", "ZipRecruiter"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_sites",
        null=True,
        blank=True,
        help_text="Null for global built-in sites; set for user-added sites.",
    )
    name = models.CharField(max_length=255)
    url = models.URLField(max_length=500)
    enabled = models.BooleanField(default=True)
    logo = models.URLField(max_length=500, blank=True)
    is_builtin = models.BooleanField(
        default=False,
        help_text="Built-in sites (e.g. LinkedIn, Indeed) cannot be deleted by user.",
    )
    source_type = models.CharField(
        max_length=20,
        choices=SourceType.choices,
        default=SourceType.RSS,
        help_text="How to fetch jobs: RSS feed, generic scraper, or specific API.",
    )
    scrape_config = models.JSONField(
        default=dict,
        blank=True,
        help_text="Extra config: keywords, location, CSS selectors, etc.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "core_job_site"
        ordering = ["-is_builtin", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "url"],
                condition=models.Q(user__isnull=False),
                name="core_job_site_user_url_unique",
            ),
        ]

    def __str__(self):
        return self.name


class Resume(models.Model):
    """
    User resume file with versioning and optional parsed content for matching.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resumes",
    )
    file = models.FileField(upload_to="resumes/%Y/%m/", max_length=500)
    original_filename = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    # Version: increment when user uploads a new file; latest = current resume
    version = models.PositiveIntegerField(default=1)
    # Parsed content from AI/file parsing (skills, experience, education, etc.)
    parsed_content = models.JSONField(
        default=dict,
        blank=True,
        help_text="Structured data: skills, experience, education, summary, etc.",
    )
    raw_text = models.TextField(
        blank=True,
        help_text="Plain text extraction for search/display.",
    )

    class Meta:
        db_table = "core_resume"
        ordering = ["-uploaded_at"]
        get_latest_by = "uploaded_at"

    def __str__(self):
        return f"{self.original_filename or self.file.name} (v{self.version})"


class JobMatch(models.Model):
    """
    A job posting matched to the user's resume with score and probability.
    """

    job_posting = models.ForeignKey(
        "JobPosting",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="matches",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_matches",
    )
    job_site = models.ForeignKey(
        JobSite,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="job_matches",
    )
    # Job details
    title = models.CharField(max_length=500)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)
    salary = models.CharField(max_length=100, blank=True)
    posted_date = models.DateField(null=True, blank=True)
    external_url = models.URLField(max_length=1000, blank=True)
    logo = models.URLField(max_length=500, blank=True)
    # Source label for display (e.g. "LinkedIn", "Indeed") if job_site is null
    source = models.CharField(max_length=100, blank=True)
    # Match analysis
    match_score = models.PositiveIntegerField(
        help_text="0-100 resume vs job description match.",
    )
    interview_probability = models.PositiveIntegerField(
        help_text="0-100 estimated interview probability.",
    )
    skills = models.JSONField(
        default=list,
        help_text="List of skills that matched (strings).",
    )
    missing_skills = models.JSONField(
        default=list,
        help_text="List of skills in job description not found on resume.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    applied_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the user marked this job as applied (application completed).",
    )

    class Meta:
        db_table = "core_job_match"
        ordering = ["-match_score", "-created_at"]
        verbose_name_plural = "Job matches"

    def __str__(self):
        return f"{self.title} @ {self.company} ({self.match_score}%)"


class ResumeInsight(models.Model):
    """
    AI-generated suggestion to improve the user's resume.
    """

    class Category(models.TextChoices):
        CRITICAL = "critical", "Critical"
        IMPORTANT = "important", "Important"
        SUGGESTION = "suggestion", "Suggestion"

    class Impact(models.TextChoices):
        HIGH = "high", "High"
        MEDIUM = "medium", "Medium"
        LOW = "low", "Low"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resume_insights",
    )
    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="insights",
        help_text="Insight for this resume version; null if general.",
    )
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    impact = models.CharField(
        max_length=20,
        choices=Impact.choices,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the user marked this suggestion as completed (applied manually).",
    )

    class Meta:
        db_table = "core_resume_insight"
        ordering = ["category", "-created_at"]

    def __str__(self):
        return f"{self.get_category_display()}: {self.title}"

class SystemNotification(models.Model):
    """
    System-wide notification for all users managed by superusers.
    Used for maintenance announcements, important updates, etc.
    """

    class NotificationType(models.TextChoices):
        MAINTENANCE = "maintenance", "Maintenance"
        IMPORTANT = "important", "Important Update"
        INFO = "info", "Information"
        ALERT = "alert", "Alert"
        WARNING = "warning", "Warning"

    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
        default=NotificationType.INFO,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_notifications",
        help_text="Superuser who created this notification.",
    )
    is_sent = models.BooleanField(
        default=False,
        help_text="Whether the notification has been sent to users.",
    )
    send_immediately = models.BooleanField(
        default=True,
        help_text="If False, notification is drafted and can be scheduled for later.",
    )
    scheduled_for = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the notification should be sent.",
    )
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the notification was actually sent.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "core_system_notification"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["-created_at"]),
            models.Index(fields=["is_sent", "send_immediately"]),
        ]

    def __str__(self):
        return f"{self.get_notification_type_display()}: {self.title}"


class UserNotification(models.Model):
    """
    Tracks which users have received system notifications and their read status.
    Created when a SystemNotification is sent to all users.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_notifications",
        help_text="The user who received this notification.",
    )
    notification = models.ForeignKey(
        SystemNotification,
        on_delete=models.CASCADE,
        related_name="user_receipts",
        help_text="The system notification that was sent.",
    )
    is_read = models.BooleanField(
        default=False,
        help_text="Whether the user has read this notification.",
    )
    read_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When the user read this notification.",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "core_user_notification"
        ordering = ["-created_at"]
        unique_together = ["user", "notification"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["is_read", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.user.email}: {self.notification.title} ({'read' if self.is_read else 'unread'})"
