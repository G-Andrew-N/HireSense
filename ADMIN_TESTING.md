# Admin Dashboard Testing Guide

## Manual Testing Checklist

### Prerequisites
- [ ] Superuser account created
- [ ] Django development server running
- [ ] Frontend Vite server running  
- [ ] Celery worker running
- [ ] Redis server running

### Backend Tests

#### 1. Test Superuser Access
```bash
cd BackEnd/app

# Check if a superuser exists
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> User.objects.filter(is_superuser=True).exists()
True  # Should return True
```

#### 2. Test SystemNotification Model
```python
python manage.py shell
>>> from core.models import SystemNotification
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> admin = User.objects.filter(is_superuser=True).first()

# Create a test notification
>>> notification = SystemNotification.objects.create(
...     title="Test Notification",
...     message="This is a test notification",
...     notification_type="info",
...     created_by=admin,
... )
>>> notification.id  # Should print a number
1

# Verify it was created
>>> SystemNotification.objects.count()
1
```

#### 3. Test Notification API (via curl)
```bash
# First get an access token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-superuser@example.com",
    "password": "your-password"
  }'

# Copy the "access" token from response and use it below:

# List notifications
curl -X GET http://localhost:8000/api/admin/notifications/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get admin stats
curl -X GET http://localhost:8000/api/admin/notifications/admin_stats/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create a notification
curl -X POST http://localhost:8000/api/admin/notifications/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test message",
    "notification_type": "info"
  }'

# Send notification (replace NOTIFICATION_ID)
curl -X POST http://localhost:8000/api/admin/notifications/send_notification/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_id": 1
  }'
```

#### 4. Test Non-Superuser Access (Should Fail)
```bash
# Create a regular (non-superuser) account first in admin or shell

curl -X GET http://localhost:8000/api/admin/notifications/ \
  -H "Authorization: Bearer REGULAR_USER_TOKEN"

# Should return 403 Forbidden
```

#### 5. Test Celery Task
```python
python manage.py shell
>>> from core.tasks import send_notification_to_users
>>> from core.models import SystemNotification

# Get a test notification
>>> notification = SystemNotification.objects.last()

# Send it asynchronously
>>> task = send_notification_to_users.delay(notification.id)

# Check task result (monitor Celery worker output)
>>> task.state
# Should show 'SUCCESS' after a few seconds
```

### Frontend Tests

#### 1. Test Admin Route Access (Superuser)
```bash
# With superuser account:
# 1. Navigate to http://localhost:5173/admin
# 2. Should see admin dashboard with stats
# 3. Should not be redirected
```

#### 2. Test Admin Route Redirect (Non-Superuser)
```bash
# With regular user account:
# 1. Navigate to http://localhost:5173/admin
# 2. Should be redirected to /dashboard
```

#### 3. Test Sidebar Admin Link
```bash
# As superuser:
# 1. Login and view sidebar
# 2. Should see "Admin Dashboard" link with shield icon
# 3. Click link and verify navigation to /admin
```

#### 4. Test Dashboard Statistics Loading
```bash
# On admin dashboard:
# 1. Check that statistics load (should appear with animation)
# 2. Check for all stat boxes:
#    - Total Users
#    - New Users (30d)
#    - Job Matches
#    - Notifications
#    - System Status
```

#### 5. Test Notification Form
```bash
# On admin dashboard:
# 1. Click "New Notification" button
# 2. Form should appear with fields:
#    - Title input
#    - Type dropdown
#    - Message textarea
#    - Send button
# 3. Fill form with test data
# 4. Click "Send to All Users"
# 5. Should see success message
# 6. Notification should appear in history below
```

#### 6. Test Notification Types
```bash
# Create notifications with each type and verify:
# - Info (blue badge)
# - Maintenance (red badge)
# - Important Update (orange badge)
# - Alert (yellow badge)
# - Warning (purple badge)
```

#### 7. Test Auto-Refresh
```bash
# On admin dashboard:
# 1. Create a notification in another browser/tab
# 2. Wait 30 seconds (or less)
# 3. Dashboard should update automatically
# 4. New notification should appear in history
```

#### 8. Test Dark Mode
```bash
# On admin dashboard:
# 1. Click theme toggle
# 2. Dashboard should switch to dark theme
# 3. All colors and text should be readable
# 4. Theme should persist on reload
```

### Integration Tests

#### 1. End-to-End Notification Flow
```
1. Login as superuser
2. Navigate to /admin
3. Create a notification: "Test Email Notification"
4. Click "Send to All Users"
5. Check email for all users:
   - Email received
   - Title matches notification title
   - Message matches notification message
   - Type badge correct color
   - Links functional
```

