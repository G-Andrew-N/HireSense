"""
Views for serving media files (avatars) with CORS headers.
This avoids OpaqueResponseBlocking errors when browsers request images.
"""
import os
import logging
from django.http import FileResponse, HttpResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)

# Default avatar SVG (humanoid silhouette)
DEFAULT_AVATAR_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <!-- Background circle -->
  <circle cx="100" cy="100" r="100" fill="#e5e7eb"/>
  
  <!-- Head -->
  <circle cx="100" cy="70" r="35" fill="#9ca3af"/>
  
  <!-- Body -->
  <rect x="75" y="110" width="50" height="60" rx="8" fill="#9ca3af"/>
  
  <!-- Arms -->
  <rect x="35" y="115" width="40" height="15" rx="8" fill="#9ca3af"/>
  <rect x="125" y="115" width="40" height="15" rx="8" fill="#9ca3af"/>
</svg>'''


class AvatarFileView(APIView):
    """
    Serve avatar files with proper CORS headers.
    Fixes OpaqueResponseBlocking errors by adding required headers.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, year, month, filename):
        """
        Serve avatar image from local media directory.
        Endpoint: GET /api/media/avatars/{year}/{month}/{filename}
        Example: GET /api/media/avatars/2026/02/pic.jpg
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
                logger.warning(f"Path traversal attempt: {file_path}")
                return HttpResponse(status=403)
            
            # Check if file exists
            if not os.path.isfile(file_path):
                logger.debug(f"Avatar not found: {file_path}")
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
            logger.exception(f"Error serving avatar {year}/{month}/{filename}: {str(e)}")
            return HttpResponse(status=500)
    
    def options(self, request, year=None, month=None, filename=None):
        """Handle CORS preflight requests."""
        response = HttpResponse()
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response


class DefaultAvatarView(APIView):
    """
    Serve a default avatar SVG for users who haven't set a profile picture.
    This endpoint is production-safe and works in all environments.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Serve default avatar image.
        Endpoint: GET /api/media/avatars/default
        Returns: SVG image with CORS headers
        """
        try:
            response = HttpResponse(DEFAULT_AVATAR_SVG, content_type='image/svg+xml; charset=utf-8')
            
            # Add CORS headers and caching
            response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type'
            response['Cache-Control'] = 'public, max-age=86400'  # Cache for 24 hours
            response['Content-Length'] = len(DEFAULT_AVATAR_SVG.encode('utf-8'))
            
            return response
        except Exception as e:
            logger.exception(f"Error serving default avatar: {str(e)}")
            # Return a minimal working SVG if there's any error
            fallback_svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100" fill="#e5e7eb"/></svg>'
            response = HttpResponse(fallback_svg, content_type='image/svg+xml; charset=utf-8')
            response['Access-Control-Allow-Origin'] = '*'
            return response
    
    def options(self, request):
        """Handle CORS preflight requests."""
        response = HttpResponse()
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        return response
