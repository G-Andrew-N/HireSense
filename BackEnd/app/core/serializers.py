from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import JobMatch, JobSite, Resume, ResumeInsight, UserProfile, SystemNotification, UserNotification

User = get_user_model()


def get_avatar_url(request, path_suffix="/api/media/avatars/default"):
    """
    Build an absolute URL for avatar resources.
    Handles edge cases where request object might not be available or build_absolute_uri fails.
    
    Args:
        request: DRF request object (may be None)
        path_suffix: Relative path including leading slash (e.g., "/api/media/avatars/default")
    
    Returns:
        str: Absolute or relative URL for the avatar resource
    """
    if not request:
        return path_suffix
    
    try:
        # Try to build absolute URI using request object
        return request.build_absolute_uri(path_suffix)
    except Exception:
        # Fallback to relative path if build_absolute_uri fails
        return path_suffix


# ----- Auth -----


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})
    full_name = serializers.CharField(required=False, allow_blank=True, max_length=255)

    class Meta:
        model = User
        fields = ("email", "password", "full_name")

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        full_name = validated_data.pop("full_name", "") or ""
        email = validated_data["email"].lower()
        password = validated_data["password"]
        user = User.objects.create_user(username=email, email=email, password=password)
        if full_name:
            parts = full_name.strip().split(None, 1)
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = parts[1]
            user.save()
        UserProfile.objects.get_or_create(user=user)
        return user


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField(read_only=True)
    email_notifications = serializers.SerializerMethodField(read_only=True)
    high_match_alerts = serializers.SerializerMethodField(read_only=True)
    weekly_reports = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "avatar", "is_superuser", "email_notifications", "high_match_alerts", "weekly_reports")
        read_only_fields = ("id", "email", "is_superuser")

    def get_avatar(self, obj):
        request = self.context.get("request")
        profile = getattr(obj, "profile", None)
        
        # If user has a custom avatar, return the URL to it
        if profile and profile.avatar and profile.avatar.name:
            avatar_path = profile.avatar.name  # avatars/2026/02/filename.jpg
            
            # Parse path: avatars/2026/02/filename.jpg -> media/avatars/2026/02/filename
            parts = avatar_path.split('/')
            if len(parts) >= 4:
                year = parts[1]  # 2026
                month = parts[2]  # 02
                filename = parts[3]  # filename.jpg
                
                # Build URL to CORS-enabled media view
                return get_avatar_url(request, f"/api/media/avatars/{year}/{month}/{filename}")
        
        # Return default avatar URL - always accessible via API endpoint
        # This endpoint works in both development and production
        return get_avatar_url(request, "/api/media/avatars/default")

    def get_email_notifications(self, obj):
        profile = getattr(obj, "profile", None)
        if not profile:
            return True
        return profile.email_notifications

    def get_high_match_alerts(self, obj):
        profile = getattr(obj, "profile", None)
        if not profile:
            return True
        return profile.high_match_alerts

    def get_weekly_reports(self, obj):
        profile = getattr(obj, "profile", None)
        if not profile:
            return False
        return profile.weekly_reports


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={"input_type": "password"})


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True, min_length=8, write_only=True, style={"input_type": "password"}
    )


# ----- Resume -----


class ResumeSerializer(serializers.ModelSerializer):
    is_primary = serializers.SerializerMethodField(read_only=True)
    file = serializers.SerializerMethodField(read_only=True)  # Download URL, not raw binary
    file_upload = serializers.FileField(write_only=True, required=False)  # For uploads only

    class Meta:
        model = Resume
        fields = (
            "id",
            "file",
            "file_upload",
            "original_filename",
            "uploaded_at",
            "version",
            "parsed_content",
            "raw_text",
            "is_primary",
        )
        read_only_fields = ("uploaded_at", "version", "parsed_content", "raw_text", "is_primary", "file")

    def get_file(self, obj):
        """Return download URL for the resume file."""
        request = self.context.get("request")
        if not request:
            return None
        return request.build_absolute_uri(f"/api/resumes/{obj.id}/download/")

    def get_is_primary(self, obj):
        request = self.context.get("request")
        if not request or not request.user:
            return False
        profile = getattr(request.user, "profile", None)
        if not profile:
            return False
        return getattr(profile, "primary_resume_id", None) == obj.id

    def validate_file_upload(self, value):
        from core.resume_utils import validate_resume_file

        is_valid, err = validate_resume_file(value)
        if not is_valid:
            raise serializers.ValidationError(err)
        return value

    def create(self, validated_data):
        user = self.context["request"].user
        last = Resume.objects.filter(user=user).order_by("-version").first()
        version = (last.version + 1) if last else 1
        
        file_upload = validated_data.pop("file_upload", None)
        file_obj = file_upload or validated_data.get("file")
        if file_obj:
            # Store original filename and file using FileField
            validated_data["original_filename"] = file_obj.name
            validated_data["file"] = file_obj
        
        validated_data["user"] = user
        validated_data["version"] = version
        return super().create(validated_data)


