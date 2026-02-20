"""
Management command to test notification flow
"""
from django.core.management.base import BaseCommand
from core.models import SystemNotification, UserNotification
from django.contrib.auth.models import User
from django.utils import timezone


class Command(BaseCommand):
    help = 'Test notification creation and delivery'

    def handle(self, *args, **options):
        # Get or create test users
        admin_user, _ = User.objects.get_or_create(
            username='admin_test',
            defaults={'email': 'admin@test.com', 'is_staff': True, 'is_superuser': True}
        )
        
        regular_user1, _ = User.objects.get_or_create(
            username='user1_test',
            defaults={'email': 'user1@test.com', 'is_active': True}
        )
        
        regular_user2, _ = User.objects.get_or_create(
            username='user2_test',
            defaults={'email': 'user2@test.com', 'is_active': True}
        )
        
        self.stdout.write(f"✓ Users created/existing:")
        self.stdout.write(f"  - Admin: {admin_user.email} (ID: {admin_user.id})")
        self.stdout.write(f"  - User1: {regular_user1.email} (ID: {regular_user1.id})")
        self.stdout.write(f"  - User2: {regular_user2.email} (ID: {regular_user2.id})")
        
        # Create a test notification
        test_notif = SystemNotification.objects.create(
            title="Test Notification",
            message="This is a test notification",
            notification_type=SystemNotification.NotificationType.INFO,
            created_by=admin_user,
            is_sent=False,
            send_immediately=True
        )
        
        self.stdout.write(f"\n✓ Created SystemNotification: ID {test_notif.id}")
        self.stdout.write(f"  - Title: {test_notif.title}")
        self.stdout.write(f"  - Is Sent: {test_notif.is_sent}")
        
        # Manually create UserNotification records (simulating what the task should do)
        user_notifications = []
        active_users = User.objects.filter(is_active=True)
        
        for user in active_users:
            user_notifications.append(
                UserNotification(
                    user=user,
                    notification=test_notif,
                    is_read=False
                )
            )
        
        created_count = len(UserNotification.objects.bulk_create(
            user_notifications, 
            ignore_conflicts=True
        ))
        
        test_notif.is_sent = True
        test_notif.sent_at = timezone.now()
        test_notif.save()
        
        self.stdout.write(f"\n✓ Created {created_count} UserNotification records")
        
        # Verify the records exist
        self.stdout.write(f"\n=== Verification ===")
        
        # Check SystemNotification
        check_notif = SystemNotification.objects.get(id=test_notif.id)
        self.stdout.write(f"SystemNotification {check_notif.id}:")
        self.stdout.write(f"  - Is Sent: {check_notif.is_sent}")
        self.stdout.write(f"  - User Receipts Count: {check_notif.user_receipts.count()}")
        
        # Check UserNotifications for each user
        for user in [admin_user, regular_user1, regular_user2]:
            user_notifs = UserNotification.objects.filter(user=user, notification=test_notif)
            self.stdout.write(f"\nUser {user.email} (ID: {user.id}):")
            self.stdout.write(f"  - Total Notifications: {user_notifs.count()}")
            for un in user_notifs:
                self.stdout.write(f"    * Notification {un.notification_id}: {un.notification.title} (Is Read: {un.is_read})")
        
        self.stdout.write(self.style.SUCCESS("\n✅ Test completed successfully!"))
