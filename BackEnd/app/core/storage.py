"""
Custom storage backends for HireSense.
"""
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os


class LocalAvatarStorage(FileSystemStorage):
    """
    Local file system storage for avatars.
    Stores avatars in MEDIA_ROOT/avatars/ to avoid CORS issues with Cloudinary.
    """
    def __init__(self, *args, **kwargs):
        # Use local media directory for avatars
        # Note: upload_to="avatars/..." will be appended, so just use MEDIA_ROOT
        kwargs['location'] = os.path.join(settings.BASE_DIR, 'media')
        kwargs['base_url'] = '/media/'
        super().__init__(*args, **kwargs)
