from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.db.models import Q
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
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
from rest_framework_simplejwt.tokens import RefreshToken

from .models import JobMatch, JobPosting, JobSite, Resume, ResumeInsight, UserProfile
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
)

User = get_user_model()


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
            profile.avatar = avatar_file
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


class MeView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request):
        return Response(UserSerializer(request.user, context={"request": request}).data)

    def patch(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={})
        if request.content_type and "multipart/form-data" in request.content_type:
            if "first_name" in request.data:
                user.first_name = request.data.get("first_name", user.first_name) or ""
            if "last_name" in request.data:
                user.last_name = request.data.get("last_name", user.last_name) or ""
            avatar_file = request.FILES.get("avatar")
            if avatar_file:
                profile.avatar = avatar_file
                profile.save(update_fields=["avatar"])
        else:
            data = request.data
            if "first_name" in data:
                user.first_name = data.get("first_name", user.first_name) or ""
            if "last_name" in data:
                user.last_name = data.get("last_name", user.last_name) or ""
        user.save(update_fields=["first_name", "last_name"])
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
    """POST /api/jobs/scan/ - Trigger job site scan. Use ?sync=true to run synchronously (no Celery)."""

    permission_classes = [IsAuthenticated]
    throttle_classes = [ScanThrottle]

    def post(self, request):
        from .tasks import scan_all_job_sites_limited, _run_scan_all_limited, _fetch_indeed_jobs_for_user, _fetch_indeed_jobs_for_user_async

        if request.query_params.get("sync", "").lower() in ("true", "1", "yes"):
            # Sync mode: scan all sources with per-source limits
            result = _run_scan_all_limited()
            # Also fetch profession-aware jobs with auto-trigger for analysis
            user_fetch_result = _fetch_indeed_jobs_for_user(request.user.id, auto_trigger_analysis=True)
            result["user_fetch"] = user_fetch_result
            return Response({"detail": "Scan completed.", **result})
        # Async mode: queue both tasks
        task = scan_all_job_sites_limited.delay()
        user_task = _fetch_indeed_jobs_for_user_async.delay(request.user.id)
        return Response(
            {
                "detail": "Scan started.",
                "scan_task_id": task.id,
                "user_fetch_task_id": user_task.id,
            },
            status=status.HTTP_202_ACCEPTED,
        )


class JobScanSiteView(APIView):
    """POST /api/jobs/scan/<site_id>/ - Trigger scan for a single site."""

    permission_classes = [IsAuthenticated]
    throttle_classes = [ScanThrottle]

    def post(self, request, site_id: int):
        from .tasks import scan_job_site

        task = scan_job_site.delay(site_id)
        return Response(
            {"detail": "Scan started.", "task_id": task.id},
            status=status.HTTP_202_ACCEPTED,
        )


