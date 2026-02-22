"""
Views for serving media files (avatars) with CORS headers.
This avoids OpaqueResponseBlocking errors when browsers request images.
"""
import os
from django.http import FileResponse, HttpResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


class AvatarFileView(APIView):
    """
    Serve avatar files with proper CORS headers.
    Fixes OpaqueResponseBlocking errors by adding required headers.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, year, month, filename):
        """
        Serve avatar image from local media directory.
        Example: GET /media-serve/avatars/2026/02/pic.jpg
        """
        try:
            # Construct safe file path
            file_path = os.path.join(
                settings.MEDIA_ROOT,
                'avatars',
                year,
                month,
                filename
            )
            
            # Security: Don't allow path traversal
            if not os.path.abspath(file_path).startswith(os.path.abspath(settings.MEDIA_ROOT)):
                return HttpResponse(status=403)
            
            # Check if file exists
            if not os.path.isfile(file_path):
                return HttpResponse(status=404)
            
            # Open and serve the file
            with open(file_path, 'rb') as f:
                content = f.read()
            
            # Determine content type
            if filename.lower().endswith('.jpg') or filename.lower().endswith('.jpeg'):
                content_type = 'image/jpeg'
            elif filename.lower().endswith('.png'):
                content_type = 'image/png'
            elif filename.lower().endswith('.gif'):
                content_type = 'image/gif'
            elif filename.lower().endswith('.webp'):
                content_type = 'image/webp'
            else:
                content_type = 'application/octet-stream'
            
            # Create response with proper CORS headers
            response = HttpResponse(content, content_type=content_type)
            
            # Add CORS headers to allow image loading from any origin
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type'
            response['Cache-Control'] = 'public, max-age=3600'  # Cache for 1 hour
            
            return response
            
        except Exception as e:
            return HttpResponse(status=500)
    
    def options(self, request, year=None, month=None, filename=None):
        """Handle CORS preflight requests."""
        response = HttpResponse()
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response
