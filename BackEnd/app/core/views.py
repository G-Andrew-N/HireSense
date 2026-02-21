import os
from urllib.parse import urlparse

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.db.models import Q
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import APIException


class UploadFailedError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Upload failed. Check file format (PDF, DOC, DOCX, TXT) and size (max 10MB)."
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.http import FileResponse
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.mixins import UpdateModelMixin
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import JobMatch, JobPosting, JobSite, Resume, ResumeInsight, UserProfile, SystemNotification, UserNotification
from .resume_pipeline import process_resume_text, run_pipeline_and_save
from .resume_utils import extract_text_from_file, validate_resume_file
from .throttles import AIEndpointThrottle, AIInsightsThrottle, AIMatchThrottle, AuthRateThrottle, ScanThrottle
from .serializers import (
    JobMatchAnalysisSerializer,
    JobMatchSerializer,
    JobSiteSerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    ResumeInsightSerializer,
    ResumeParseSerializer,
    ResumeSerializer,
    UserSerializer,
    SystemNotificationSerializer,
    UserNotificationSerializer,
)

User = get_user_model()


def _safe_upload_name(file_name: str) -> str:
    if not file_name:
        return "avatar"
    cleaned = file_name
    if cleaned.startswith("https:/") and not cleaned.startswith("https://"):
        cleaned = cleaned.replace("https:/", "https://", 1)
    if cleaned.startswith("http:/") and not cleaned.startswith("http://"):
        cleaned = cleaned.replace("http:/", "http://", 1)
    if cleaned.startswith(("http://", "https://")):
        cleaned = os.path.basename(urlparse(cleaned).path)
    return cleaned or "avatar"


def _get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