class JobMatchAnalysisTriggerView(APIView):
    """
    POST /api/jobs/run-match-analysis/
    - ?sync=true: run without Celery
    - ?sync=true&chunk=3: process 3 jobs per request, return matches for progressive rendering
    """

    permission_classes = [IsAuthenticated]
    throttle_classes = [AIMatchThrottle]

    def post(self, request):
        from .tasks import run_match_analysis_for_user, _run_match_analysis_for_user, _run_match_analysis_chunk
        from .serializers import JobMatchSerializer

        chunk_param = request.query_params.get("chunk")
        chunk_size = int(chunk_param) if chunk_param and str(chunk_param).isdigit() else 0
        chunk_size = min(max(chunk_size, 1), 5) if chunk_size else 0

        if request.query_params.get("sync", "").lower() in ("true", "1", "yes"):
            if chunk_size:
                result = _run_match_analysis_chunk(request.user.id, chunk_size)
                if "error" in result:
                    return Response({"detail": result["error"]}, status=status.HTTP_400_BAD_REQUEST)
                data = JobMatchSerializer(result["matches"], many=True).data
                return Response({"matches": data, "has_more": result["has_more"]})
            result = _run_match_analysis_for_user(request.user.id)
            if "error" in result:
                return Response({"detail": result["error"]}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"detail": "Match analysis completed.", **result})
        task = run_match_analysis_for_user.delay(request.user.id)
        return Response(
            {"detail": "Match analysis started.", "task_id": task.id},
            status=status.HTTP_202_ACCEPTED,
        )


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
        try:
            _parse_and_save_resume(instance)
        except Exception as e:
            RESUME_LOG.exception("Resume parsing failed after upload: %s", e, exc_info=True)
            return
        # Regenerate job listings to reflect the new resume (insights already regenerated in pipeline)
        # Clear any existing job matches for this user so the UI reflects a fresh search
        try:
            JobMatch.objects.filter(user=instance.user).delete()
        except Exception as e:
            RESUME_LOG.warning("Failed to clear previous job matches for user %s: %s", instance.user_id, e)

        # Enqueue match analysis and insights generation asynchronously; return quickly
        self.match_analysis = {"started": False}
        try:
            from .tasks import run_match_analysis_for_user, generate_insights_for_user
        except Exception as e:
            RESUME_LOG.warning("Could not import match analysis/insights tasks: %s", e)
            self.match_analysis = {"started": False, "reason": "import_failed", "error": str(e)}
            return

        try:
            task = run_match_analysis_for_user.delay(instance.user_id)
            insight_task = generate_insights_for_user.delay(instance.user_id)
            self.match_analysis = {
                "started": True,
                "async": True,
                "task_id": getattr(task, "id", None),
                "insights_task_id": getattr(insight_task, "id", None),
            }
        except Exception as e:
            RESUME_LOG.warning("Could not enqueue job scan or insight generation after resume upload: %s", e)
            self.match_analysis = {"started": False, "reason": "enqueue_failed", "error": str(e)}

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
        # Show matches from all enabled job sources
        enabled_sources = _get_enabled_job_source_names()
        return (
            JobMatch.objects.filter(user=self.request.user, source__in=enabled_sources)
            .order_by("-match_score", "-created_at")
        )

    @action(detail=False, methods=["get"])
    def with_pending(self, request):
        """Return both matched jobs and pending jobs (analyzing). Pending jobs have status='analyzing'."""
        from .tasks import _get_enabled_job_source_names
        from rest_framework.response import Response
        import logging

        logger = logging.getLogger(__name__)
        enabled_sources = _get_enabled_job_source_names()
        
        # Get matched jobs
        matched = JobMatch.objects.filter(
            user=request.user, source__in=enabled_sources
        ).order_by("-match_score", "-created_at")
        
        # Get recently fetched (last 5 minutes) unmatched postings (pending analysis)
        from django.utils import timezone
        from datetime import timedelta
        
        recent_cutoff = timezone.now() - timedelta(minutes=5)
        all_recent = JobPosting.objects.filter(fetched_at__gte=recent_cutoff)
        logger.info(f"with_pending: enabled_sources={enabled_sources}, all_recent_count={all_recent.count()}")
        
        # Log all recent jobs with their sources
        for jp in all_recent:
            logger.info(f"  Recent job: id={jp.id}, source={jp.source}, title={jp.title}")
        
        pending_postings = JobPosting.objects.filter(
            source__in=enabled_sources,
            fetched_at__gte=recent_cutoff
        ).exclude(
            matches__user=request.user  # Exclude already matched
        ).order_by("-fetched_at")
        
        logger.info(f"with_pending: pending_postings_count={pending_postings.count()}")
        
        # Serialize matched jobs
        matched_data = JobMatchSerializer(matched, many=True).data
        
        # Convert pending postings to a match-like format with status='analyzing'
        pending_data = []
        for posting in pending_postings:
            pending_data.append({
                "id": None,  # No JobMatch ID yet
                "user": request.user.id,
                "job_posting": posting.id,
                "title": posting.title,
                "company": posting.company,
                "location": posting.location,
                "salary": posting.salary,
                "posted_date": posting.posted_date,
                "external_url": posting.external_url,
                "logo": posting.logo,
                "source": posting.source,
                "match_score": None,
                "interview_probability": None,
                "skills": [],
                "missing_skills": [],
                "status": "analyzing",  # Mark as currently being analyzed
                "created_at": posting.fetched_at,
            })
        
        # Combine: pending first (so user sees "loading" jobs at top), then matched
        combined = pending_data + matched_data
        
        return Response({
            "results": combined,
            "count": len(combined),
            "pending_count": len(pending_data),
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


class JobSourcesView(APIView):
    """Return information about active job sources used for matching."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get list of active job sources and their status."""
        # Get built-in job sites
        builtin_sites = JobSite.objects.filter(is_builtin=True).order_by("name")
        
        # Build response with site information
        sources = []
        for site in builtin_sites:
            # Determine type from source_type
            site_type_map = {
                "rss": "RSS Feed",
                "generic": "Web Scraper",
                "indeed": "Indeed API",
                "linkedin": "LinkedIn API",
                "glassdoor": "Glassdoor API",
                "ziprecruiter": "ZipRecruiter API",
            }
            
            sources.append({
                "name": site.name,
                "type": site_type_map.get(site.source_type, site.source_type),
                "description": f"Remote job source ({site_type_map.get(site.source_type, site.source_type).lower()})",
                "status": "active" if site.enabled else "disabled",
                "coverage": site.scrape_config.get("keywords", "All positions"),
            })
        
        return Response(
            {
                "sources": sources,
                "total": len(sources),
                "active_count": sum(1 for s in sources if s["status"] == "active"),
                "primary": "Remotive"
            },
            status=status.HTTP_200_OK,
        )

