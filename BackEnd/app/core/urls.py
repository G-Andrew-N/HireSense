from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import views
from .media_views import AvatarFileView, DefaultAvatarView

router = DefaultRouter()
router.register(r"resumes", views.ResumeViewSet, basename="resume")
router.register(r"job-sites", views.JobSiteViewSet, basename="jobsite")
router.register(r"job-matches", views.JobMatchViewSet, basename="jobmatch")
router.register(r"insights", views.ResumeInsightViewSet, basename="insight")
router.register(r"admin/notifications", views.SystemNotificationViewSet, basename="system-notification")
router.register(r"notifications", views.UserNotificationViewSet, basename="user-notification")

urlpatterns = [
    # Media serving with CORS headers
    path("media/avatars/default", DefaultAvatarView.as_view(), name="default-avatar"),
    path("media/avatars/<str:year>/<str:month>/<str:filename>", AvatarFileView.as_view(), name="avatar-file"),
    
    # AI endpoints (must precede router so /resumes/parse/ is not captured as pk)
    path("resumes/parse/", views.ResumeParseView.as_view(), name="resume-parse"),
    path("jobs/match/", views.JobMatchAnalysisView.as_view(), name="job-match"),
    path("jobs/full-analysis/", views.JobFullAnalysisView.as_view(), name="job-full-analysis"),
    path("jobs/scan/", views.JobScanView.as_view(), name="job-scan"),
    path("jobs/scan/<int:site_id>/", views.JobScanSiteView.as_view(), name="job-scan-site"),
    path("jobs/run-match-analysis/", views.JobMatchAnalysisTriggerView.as_view(), name="job-run-match-analysis"),
    path("", include(router.urls)),
    # Auth
    path("auth/register/", views.RegisterView.as_view(), name="auth-register"),
    path("auth/login/", views.LoginView.as_view(), name="auth-login"),
    path("auth/logout/", views.LogoutView.as_view(), name="auth-logout"),
    path(
        "auth/refresh/",
        TokenRefreshView.as_view(serializer_class=views.SafeTokenRefreshSerializer),
        name="auth-refresh",
    ),
    path("auth/me/", views.MeView.as_view(), name="auth-me"),
    path("auth/password-reset/", views.PasswordResetRequestView.as_view(), name="auth-password-reset"),
    path(
        "auth/password-reset/confirm/",
        views.PasswordResetConfirmView.as_view(),
        name="auth-password-reset-confirm",
    ),
    path("auth/email-test/", views.EmailTestView.as_view(), name="auth-email-test"),
]