# ----- Job site -----


class JobSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSite
        fields = (
            "id",
            "name",
            "url",
            "enabled",
            "logo",
            "is_builtin",
            "source_type",
            "scrape_config",
            "created_at",
        )
        read_only_fields = ("is_builtin", "created_at")

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


# ----- Job match -----


class JobMatchSerializer(serializers.ModelSerializer):
    source = serializers.CharField(required=False, allow_blank=True)
    posted_date = serializers.DateField(required=False, allow_null=True)
    applied_at = serializers.DateTimeField(required=False, allow_null=True)

    class Meta:
        model = JobMatch
        fields = (
            "id",
            "job_site",
            "title",
            "company",
            "location",
            "salary",
            "posted_date",
            "external_url",
            "logo",
            "source",
            "match_score",
            "interview_probability",
            "skills",
            "missing_skills",
            "created_at",
            "applied_at",
        )
        read_only_fields = ("created_at",)

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        js = validated_data.get("job_site")
        if js and js.user is not None and js.user != validated_data["user"]:
            validated_data["job_site"] = None
        return super().create(validated_data)


# ----- Resume insight (read-only) -----


class ResumeInsightSerializer(serializers.ModelSerializer):
    completed_at = serializers.DateTimeField(required=False, allow_null=True)

    class Meta:
        model = ResumeInsight
        fields = ("id", "resume", "category", "title", "description", "impact", "created_at", "completed_at")
        read_only_fields = ("id", "resume", "category", "title", "description", "impact", "created_at")


# ----- AI endpoints -----


class ResumeParseSerializer(serializers.Serializer):
    """Input for POST /api/resumes/parse/ - accepts file or resume_text."""

    resume_text = serializers.CharField(required=False, allow_blank=True)
    file = serializers.FileField(required=False)

    def validate(self, attrs):
        if not attrs.get("resume_text") and not attrs.get("file"):
            raise serializers.ValidationError("Provide either 'resume_text' or 'file'.")
        if attrs.get("resume_text") and attrs.get("file"):
            raise serializers.ValidationError("Provide only one of 'resume_text' or 'file'.")
        return attrs


class JobMatchAnalysisSerializer(serializers.Serializer):
    """Input for POST /api/jobs/match/ and /api/jobs/full-analysis/."""

    resume_text = serializers.CharField(required=True, allow_blank=False)
    job_description = serializers.CharField(required=True, allow_blank=False)

# ----- System Notifications (Admin) -----


class SystemNotificationSerializer(serializers.ModelSerializer):
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)

    class Meta:
        model = SystemNotification
        fields = (
            "id",
            "title",
            "message",
            "notification_type",
            "created_by",
            "created_by_email",
            "is_sent",
            "send_immediately",
            "scheduled_for",
            "sent_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_by", "is_sent", "sent_at")

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class UserNotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for user-specific notification receipts.
    Shows notifications that have been sent to the user.
    """

    notification_title = serializers.CharField(source="notification.title", read_only=True)
    notification_message = serializers.CharField(source="notification.message", read_only=True)
    notification_type = serializers.CharField(source="notification.notification_type", read_only=True)
    sent_by_email = serializers.CharField(source="notification.created_by.email", read_only=True)
    notification_sent_at = serializers.DateTimeField(source="notification.sent_at", read_only=True)

    class Meta:
        model = UserNotification
        fields = (
            "id",
            "notification",
            "notification_title",
            "notification_message",
            "notification_type",
            "sent_by_email",
            "is_read",
            "read_at",
            "notification_sent_at",
            "created_at",
        )
        read_only_fields = ("notification", "created_at", "notification_sent_at")