#### 2. Permission Verification
```
1. Create a regular user account
2. Login as that user
3. Try to access /admin
   - Should redirect to /dashboard
4. Try to call API directly:
   curl http://localhost:8000/api/admin/notifications/
   - Should return 403 Forbidden
```

#### 3. Statistics Accuracy
```
1. Note current stat values
2. Create new user(s)
3. Refresh admin dashboard
4. Verify "Total Users" increased
5. Create job matches
6. Verify "Job Matches" increased
```

### Database Tests

#### Check Notification Table
```bash
python manage.py shell
>>> from core.models import SystemNotification
>>> notifications = SystemNotification.objects.all()
>>> for n in notifications:
...     print(f"{n.title} - {n.notification_type} - Sent: {n.is_sent}")
```

#### Verify Database Integrity
```bash
python manage.py shell
>>> from core.models import SystemNotification
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()

# Check that created_by is always set
>>> n = SystemNotification.objects.first()
>>> if n.created_by:
...     print(f"Notification created by: {n.created_by.email}")

# Verify foreign key relationship
>>> admin = User.objects.filter(is_superuser=True).first()
>>> admin.created_notifications.count()
# Should show number of notifications created by this admin
```

## Performance Tests

### Load Testing
```python
# Create multiple notifications and track time
python manage.py shell
>>> from core.models import SystemNotification
>>> from django.contrib.auth import get_user_model
>>> from django.utils import timezone
>>> import time

>>> User = get_user_model()
>>> admin = User.objects.filter(is_superuser=True).first()

>>> start = time.time()
>>> for i in range(100):
...     SystemNotification.objects.create(
...         title=f"Test {i}",
...         message=f"Message {i}",
...         notification_type="info",
...         created_by=admin,
...     )
>>> end = time.time()
>>> print(f"Created 100 notifications in {end - start:.2f} seconds")

# Query performance
>>> start = time.time()
>>> notifications = list(SystemNotification.objects.all()[:50])
>>> end = time.time()
>>> print(f"Queried and loaded 50 notifications in {end - start:.4f} seconds")
```

### Celery Task Performance
Monitor Celery worker output when sending notifications:
```
# Look for logs like:
# Fresh job scan completed after resume upload
# Notification 1 sent to 100 users (failures: 0)
# Average time should be < 30 seconds for 100 users
```

## Error Scenarios

### Test Invalid Data
```bash
# Missing required field
curl -X POST http://localhost:8000/api/admin/notifications/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Only Title"}'
# Should return 400 Bad Request

# Invalid notification type
curl -X POST http://localhost:8000/api/admin/notifications/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test",
    "message": "Test",
    "notification_type": "invalid"
  }'
# Should return 400 Bad Request
```

### Test Duplicate Send
```bash
# Try to send same notification twice
curl -X POST http://localhost:8000/api/admin/notifications/send_notification/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notification_id": 1}'

# Wait for first to complete, then run again
# Should return error: "Notification already sent"
```

### Test Non-existent Notification
```bash
curl -X POST http://localhost:8000/api/admin/notifications/send_notification/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notification_id": 99999}'
# Should return 404 Not Found
```

## Regression Tests

After each update to the admin dashboard, verify:
- [ ] Dashboard loads without errors
- [ ] Stats display correctly
- [ ] Creating notifications works
- [ ] Sending notifications works
- [ ] Emails are received by users
- [ ] Non-superusers cannot access
- [ ] Sidebar link appears for superusers
- [ ] Dark mode works

## Testing Checklist Summary

### Critical (Must Pass)
- [ ] Superuser can access admin dashboard
- [ ] Non-superuser cannot access admin dashboard
- [ ] Notifications can be created and sent
- [ ] Emails are received by users
- [ ] Database migration completes without errors

### Important (Should Pass)
- [ ] Statistics display correctly
- [ ] Auto-refresh works every 30 seconds
- [ ] All notification types display with correct colors
- [ ] Notification history shows all sent notifications
- [ ] Celery task completes successfully

### Nice to Have (Should Pass)
- [ ] Dark mode works correctly
- [ ] Animations are smooth
- [ ] Error messages are helpful
- [ ] Form validation works
- [ ] Responsive design on mobile

## Debugging Tips

### Enable Debug Logging
```python
# In Django settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'core': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

### Monitor Celery Tasks
```bash
# In Celery worker terminal, look for:
[tasks]
  . core.tasks.send_notification_to_users
[2026-02-20 12:00:00,123: INFO/MainProcess] Task core.tasks.send_notification_to_users[...] received
```

### Check Email Sending
```python
# In Django shell
>>> from django.core.mail import get_connection
>>> connection = get_connection()
>>> print(f"Email backend: {connection.__class__.__name__}")
# ConsoleEmailBackend = prints to console
# SMTPEmailBackend = sends real emails
```

---

**Remember**: All tests should be performed in a development environment. Never test with production user data!
