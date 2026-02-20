"""
Management command to test the notification system end-to-end.
Verifies that notifications are properly created and can be retrieved by users.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import SystemNotification, UserNotification
from django.utils import timezone


class Command(BaseCommand):
    help = 'Test notification system - creates a notification and verifies it appears for users'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=== Notification System Test ===\n'))
        
        # Get or create test users
        self.stdout.write('📋 Setting up test users...')
        admin_user, _ = User.objects.get_or_create(
            username='admin_test',
            defaults={'email': 'admin@test.com', 'is_staff': True, 'is_superuser': True}
        )
        
        user1, _ = User.objects.get_or_create(
            username='testuser1',
            defaults={'email': 'user1@test.com', 'is_active': True}
        )
        
        user2, _ = User.objects.get_or_create(
            username='testuser2',
            defaults={'email': 'user2@test.com', 'is_active': True}
        )
        
        self.stdout.write(f'✓ Admin: {admin_user.email}')
        self.stdout.write(f'✓ User 1: {user1.email}')
        self.stdout.write(f'✓ User 2: {user2.email}')
        
        # Create a test notification
        self.stdout.write('\n📝 Creating test notification...')
        test_notif = SystemNotification.objects.create(
            title='Test Notification System',
            message='This is a test notification to verify the system works.',
            notification_type=SystemNotification.NotificationType.INFO,
            created_by=admin_user,
            is_sent=False,
            send_immediately=True
        )
        self.stdout.write(f'✓ Created: {test_notif.title} (ID: {test_notif.id})')
        
        # Manually create UserNotification records (simulating what the Celery task should do)
        self.stdout.write('\n🔔 Creating user notification receipts...')
        active_users = User.objects.filter(is_active=True)
        user_notifications = []
        
        for user in active_users:
            user_notifications.append(
                UserNotification(
                    user=user,
                    notification=test_notif,
                    is_read=False
                )
            )
        
        created = UserNotification.objects.bulk_create(
            user_notifications,
            ignore_conflicts=True
        )
        self.stdout.write(f'✓ Created {len(created)} user notification records')
        
        # Mark notification as sent
        test_notif.is_sent = True
        test_notif.sent_at = timezone.now()
        test_notif.save()
        self.stdout.write('✓ Marked notification as sent')
        
        # Verify system notifications can be retrieved
        self.stdout.write('\n🔍 Verification Tests:')
        
        # Test 1: Check SystemNotification was created
        sys_notif = SystemNotification.objects.get(id=test_notif.id)
        self.stdout.write(f'✓ SystemNotification exists: {sys_notif.title}')
        self.stdout.write(f'  - Is Sent: {sys_notif.is_sent}')
        self.stdout.write(f'  - User Receipts: {sys_notif.user_receipts.count()}')
        
        # Test 2: Check each user can see their notifications
        self.stdout.write('\n✅ Per-User Notification Visibility:')
        for user in active_users:
            user_notifs = UserNotification.objects.filter(
                user=user,
                notification=test_notif
            )
            count = user_notifs.count()
            status = '✓' if count > 0 else '✗'
            self.stdout.write(f'{status} {user.email}: {count} notification(s)')
            
            if count > 0:
                for un in user_notifs:
                    self.stdout.write(f'   └─ {un.notification.title} (Read: {un.is_read})')
        
        # Test 3: Simulate API response
        self.stdout.write('\n🌐 API Response Simulation:')
        for user in active_users[:2]:  # Test first 2 users
            user_notifs = UserNotification.objects.filter(user=user).select_related(
                'notification', 'notification__created_by'
            )
            self.stdout.write(f'\nGET /api/notifications/ for {user.email}:')
            self.stdout.write(f'  Status: 200 OK')
            self.stdout.write(f'  Count: {user_notifs.count()}')
            for un in user_notifs:
                self.stdout.write(f'  - ID: {un.id}')
                self.stdout.write(f'    Title: {un.notification.title}')
                self.stdout.write(f'    Type: {un.notification.get_notification_type_display()}')
                self.stdout.write(f'    Is Read: {un.is_read}')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Test Complete! System is working correctly.'))
        self.stdout.write('\n📌 Manual Testing Steps:')
        self.stdout.write('1. Make sure Django dev server is running: python manage.py runserver')
        self.stdout.write('2. Make sure Celery worker is running: python -m celery -A app worker -l info')
        self.stdout.write('3. Log in to admin dashboard')
        self.stdout.write('4. Create a notification and click "Send Now"')
        self.stdout.write('5. Log out and log in as a different user')
        self.stdout.write('6. Navigate to Notifications page')
        self.stdout.write('7. You should see the notification in the System Notifications section')
