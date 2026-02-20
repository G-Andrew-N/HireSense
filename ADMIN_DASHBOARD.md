# Admin Dashboard Documentation

## Overview

The Admin Dashboard is a superuser-only interface for managing system notifications and monitoring HireSense system health. Only users with superuser status can access this dashboard.

## Features

### 1. System Monitoring
- **Total Users**: Track total registered users and active users (last 7 days)
- **New Users (30d)**: Monitor recent user signups
- **Job Matches**: View total job postings and matches made
- **Notifications**: Track sent and pending system notifications
- **System Status**: Real-time operational status indicator

### 2. Notification Management
- **Create Notifications**: Send system-wide announcements to all users
- **Notification Types**:
  - **Maintenance**: For scheduled maintenance announcements
  - **Important Update**: Critical platform updates
  - **Information**: General information broadcasts
  - **Alert**: Time-sensitive alerts
  - **Warning**: Warning messages
- **Notification History**: View all sent and pending notifications with timestamps

## Accessing the Admin Dashboard

### URL
```
/admin
```

### Access Requirements
- Must be authenticated
- Must have superuser status (`is_superuser=true`)

### Automatic Protection
Non-superusers attempting to access `/admin` will be automatically redirected to `/dashboard`.

## Creating Notifications

### Steps
1. Click "New Notification" button
2. Fill in the notification form:
   - **Title**: Brief subject line (required)
   - **Type**: Select notification category
   - **Message**: Detailed message body (supports line breaks)
3. Click "Send to All Users"
4. Notification is immediately sent to all active users

### Email Format
Notifications are automatically formatted as professional HTML emails with:
- Colored header indicating notification type
- Formatted message body
- Link to dashboard
- Option to manage notification preferences in settings

## Backend API Endpoints

### List Notifications
```
GET /api/admin/notifications/
Permission: Superuser only
Response: List of SystemNotification objects
```

### Create Notification
```
POST /api/admin/notifications/
Permission: Superuser only
Body: {
  "title": "string",
  "message": "string",
  "notification_type": "maintenance|important|info|alert|warning",
  "send_immediately": boolean (optional, default: true)
}
Response: Created SystemNotification object
```

### Send Notification
```
POST /api/admin/notifications/send_notification/
Permission: Superuser only
Body: {
  "notification_id": integer
}
Response: {
  "detail": "Notification sent successfully",
  "task_id": "celery_task_id",
  "notification_id": integer
}
```

### Get Admin Statistics
```
GET /api/admin/notifications/admin_stats/
Permission: Superuser only
Response: {
  "users": {
    "total": integer,
    "active_7d": integer,
    "new_30d": integer
  },
  "resumes": {
    "total": integer
  },
  "jobs": {
    "total_postings": integer,
    "total_matches": integer
  },
  "notifications": {
    "sent": integer,
    "pending": integer
  },
  "status": "operational"
}
```

## Permissions & Security

### Permission Class: `IsSuperUser`
- Checks both authentication and superuser status
- Returns 403 Forbidden for non-superusers
- Built-in protection for all admin endpoints

### Database Constraints
- `created_by` is protected with `on_delete=PROTECT` (prevents accidental deletion)
- Only superusers can create notifications (enforced by viewset permissions)

## SystemNotification Model

### Fields
```python
- id: Primary key
- title: CharField (max 255 chars)
- message: TextField
- notification_type: Choice field
  - 'maintenance': Maintenance
  - 'important': Important Update
  - 'info': Information
  - 'alert': Alert
  - 'warning': Warning
- created_by: ForeignKey to User (superuser)
- is_sent: Boolean (default: False)
- send_immediately: Boolean (default: True)
- scheduled_for: DateTimeField (nullable, for future scheduling)
- sent_at: DateTimeField (nullable, set when notification is sent)
- created_at: DateTimeField (auto-set)
- updated_at: DateTimeField (auto-updated)
```

## Celery Task: `send_notification_to_users`

### Purpose
Asynchronously sends notifications to all active users via email.

### Execution
```python
from core.tasks import send_notification_to_users

# Trigger when creating/sending notification
task = send_notification_to_users.delay(notification_id)
```

### Process
1. Fetches notification by ID
2. Checks if already sent (prevents duplicates)
3. Retrieves all active users (`is_active=True`)
4. Sends HTML-formatted email to each user
5. Marks notification as sent
6. Logs results (successes and failures)

### Return Value
```python
{
  "notification_id": integer,
  "sent_count": integer,
  "failed_count": integer
}
```

## Frontend Components

### AdminDashboard.tsx
Main component located at `/src/app/pages/AdminDashboard.tsx`

#### Features
- Responsive grid layout for statistics
- Real-time stats refresh every 30 seconds
- Notification form with validation
- Notification history with filtering
- Error and success message handling
- Dark mode support

#### Key Hooks
- `useAuth()`: Get current user and authentication status
- `useNavigate()`: Redirect non-superusers
- `useState()`: Form state and UI state management
- `useEffect()`: Data fetching and auto-refresh

#### Auto-Refresh
Dashboard automatically refreshes statistics every 30 seconds when mounted.

## Database Migration

Migration file: `0009_system_notification.py`

### Tables Created
- `core_system_notification`: Stores all system notifications
  - Indexes on `created_at` (descending) and `(is_sent, send_immediately)` for efficient queries

## Usage Examples

### Creating a Maintenance Notification (via API)
```bash
curl -X POST http://localhost:8000/api/admin/notifications/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Scheduled Maintenance",
    "message": "HireSense will be undergoing maintenance tonight from 2-4 AM EST. Please plan accordingly.",
    "notification_type": "maintenance"
  }'
```

### Creating a Critical Alert (via API)
```bash
curl -X POST http://localhost:8000/api/admin/notifications/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Critical Security Update",
    "message": "We have released an important security update. All users are recommended to change their passwords.",
    "notification_type": "important"
  }'
```

## Monitoring & Troubleshooting

### Check Sent Notifications
```python
from core.models import SystemNotification

# Get recent notifications
recent = SystemNotification.objects.filter(is_sent=True).order_by('-sent_at')[:10]

# Get pending notifications
pending = SystemNotification.objects.filter(is_sent=False)
```

### Check Email Sending Status
Monitor Celery logs for task execution:
```
celery@fedora: Task send_notification_to_users[...] succeeded
```

### Common Issues

**Notification not sending:**
- Check Celery worker is running
- Verify email configuration in Django settings
- Check Django logs for exceptions

**Stats not updating:**
- Dashboard auto-refreshes every 30 seconds
- Force refresh browser (Ctrl+Shift+R)
- Check browser console for API errors

**Access denied error:**
- Verify user has `is_superuser=True`
- Check authentication token in localStorage
- Ensure token hasn't expired (may need to login again)

## Future Enhancements

Potential features for future versions:
1. **Scheduled Notifications**: Schedule notifications for specific times
2. **Targeted Notifications**: Send to specific user groups/roles
3. **Notification Analytics**: Track read rates and user engagement
4. **Notification Templates**: Save and reuse notification templates
5. **Multi-language Support**: Send notifications in multiple languages
6. **Notification Categories**: Allow users to subscribe/unsubscribe from categories
7. **Notification History Export**: Export notification data for reports