# ----- Auth -----


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={})
        avatar_file = request.FILES.get("avatar")
        if avatar_file:
            safe_name = _safe_upload_name(avatar_file.name)
            profile.avatar.save(safe_name, avatar_file, save=False)
            profile.save(update_fields=["avatar"])
        return Response(
            {
                "user": UserSerializer(user, context={"request": request}).data,
                **_get_tokens_for_user(user),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        password = serializer.validated_data["password"]
        user = User.objects.filter(email=email).first()
        if user is None or not user.check_password(password):
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not user.is_active:
            return Response(
                {"detail": "User account is disabled."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return Response({
            "user": UserSerializer(user, context={"request": request}).data,
            **_get_tokens_for_user(user),
        })


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh)
            token.blacklist()
        except Exception:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class SafeTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        try:
            return super().validate(attrs)
        except (User.DoesNotExist, TokenError) as exc:
            raise InvalidToken("Invalid or expired refresh token.") from exc


class MeView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        # Fetch with select_related to include profile data for avatar serialization
        user = User.objects.select_related("profile").get(pk=request.user.pk)
        return Response(UserSerializer(user, context={"request": request}).data)

    def patch(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={})
        profile_updates = []
        
        if request.content_type and "multipart/form-data" in request.content_type:
            if "first_name" in request.data:
                user.first_name = request.data.get("first_name", user.first_name) or ""
            if "last_name" in request.data:
                user.last_name = request.data.get("last_name", user.last_name) or ""
            avatar_file = request.FILES.get("avatar")
            if avatar_file:
                safe_name = _safe_upload_name(avatar_file.name)
                profile.avatar.save(safe_name, avatar_file, save=False)
                profile_updates.append("avatar")
            if "email_notifications" in request.data:
                val = request.data.get("email_notifications")
                profile.email_notifications = val in [True, "true", "True", 1, "1"]
                profile_updates.append("email_notifications")
            if "high_match_alerts" in request.data:
                val = request.data.get("high_match_alerts")
                profile.high_match_alerts = val in [True, "true", "True", 1, "1"]
                profile_updates.append("high_match_alerts")
            if "weekly_reports" in request.data:
                val = request.data.get("weekly_reports")
                profile.weekly_reports = val in [True, "true", "True", 1, "1"]
                profile_updates.append("weekly_reports")
        else:
            data = request.data
            if "first_name" in data:
                user.first_name = data.get("first_name", user.first_name) or ""
            if "last_name" in data:
                user.last_name = data.get("last_name", user.last_name) or ""
            if "email_notifications" in data:
                val = data.get("email_notifications")
                profile.email_notifications = val in [True, "true", "True", 1, "1"]
                profile_updates.append("email_notifications")
            if "high_match_alerts" in data:
                val = data.get("high_match_alerts")
                profile.high_match_alerts = val in [True, "true", "True", 1, "1"]
                profile_updates.append("high_match_alerts")
            if "weekly_reports" in data:
                val = data.get("weekly_reports")
                profile.weekly_reports = val in [True, "true", "True", 1, "1"]
                profile_updates.append("weekly_reports")
        
        user.save(update_fields=["first_name", "last_name"])
        if profile_updates:
            profile.save(update_fields=profile_updates)
        
        # Fetch the user with profile loaded to ensure serializer gets avatar URL
        user = User.objects.select_related("profile").get(pk=user.pk)
        return Response(UserSerializer(user, context={"request": request}).data)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        user = User.objects.filter(email=email).first()
        if user is not None and user.is_active:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173").rstrip("/")
            reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"
            send_mail(
                subject="HireSense: Reset your password",
                message=(
                    f"Hi,\n\nYou requested a password reset. Open the link below to set a new password:\n\n"
                    f"{reset_link}\n\nIf you didn't request this, you can ignore this email.\n\n— HireSense"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        return Response(
            {"detail": "If an account exists with this email, you will receive a reset link."}
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]
        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new_password)
        user.save()
        return Response({"detail": "Password has been reset. You can log in with your new password."})


class EmailTestView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        email = request.user.email
        if not email:
            return Response(
                {"detail": "No email is associated with this account."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        send_mail(
            subject="HireSense: Test email",
            message=(
                "Hi,\n\n"
                "This is a test email to confirm SMTP is configured correctly."
                "\n\n— HireSense"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return Response({"detail": "Test email sent."})


# ----- AI endpoints -----


class ResumeParseView(APIView):
    """POST /api/resumes/parse/ - Extract structured data from resume (file or text)."""

    permission_classes = [IsAuthenticated]
    throttle_classes = [AIEndpointThrottle]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request):
        serializer = ResumeParseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        resume_text = serializer.validated_data.get("resume_text", "").strip()
        file = serializer.validated_data.get("file")

        if file:
            is_valid, err = validate_resume_file(file)
            if not is_valid:
                return Response({"detail": err}, status=status.HTTP_400_BAD_REQUEST)
            resume_text = extract_text_from_file(file)

        if not resume_text:
            return Response(
                {"detail": "Could not extract text from the resume."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = process_resume_text(resume_text)
        if not result.success:
            return Response(
                {"detail": result.error or "Resume parsing failed."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({
            "parsed_content": result.parsed_content,
            "raw_text": result.raw_text,
            "structure_hints": result.structure_hints,
        })


class JobMatchAnalysisView(APIView):
    """POST /api/jobs/match/ - Get match score and skills analysis only."""

    permission_classes = [IsAuthenticated]
    throttle_classes = [AIEndpointThrottle]

    def post(self, request):
        serializer = JobMatchAnalysisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resume_text = serializer.validated_data["resume_text"]
        job_description = serializer.validated_data["job_description"]

        try:
            from ai.job_matcher import match_resume_to_job

            result = match_resume_to_job(resume_text, job_description)
        except ValueError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if result is None:
            return Response(
                {"detail": "Job matching failed. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        return Response(result)


class JobFullAnalysisView(APIView):
    """POST /api/jobs/full-analysis/ - Match score + interview probability."""

    permission_classes = [IsAuthenticated]
    throttle_classes = [AIEndpointThrottle]

    def post(self, request):
        serializer = JobMatchAnalysisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resume_text = serializer.validated_data["resume_text"]
        job_description = serializer.validated_data["job_description"]

        try:
            from ai.job_matcher import match_resume_to_job
            from ai.interview_predictor import estimate_interview_probability

            match_result = match_resume_to_job(resume_text, job_description)
        except ValueError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if match_result is None:
            return Response(
                {"detail": "Job matching failed. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        try:
            prob_result = estimate_interview_probability(match_result)
        except ValueError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if prob_result is None:
            prob_result = {"interview_probability": 0, "key_factors": []}

        return Response({
            "match_score": match_result["match_score"],
            "matched_skills": match_result["matched_skills"],
            "missing_skills": match_result["missing_skills"],
            "reasoning": match_result.get("reasoning", ""),
            "interview_probability": prob_result["interview_probability"],
            "key_factors": prob_result.get("key_factors", []),
        })


# ----- Job scan (background tasks) -----


class JobScanView(APIView):
    """POST /api/jobs/scan/ - Trigger job site scan synchronously (no Celery)."""

    permission_classes = [IsAuthenticated]
    throttle_classes = [ScanThrottle]

    def post(self, request):
        from .tasks import _run_scan_all_limited, _fetch_indeed_jobs_for_user, _run_match_analysis_chunk
        from .serializers import JobMatchSerializer

        limit_param = request.query_params.get("limit")
        limit = int(limit_param) if limit_param and str(limit_param).isdigit() else 2
        limit = min(max(limit, 1), 5)

        # Sync mode only: scan all sources with per-source limits
        result = _run_scan_all_limited(max_results_per_source=2, max_total=limit)
        # Fetch profession-aware jobs without auto-triggering analysis
        user_fetch_result = _fetch_indeed_jobs_for_user(
            request.user.id,
            auto_trigger_analysis=False,
            max_total_results=limit,
        )
        result["user_fetch"] = user_fetch_result
        analysis_result = _run_match_analysis_chunk(request.user.id, chunk_size=limit)
        if "error" in analysis_result:
            result["analysis_error"] = analysis_result["error"]
            return Response({"detail": "Scan completed.", **result})
        matches_data = JobMatchSerializer(analysis_result["matches"], many=True).data
        return Response({"detail": "Scan completed.", "matches": matches_data, **result})


class JobScanSiteView(APIView):
    """POST /api/jobs/scan/<site_id>/ - Trigger scan for a single site."""

    permission_classes = [IsAuthenticated]
    throttle_classes = [ScanThrottle]

    def post(self, request, site_id: int):
        from .tasks import _run_scan_site_limited

        result = _run_scan_site_limited(site_id, max_results=2)
        if result.get("error"):
            return Response({"detail": result["error"]}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Scan completed.", **result})


class JobMatchAnalysisTriggerView(APIView):
    """
    POST /api/jobs/run-match-analysis/
    - Processes 2 jobs per request by default for manual, incremental loading
    """

    permission_classes = [IsAuthenticated]
    throttle_classes = [AIMatchThrottle]

    def post(self, request):
        from .tasks import _run_match_analysis_chunk, _run_scan_all_limited, _fetch_indeed_jobs_for_user
        from .serializers import JobMatchSerializer

        chunk_param = request.query_params.get("chunk")
        chunk_size = int(chunk_param) if chunk_param and str(chunk_param).isdigit() else 2
        chunk_size = min(max(chunk_size, 1), 5)

        # Step 1: scan for fresh jobs (stop as soon as we have chunk_size results)
        _run_scan_all_limited(max_results_per_source=2, max_total=chunk_size)
        _fetch_indeed_jobs_for_user(
            request.user.id,
            auto_trigger_analysis=False,
            max_total_results=chunk_size,
        )

        # Step 2: analyze up to chunk_size jobs and return them
        result = _run_match_analysis_chunk(request.user.id, chunk_size)
        if "error" in result:
            return Response({"detail": result["error"]}, status=status.HTTP_400_BAD_REQUEST)
        data = JobMatchSerializer(result["matches"], many=True).data
        response_data = {
            "matches": data,
            "has_more": result["has_more"]
        }
        # Include message if jobs were analyzed but none passed threshold
        if result.get("message"):
            response_data["message"] = result["message"]
        return Response(response_data)


# ----- Resume -----

import logging

RESUME_LOG = logging.getLogger("core.resume")


class ResumeViewSet(ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_throttles(self):
        if self.action == "create":
            return [AIEndpointThrottle()]
        return super().get_throttles()

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).order_by("-uploaded_at")

    def get_parsers(self):
        # action not set during initialize_request; always use multipart/form for file uploads
        return [MultiPartParser(), FormParser()]

    def create(self, request, *args, **kwargs):
        """Handle upload and include match analysis status in the response."""
        try:
            # Standard DRF create flow but capture match analysis info set in perform_create
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            # reset any previous info
            if hasattr(self, "match_analysis"):
                delattr(self, "match_analysis")
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            data = dict(serializer.data)
            if hasattr(self, "match_analysis"):
                data["match_analysis"] = getattr(self, "match_analysis")
            return Response(data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            RESUME_LOG.exception(
                "Resume upload error (full traceback above): %s",
                str(e),
                exc_info=True,
            )
            raise

    def perform_create(self, serializer):
        try:
            instance = serializer.save()
        except Exception as e:
            RESUME_LOG.exception("Resume save failed: %s", e, exc_info=True)
            raise UploadFailedError from e
        profile, _ = UserProfile.objects.get_or_create(user=instance.user, defaults={})
        profile.primary_resume = instance
        profile.save(update_fields=["primary_resume"])
        
        # Clear any existing job matches for this user so the UI reflects a fresh search
        try:
            JobMatch.objects.filter(user=instance.user).delete()
        except Exception as e:
            RESUME_LOG.warning("Failed to clear previous job matches for user %s: %s", instance.user_id, e)

        # Process resume synchronously (no background workers on Render free tier)
        self.match_analysis = {"started": False, "mode": "manual"}
        try:
            from .resume_pipeline import process_resume_file

            result = process_resume_file(instance)
            instance.raw_text = result.raw_text
            content = dict(result.parsed_content)
            if result.structure_hints:
                content["structure_hints"] = result.structure_hints
            instance.parsed_content = content
            instance.save(update_fields=["raw_text", "parsed_content"])
        except Exception as e:
            RESUME_LOG.warning("Resume parsing failed during upload: %s", e)

    def perform_destroy(self, instance):
        if instance.file:
            instance.file.delete(save=False)
        instance.delete()

    @action(detail=True, methods=["post"])
    def set_primary(self, request, pk=None):
        """Set this resume as the current one (used for job matches and insights)."""
        resume = self.get_object()
        profile, _ = UserProfile.objects.get_or_create(user=request.user, defaults={})
        profile.primary_resume = resume
        profile.save(update_fields=["primary_resume"])
        # Clear previous job matches so UI reflects fresh search
        try:
            JobMatch.objects.filter(user=request.user).delete()
        except Exception as e:
            RESUME_LOG.warning("Failed to clear previous job matches for user %s when setting primary resume: %s", request.user.id, e)

        match_analysis = {"started": False}
        try:
            from .tasks import run_match_analysis_for_user, _run_match_analysis_for_user
        except Exception as e:
            RESUME_LOG.warning("Could not import match analysis tasks when setting primary resume: %s", e)
            match_analysis = {"started": False, "reason": "import_failed", "error": str(e)}
            return Response(
                {**ResumeSerializer(resume, context={"request": request}).data, "match_analysis": match_analysis},
                status=status.HTTP_200_OK,
            )

        try:
            # Enqueue both match analysis and insights generation asynchronously. Do not run synchronously
            task = run_match_analysis_for_user.delay(request.user.id)
            insight_task = generate_insights_for_user.delay(request.user.id)
            match_analysis = {
                "started": True,
                "async": True,
                "task_id": getattr(task, "id", None),
                "insights_task_id": getattr(insight_task, "id", None),
            }
        except Exception as e:
            RESUME_LOG.warning("Could not enqueue job scan or insight generation after setting primary resume: %s", e)
            match_analysis = {"started": False, "reason": "enqueue_failed", "error": str(e)}

        return Response(
            {**ResumeSerializer(resume, context={"request": request}).data, "match_analysis": match_analysis},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="test-celery")
    def test_celery(self, request):
        """Test endpoint to verify Celery worker is running and processing tasks."""
        try:
            from .tasks import test_celery as test_celery_task
            from .tasks import parse_resume_async
            
            # Trigger test task
            test_task = test_celery_task.delay()
            
            # Also get info about user's resumes that might need parsing
            user_resumes = Resume.objects.filter(user=request.user).order_by('-uploaded_at')
            resume_info = []
            for resume in user_resumes[:5]:
                has_text = bool(resume.raw_text)
                has_parsed = bool(resume.parsed_content and isinstance(resume.parsed_content, dict) and resume.parsed_content.get('skills'))
                is_parsing = bool(resume.parsed_content and isinstance(resume.parsed_content, dict) and resume.parsed_content.get('_parsing'))
                
                resume_info.append({
                    'id': resume.id,
                    'filename': resume.original_filename,
                    'uploaded_at': resume.uploaded_at,
                    'has_raw_text': has_text,
                    'has_parsed_content': has_parsed,
                    'is_currently_parsing': is_parsing,
                })
            
            return Response({
                "status": "success",
                "message": "Test task queued successfully",
                "test_task_id": getattr(test_task, "id", None),
                "user_resumes": resume_info,
                "note": "Check server logs for '🎉 CELERY WORKER IS ALIVE' message"
            })
        except Exception as e:
            RESUME_LOG.exception("Failed to queue test task: %s", e)
            return Response({
                "status": "error",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        """Secure download: only the owning user can download."""
        resume = self.get_object()
        if not resume.file:
            return Response({"detail": "No file attached."}, status=status.HTTP_404_NOT_FOUND)
        try:
            file_handle = resume.file.open("rb")
            response = FileResponse(file_handle, as_attachment=True, filename=resume.original_filename or resume.file.name.split("/")[-1])
            return response
        except FileNotFoundError:
            return Response({"detail": "File not found."}, status=status.HTTP_404_NOT_FOUND)


def _parse_and_save_resume(resume: Resume) -> None:
    """Run resume processing pipeline and save to instance."""
    run_pipeline_and_save(resume)


# ----- Job site -----


class JobSiteViewSet(ModelViewSet):
    serializer_class = JobSiteSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        from .builtin_job_sites import ensure_builtin_job_sites
        if not JobSite.objects.filter(user__isnull=True).exists():
            ensure_builtin_job_sites()
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        return JobSite.objects.filter(
            Q(user=self.request.user) | Q(user__isnull=True)
        ).order_by("-is_builtin", "name")

    def perform_destroy(self, instance):
        if instance.is_builtin or instance.user_id is None:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Cannot delete a built-in job site.")
        instance.delete()


# ----- Job match -----


class JobMatchViewSet(ModelViewSet):
    serializer_class = JobMatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        from .tasks import _get_enabled_job_source_names
        # Show matches from all enabled job sources with at least 50% match score
        enabled_sources = _get_enabled_job_source_names()
        return (
            JobMatch.objects.filter(
                user=self.request.user,
                source__in=enabled_sources,
                match_score__gte=50,
            )
            .order_by("-match_score", "-created_at")
        )

    @action(detail=False, methods=["get"])
    def with_pending(self, request):
        """Return matched jobs only (manual flow has no background pending jobs)."""
        from .tasks import _get_enabled_job_source_names
        from rest_framework.response import Response
        enabled_sources = _get_enabled_job_source_names()
        
        # Get matched jobs with at least 50% match score
        matched = JobMatch.objects.filter(
            user=request.user,
            source__in=enabled_sources,
            match_score__gte=50,
        ).order_by("-match_score", "-created_at")
        matched_data = JobMatchSerializer(matched, many=True).data
        return Response({
            "results": matched_data,
            "count": len(matched_data),
            "pending_count": 0,
            "matched_count": len(matched_data),
        })


# ----- Resume insight (read-only + PATCH completed_at) -----


class ResumeInsightViewSet(UpdateModelMixin, ReadOnlyModelViewSet):
    serializer_class = ResumeInsightSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        """Only allow updating completed_at (user marks suggestion as done/clear)."""
        serializer.save(completed_at=serializer.validated_data.get("completed_at"))

    def get_throttles(self):
        if self.action == "generate":
            return [AIInsightsThrottle()]
        return super().get_throttles()

    def get_queryset(self):
        return ResumeInsight.objects.filter(user=self.request.user).order_by("category", "-created_at")

    @action(detail=False, methods=["post"])
    def generate(self, request):
        """Generate insights from the user's latest resume."""
        from ai.insight_generator import generate_insights

        provider = getattr(settings, "AI_PROVIDER", "openai") or "openai"
        if provider == "gemini" and not getattr(settings, "GEMINI_API_KEY", None):
            return Response(
                {"detail": "GEMINI_API_KEY is not set. Add it to your .env file."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        if provider == "groq" and not getattr(settings, "GROQ_API_KEY", None):
            return Response(
                {"detail": "GROQ_API_KEY is not set. Add it to your .env file."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        if provider == "openai" and not getattr(settings, "OPENAI_API_KEY", None):
            return Response(
                {"detail": "OPENAI_API_KEY is not set. Add it to your .env file."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        from .tasks import _get_current_resume

        resume = _get_current_resume(request.user)
        if not resume:
            return Response(
                {"detail": "Upload a resume first to generate insights."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not resume.raw_text or not resume.raw_text.strip():
            return Response(
                {"detail": "Resume has no text. Try re-uploading your resume."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        content = dict(resume.parsed_content) if resume.parsed_content else {}
        try:
            insights = generate_insights(resume.raw_text, content)
        except ValueError as e:
            return Response(
                {"detail": str(e) or "OPENAI_API_KEY must be set in your .env file."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception as e:
            logging.getLogger(__name__).exception("Insight generation failed: %s", e)
            return Response(
                {"detail": f"Insight generation failed: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        if not insights:
            return Response(
                {"detail": "No insights could be parsed from the AI response. Try again."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        ResumeInsight.objects.filter(user=request.user).delete()
        for item in insights:
            ResumeInsight.objects.create(
                user=request.user,
                resume=resume,
                category=item["category"],
                title=item["title"],
                description=item["description"],
                impact=item["impact"],
            )
        qs = ResumeInsight.objects.filter(user=request.user).order_by("category", "-created_at")
        data = ResumeInsightSerializer(qs, many=True).data
        return Response(data, status=status.HTTP_201_CREATED)



# ----- Admin Permissions -----


class IsSuperUser(object):
    """Custom permission to check if user is a superuser."""
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)


# ----- System Notifications (Admin) -----


class SystemNotificationViewSet(ModelViewSet):
    """
    Admin-only viewset for managing system notifications.
    Only superusers can perform any action.
    """
    
    queryset = SystemNotification.objects.all()
    serializer_class = SystemNotificationSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
    
    def get_queryset(self):
        """Return all notifications (superusers only)."""
        return SystemNotification.objects.all().order_by('-created_at')
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsSuperUser])
    def send_notification(self, request):
        """Send a pending notification immediately."""
        notification_id = request.data.get('notification_id')
        if not notification_id:
            return Response(
                {'detail': 'notification_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            notification = SystemNotification.objects.get(id=notification_id)
        except SystemNotification.DoesNotExist:
            return Response(
                {'detail': 'Notification not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if notification.is_sent:
            return Response(
                {'detail': 'Notification already sent'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Send notification to all users
        from .tasks import send_notification_to_users
        task = send_notification_to_users.delay(notification.id)
        
        return Response(
            {
                'detail': 'Notification sent successfully',
                'task_id': task.id,
                'notification_id': notification.id
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsSuperUser])
    def clear_history(self, request):
        """Clear notification history (delete all sent notifications)."""
        deleted_count = SystemNotification.objects.filter(is_sent=True).delete()[0]
        
        return Response(
            {
                'detail': f'Deleted {deleted_count} notification(s) from history',
                'deleted_count': deleted_count
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsSuperUser])
    def admin_stats(self, request):
        """Get admin dashboard statistics."""
        from django.db.models import Count
        from django.utils import timezone
        from datetime import timedelta
        
        # Calculate stats
        total_users = User.objects.count()
        active_users = User.objects.filter(last_login__gte=timezone.now() - timedelta(days=7)).count()
        
        total_resumes = Resume.objects.count()
        total_matches = JobMatch.objects.count()
        total_jobs = JobPosting.objects.count()
        
        recent_notifications = SystemNotification.objects.filter(is_sent=True).count()
        pending_notifications = SystemNotification.objects.filter(is_sent=False).count()
        
        # User growth (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        new_users_30d = User.objects.filter(date_joined__gte=thirty_days_ago).count()
        
        return Response({
            'users': {
                'total': total_users,
                'active_7d': active_users,
                'new_30d': new_users_30d,
            },
            'resumes': {
                'total': total_resumes,
            },
            'jobs': {
                'total_postings': total_jobs,
                'total_matches': total_matches,
            },
            'notifications': {
                'sent': recent_notifications,
                'pending': pending_notifications,
            },
            'status': 'operational'
        })


class UserNotificationViewSet(ReadOnlyModelViewSet):
    """
    ViewSet for users to view and manage their notifications.
    Provides list and retrieve endpoints for notifications sent by admins.
    Allows users to mark notifications as read.
    """
    serializer_class = UserNotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Only return notifications for the current user."""
        return UserNotification.objects.filter(user=self.request.user).select_related(
            'notification', 'notification__created_by'
        )

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a specific notification as read."""
        user_notification = self.get_object()
        
        if not user_notification.is_read:
            user_notification.is_read = True
            user_notification.read_at = timezone.now()
            user_notification.save()
        
        serializer = self.get_serializer(user_notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all unread notifications as read."""
        from django.utils import timezone
        
        unread = self.get_queryset().filter(is_read=False)
        count = unread.count()
        
        unread.update(is_read=True, read_at=timezone.now())
        
        return Response(
            {'message': f'{count} notifications marked as read'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications."""
        unread_count = self.get_queryset().filter(is_read=False).count()
        return Response({'unread_count': unread_count}, status=status.HTTP_200_OK)


