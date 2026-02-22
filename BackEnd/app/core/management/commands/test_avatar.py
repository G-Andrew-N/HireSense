"""
Management command to test avatar URL generation
Usage: python manage.py test_avatar
"""
import json
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from rest_framework_simplejwt.tokens import RefreshToken
from core.serializers import UserSerializer

User = get_user_model()


class Command(BaseCommand):
    help = "Test avatar URL generation in UserSerializer"

    def handle(self, *args, **options):
        # Get or create a test user
        user, created = User.objects.get_or_create(
            username="testuser",
            defaults={
                "email": "testuser@test.com",
                "is_active": True,
            }
        )
        
        # Create a request factory to simulate HTTP request context
        factory = APIRequestFactory()
        
        # Test 1: Simple GET request with APIRequestFactory
        self.stdout.write(self.style.WARNING("\n=== Test 1: APIRequestFactory Request ==="))
        request = factory.get('/api/auth/me/')
        try:
            host = request.get_host()
        except Exception as e:
            host = f"(Error: {e})"
        serializer = UserSerializer(user, context={'request': request})
        data = serializer.data
        self.stdout.write(f"Request scheme: {request.scheme}")
        self.stdout.write(f"Request host: {host}")
        self.stdout.write(f"Avatar URL: {data.get('avatar')}")
        
        # Test 2: Simulate a Render-style request with X-Forwarded-Proto
        self.stdout.write(self.style.WARNING("\n=== Test 2: Render/Proxy Request (with X-Forwarded headers) ==="))
        request = factory.get('/api/auth/me/', HTTP_X_FORWARDED_PROTO='https', HTTP_X_FORWARDED_HOST='hiresense-backend.onrender.com')
        try:
            host = request.get_host()
        except Exception as e:
            host = f"(Error: {e})"
        serializer = UserSerializer(user, context={'request': request})
        data = serializer.data
        self.stdout.write(f"Request scheme: {request.scheme}")
        self.stdout.write(f"Request host: {host}")
        self.stdout.write(f"Avatar URL: {data.get('avatar')}")
        
        # Test 3: With proper HTTP request (would be done via curl on real server)
        self.stdout.write(self.style.WARNING("\n=== Test 3: LocalHost Request ==="))
        request = factory.get('/api/auth/me/', HTTP_HOST='localhost:8000')
        try:
            host = request.get_host()
        except Exception as e:
            host = f"(Error: {e})"
        serializer = UserSerializer(user, context={'request': request})
        data = serializer.data
        self.stdout.write(f"Request scheme: {request.scheme}")
        self.stdout.write(f"Request host: {host}")
        self.stdout.write(f"Avatar URL: {data.get('avatar')}")
        
        # Summary
        self.stdout.write(self.style.SUCCESS("\n=== Summary ==="))
        self.stdout.write("All tests completed. Check logs for details.")
        self.stdout.write("Expected: Avatar URLs should be either absolute (http://...) or relative (/api/...)")

