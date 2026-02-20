# Generated migration for UserNotification model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0009_system_notification"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserNotification",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_read", models.BooleanField(default=False, help_text="Whether the user has read this notification.")),
                ("read_at", models.DateTimeField(blank=True, help_text="When the user read this notification.", null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "notification",
                    models.ForeignKey(
                        help_text="The system notification that was sent.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_receipts",
                        to="core.systemnotification",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        help_text="The user who received this notification.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="received_notifications",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "core_user_notification",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="usernotification",
            constraint=models.UniqueConstraint(fields=["user", "notification"], name="core_user_notification_user_notification_uniq"),
        ),
        migrations.AddIndex(
            model_name="usernotification",
            index=models.Index(fields=["user", "-created_at"], name="core_user_n_user_id_created_idx"),
        ),
        migrations.AddIndex(
            model_name="usernotification",
            index=models.Index(fields=["is_read", "-created_at"], name="core_user_n_is_read_created_idx"),
        ),
    ]
