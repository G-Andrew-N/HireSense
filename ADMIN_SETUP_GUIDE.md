# Admin Dashboard Setup Guide

## Quick Start

The Admin Dashboard has been fully implemented and is ready to use. Follow these steps to set it up and start using it.

## Prerequisites

### Backend
- Django 5.2.11+
- Django REST Framework
- Celery (for async notification sending)
- Redis (for Celery)

### Frontend
- React with TypeScript
- Vite build tool
- Motion library (for animations)

## Setup Steps

### 1. Backend Setup

#### Run Database Migration
```bash
cd BackEnd/app
python manage.py migrate
```

This creates the `core_system_notification` table.

#### Verify Celery is Running
```bash
# In a separate terminal
cd BackEnd/app
celery -A app worker -l info
```

### 2. Frontend Setup

#### Install Dependencies (if not already done)
```bash
cd FrontEnd
npm install
```

#### No additional setup needed - the admin route is already integrated

### 3. Create a Superuser Account

If you don't have a superuser account yet:

```bash
cd BackEnd/app
python manage.py createsuperuser
```

Follow the prompts to create a superuser. This user will have admin access.

### 4. Start Development Servers

#### Backend
```bash
cd BackEnd/app
python manage.py runserver 0.0.0.0:8000
```

#### Frontend
```bash
cd FrontEnd
npm run dev
```

#### Celery Worker
```bash
cd BackEnd/app
celery -A app worker -l info
```

## Accessing the Admin Dashboard

### Method 1: Direct URL
```
http://localhost:5173/admin
```

### Method 2: Via Sidebar
1. Login to your dashboard
2. If you're a superuser, you'll see "Admin Dashboard" link in the sidebar with a shield icon
3. Click to navigate to the admin dashboard

## Using the Admin Dashboard

### Creating a Notification

1. Click **"New Notification"** button
2. Fill in the form:
   - **Title**: e.g., "System Maintenance"
   - **Type**: Select from dropdown:
     - Information
     - Maintenance
     - Important Update
     - Alert
     - Warning
   - **Message**: Enter your notification text (supports multi-line)
3. Click **"Send to All Users"**

The notification will be:
- Immediately sent to all active users
- Formatted as a professional HTML email
- Added to the notification history

### Viewing Dashboard Statistics

The top of the dashboard displays real-time statistics:
- **Total Users**: All registered accounts
- **New Users (30d)**: Recent signups in last 30 days
- **Active Users (7d)**: Users who logged in last 7 days
- **Job Matches**: Total job opportunities matched to users
- **Notifications**: Number of sent and pending notifications
- **System Status**: Operational health indicator

Statistics auto-refresh every 30 seconds.

### Viewing Notification History

Scroll down to see all sent and pending notifications:
- **Title**: Short subject line
- **Type Badge**: Color-coded by notification type
- **Status**: Shows "Sent" or "Pending"
- **Metadata**: Creator email and timestamps

## Notification Types & Use Cases

| Type | Color | Use Case |
|------|-------|----------|
| **Information** | Blue | General announcements, tips, updates |
| **Maintenance** | Red | Scheduled downtime, system updates |
| **Important Update** | Orange | Critical changes, security fixes |
| **Alert** | Yellow | Time-sensitive events, urgent notices |
| **Warning** | Purple | Caution messages, deprecation notices |

## Email Format

Notifications are sent as professional HTML emails with:
- Colored header indicating notification type
- Clean, readable layout
- Important links to dashboard
- Footer with notification preference settings

## API Reference

### All endpoints require superuser authentication

#### GET `/api/admin/notifications/`
List all notifications
```
Response: {
  "results": [
    {
      "id": 1,
      "title": "Maintenance",
      "message": "...",
      "notification_type": "maintenance",
      "created_by": 1,
      "created_by_email": "admin@example.com",
      "is_sent": true,
      "sent_at": "2026-02-20T12:00:00Z",
      "created_at": "2026-02-20T11:55:00Z"
    }
  ]
}
```

#### POST `/api/admin/notifications/`
Create and send a notification
```json
{
  "title": "System Notification",
  "message": "Message text here",
  "notification_type": "info",
  "send_immediately": true
}
```

