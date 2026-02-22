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
        kwargs['location'] = os.path.join(settings.BASE_DIR, 'media', 'avatars')
        kwargs['base_url'] = '/media/avatars/'
        super().__init__(*args, **kwargs)
