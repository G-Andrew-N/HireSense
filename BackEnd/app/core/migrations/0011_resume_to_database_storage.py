# Generated migration: Move resumes from Cloudinary to database BinaryField storage

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_user_notification'),
    ]

    operations = [
        # Add the new file_data BinaryField
        migrations.AddField(
            model_name='resume',
            name='file_data',
            field=models.BinaryField(help_text='Resume file content (PDF, DOC, DOCX, TXT) stored as binary data in database.', null=True, blank=True),
        ),
        # Update UserProfile.avatar to explicitly use Cloudinary storage
        migrations.AlterField(
            model_name='userprofile',
            name='avatar',
            field=models.ImageField(
                storage='cloudinary_storage.storage.CloudinaryStorage',
                upload_to='avatars/%Y/%m/',
                null=True,
                blank=True,
                help_text='Profile photo.',
            ),
        ),
        # NOTE: The old 'file' FileField is kept for backwards compatibility.
        # After this migration is applied and file_data is populated,
        # a separate migration will remove the old field.
    ]