#### POST `/api/admin/notifications/send_notification/`
Send a specific notification
```json
{
  "notification_id": 1
}
```

#### GET `/api/admin/notifications/admin_stats/`
Get dashboard statistics
```json
{
  "users": {
    "total": 45,
    "active_7d": 32,
    "new_30d": 8
  },
  "resumes": {
    "total": 120
  },
  "jobs": {
    "total_postings": 5000,
    "total_matches": 342
  },
  "notifications": {
    "sent": 3,
    "pending": 0
  },
  "status": "operational"
}
```

## Troubleshooting

### "Access Denied" Error
- Verify your account is a superuser (`is_superuser=true`)
- Check that you're logged in
- Try logging out and back in

### Notifications Not Sending
- Verify Celery worker is running (check terminal for `Ready to accept tasks`)
- Check Django email configuration in `settings.py`
- Check Celery logs for errors

### Dashboard Stats Not Updating
- Refresh the page (browser auto-refresh every 30 seconds)
- Check browser console for API errors (F12)
- Verify authentication token is valid

### "Notification not found" Error
- Ensure you're sending the correct notification ID
- Verify the notification still exists (not deleted)

## Security Notes

### Permission Structure
- Only users with `is_superuser=true` can access `/admin`
- Non-superusers are automatically redirected to `/dashboard`
- All API endpoints require superuser status

### Protection Mechanisms
- **IsSuperUser permission class**: Validates all admin requests
- **Frontend validation**: Checks `is_superuser` before rendering
- **Backend validation**: Validates in every viewset action
- **Database constraints**: `created_by` field protected from deletion

## Best Practices

### When to Use Each Notification Type
- **Information**: Regular updates, feature announcements
- **Maintenance**: Schedule downtime, planned updates
- **Important Update**: Security patches, breaking changes
- **Alert**: Urgent issues, performance problems
- **Warning**: Deprecated features, action needed

### Notification Guidelines
1. Keep titles concise and descriptive
2. Include specific dates/times for maintenance
3. Provide action items or next steps when needed
4. Avoid sending too many notifications (user fatigue)
5. Use appropriate severity level for message type

### Monitoring Best Practices
1. Check stats regularly to identify trends
2. Review user growth metrics weekly
3. Monitor notification delivery success
4. Archive old notifications regularly

## Advanced Usage

### Scheduling Notifications (Future Feature)
Currently all notifications send immediately. Future feature will include scheduling.

```python
# Planned for future release
notification = SystemNotification.objects.create(
    title="Scheduled Update",
    message="...",
    notification_type="maintenance",
    created_by=request.user,
    send_immediately=False,
    scheduled_for="2026-02-25 02:00:00",  # Send at specific time
)
```

### Targeting Specific Users (Future Feature)
Planned enhancement to send notifications to user groups.

```python
# Planned for future release
notification = SystemNotification.objects.create(
    title="Pro Users Feature",
    message="...",
    notification_type="info",
    created_by=request.user,
    target_users=UserProfile.objects.filter(high_match_alerts=True)
)
```

## Support & Documentation

For more detailed documentation, see:
- [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) - Complete feature documentation
- Backend API: `http://localhost:8000/api/admin/notifications/`
- Frontend: `/src/app/pages/AdminDashboard.tsx`

## Files Modified

### Backend
- `core/models.py` - Added `SystemNotification` model
- `core/serializers.py` - Added `SystemNotificationSerializer`
- `core/views.py` - Added `SystemNotificationViewSet` and `IsSuperUser` permission
- `core/urls.py` - Added admin notification routes
- `core/tasks.py` - Added `send_notification_to_users` Celery task
- `core/migrations/0009_system_notification.py` - Database migration

### Frontend
- `src/app/pages/AdminDashboard.tsx` - New admin dashboard component
- `src/app/routes.ts` - Added `/admin` route
- `src/app/components/Sidebar.tsx` - Added admin link for superusers
- `src/lib/api.ts` - Updated `User` interface with `is_superuser`

## Next Steps

1. ✅ Set up superuser account
2. ✅ Start all development servers
3. ✅ Navigate to `/admin`
4. ✅ Create your first system notification
5. ✅ Monitor dashboard statistics
6. 📋 Review notification delivery (check user emails)

Enjoy your new Admin Dashboard! 🚀
