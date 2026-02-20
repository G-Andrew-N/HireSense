# Notification System Testing Guide

## Overview
This guide will help you test that notifications created by admins properly appear on other users' notification feeds.

## Prerequisites
- Django development server running
- Celery worker running
- Redis running (for Celery message queue)

## Quick Automated Test

Run this command to verify the notification records are being created properly:

```bash
cd /home/andrew/HireSense/BackEnd/app
python manage.py test_notification_system
```

This will:
1. Create test admin and regular users
2. Create a system notification
3. Simulate what the Celery task should do (create UserNotification records)
4. Verify each user can see their notifications
5. Display API response format

## Manual End-to-End Test

### Step 1: Start Services
```bash
# Terminal 1: Django dev server
cd /home/andrew/HireSense/BackEnd/app
python manage.py runserver

# Terminal 2: Celery worker  
cd /home/andrew/HireSense/BackEnd/app
python -m celery -A app worker -l info

# Terminal 3: Frontend dev server
cd /home/andrew/HireSense/FrontEnd
npm run dev
```

### Step 2: Admin Creates & Sends Notification
1. Open browser to http://localhost:5173
2. Log in with admin account (email: admin@test.com)
3. Navigate to Admin Dashboard (visible in sidebar)
4. Click "New Notification"
5. Fill in:
   - **Title**: "Test Message for All Users"
   - **Type**: "Information"
   - **Message**: "This notification should appear for all logged-in users"
6. Click "Create Notification"
7. The notification appears in "Pending" tab
8. Click "Send Now" button
9. **Watch the Celery worker terminal** - you should see:
   - `Task core.tasks.send_notification_to_users received`
   - HTML email content logged
   - `Notification X sent to Y users (failures: 0)`

### Step 3: Regular User Receives Notification
1. In the same or new browser tab, log out (click profile > Logout)
2. Log in as a different user (e.g., user1@test.com)
3. Navigate to **Notifications** page (bell icon in header)
4. Go to **System** tab (with shield icon)
5. **Expected Result**: You should see the notification with:
   - Title: "Test Message for All Users"
   - Type: "Information"
   - Message: "This notification should appear for all logged-in users"
   - Timestamp of when it was sent

### Step 4: Verify Multiple Users See It
1. Log out
2. Log in as another user (e.g., user2@test.com)
3. Go to Notifications > System tab
4. **Expected**: Same notification appears for this user too

## Key Things to Monitor

### In Django Server Terminal
```
GET /api/notifications/
# Response should be 200 OK with notification data (not empty)
```

### In Celery Worker Terminal
```
[INFO/MainProcess] Task core.tasks.send_notification_to_users[...] received
[INFO/ForkPoolWorker-X] Notification Y sent to Z users (failures: 0)
```

### In Browser Network Tab (DevTools)
1. Open browser DevTools (F12)
2. Go to Network tab
3. When you navigate to Notifications page, look for request to `/api/notifications/`
4. Response should include notification objects (not empty array)

## Troubleshooting

### Issue: Notification appears in Admin History but not to other users

**Step 1**: Check Celery worker logs
- Look for error messages like:
  - `"name 'settings' is not defined"` (missing import - FIXED)
  - `"EmailMessage.__init__() got an unexpected keyword argument"` (FIXED)
  - `"Notification X sent to 0 users (failures: 10)"` (task failed)

**Step 2**: Run the automated test
```bash
python manage.py test_notification_system
```

This will tell you if UserNotification records are being created.

**Step 3**: Check database directly
```bash
cd /home/andrew/HireSense/BackEnd/app
python manage.py shell
>>> from core.models import SystemNotification, UserNotification
>>> notifications = SystemNotification.objects.all().order_by('-created_at')
>>> latest = notifications[0]
>>> print(f"Notification: {latest.title}")
>>> print(f"Is Sent: {latest.is_sent}") 
>>> print(f"User Receipts: {latest.user_receipts.count()}")
>>> for receipt in latest.user_receipts.all()[:5]:
...     print(f"  - {receipt.user.email}: is_read={receipt.is_read}")
```

### Issue: Celery task fails with imports

Import statements have been fixed in tasks.py:
- ✅ `from django.conf import settings` (line 6)
- ✅ `from .models import ... ResumeInsight` (line 13)

### Issue: Notifications page shows "No System Notifications"

Check:
1. Celery worker is actually running and processing tasks
2. Check `/api/notifications/` endpoint returns data:
   ```bash
   # Terminal: Test API directly
   cd /home/andrew/HireSense/BackEnd/app
   python manage.py shell
   >>> from core.models import UserNotification
   >>> from django.contrib.auth.models import User
   >>> user = User.objects.first()
   >>> notifs = UserNotification.objects.filter(user=user)
   >>> notifs.count()  # Should be > 0 if notifications were sent
   ```

## Expected Behavior Timeline

```
T+0:00   - Admin clicks "Send Now"
T+0:01   - Celery task received by worker
T+0:02   - Celery sends emails to all users
T+0:03   - Celery creates UserNotification records
T+0:04   - Celery marks SystemNotification as is_sent=True
T+0:10   - User logs in as different user
T+0:15   - User navigates to Notifications page
T+0:16   - Frontend calls /api/notifications/ endpoint
T+0:17   - API returns list including the new notification
T+0:18   - ✅ Notification visible in System Notifications tab
```

## Success Criteria

✅ **Test Passed** when:
1. Admin sends a notification
2. Celery worker logs show `"Notification X sent to Y users (failures: 0)"`
3. Different user sees notification in their Notifications > System tab
4. Notification displays correct title, message, and type
5. User can mark notification as read

❌ **Test Failed** when:
1. Notification doesn't appear for other users
2. Celery logs show failures or errors
3. API returns empty notifications list
4. Frontend shows "No System Notifications" when admin sent one
