# 🛡️ HireSense Admin Dashboard - Quick Reference

## ⚡ Quick Start

### Prerequisites
- Superuser account created
- Django & Celery running
- Frontend development server running

### Access the Dashboard
```
Navigate to: http://localhost:5173/admin
Or click "Admin Dashboard" in sidebar (superusers only)
```

## 📊 Dashboard Features

### Real-Time Statistics
- **Total Users**: All registered accounts
- **Active Users (7d)**: Users logged in last week
- **New Users (30d)**: Recent signups
- **Job Matches**: Total opportunities matched
- **Notifications**: Sent and pending counts
- **System Status**: Live health indicator

### Send Notifications
1. Click **"New Notification"**
2. Fill in the form:
   - **Title**: Subject line
   - **Type**: Select category
   - **Message**: Your announcement
3. Click **"Send to All Users"**
4. Email sent to all active users

### Notification Types
| Type | Purpose | Color |
|------|---------|-------|
| Info | General announcements | 🔵 Blue |
| Maintenance | Scheduled downtime | 🔴 Red |
| Important | Critical updates | 🟠 Orange |
| Alert | Urgent notices | 🟡 Yellow |
| Warning | Caution messages | 🟣 Purple |

## 🔐 Security

- **Access**: Superusers only
- **Protection**: Automatic redirect for non-admins
- **Permissions**: Enforced on all API endpoints
- **Audit Trail**: All actions tracked by creator

## 📧 Email Format

Notifications automatically format as professional HTML:
- Colored headers by type
- Clean readable layout
- Dashboard links
- Settings adjustment options

## 🚀 Common Tasks

### Check System Health
```
Admin Dashboard > Statistics Panel
Auto-updates every 30 seconds
```

### Send Maintenance Notice
```
Type: Maintenance
Title: "Scheduled Maintenance"
Message: "System down 2-4 AM EST on [date]"
```

### Send Critical Alert
```
Type: Important
Title: "Security Update Required"
Message: "Please change your password..."
```

### Monitor Notifications
```
Scroll to "Notification History"
See all sent/pending notifications with timestamps
```

## 🔧 Troubleshooting

### Can't Access Admin?
- ✅ Verify superuser status: `python manage.py shell` > `User.objects.get(id=X).is_superuser`
- ✅ Check authentication token
- ✅ Try logging out and back in

### Notifications Not Sending?
- ✅ Verify Celery worker is running
- ✅ Check Django email configuration
- ✅ Review Celery logs for errors

### Stats Not Updating?
- ✅ Refresh page (auto-refresh every 30 seconds)
- ✅ Check browser console (F12) for errors
- ✅ Verify API connection

## 📚 Documentation

- **[ADMIN_IMPLEMENTATION_SUMMARY.md](./ADMIN_IMPLEMENTATION_SUMMARY.md)** - What was built
- **[ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md)** - How to set it up
- **[ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md)** - Complete reference
- **[ADMIN_TESTING.md](./ADMIN_TESTING.md)** - Testing guide

## 🧪 Test It Out

```bash
# Backend: Verify superuser access
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> User.objects.filter(is_superuser=True).count()
1  # Should show at least 1

# Frontend: Test permissions
# 1. Login as regular user → Try /admin → Redirected to /dashboard ✓
# 2. Login as superuser → Go to /admin → Dashboard loads ✓
```

## 📞 API Endpoints

All require superuser authentication:

```
GET    /api/admin/notifications/               - List notifications
POST   /api/admin/notifications/               - Create notification
POST   /api/admin/notifications/send_notification/ - Send notification
GET    /api/admin/notifications/admin_stats/   - Get statistics
```

## 🎨 Features at a Glance

✅ Real-time system monitoring  
✅ Beautiful responsive dashboard  
✅ Professional HTML email notifications  
✅ Superuser-only access control  
✅ 5 notification type categories  
✅ Notification history tracking  
✅ Auto-refreshing statistics  
✅ Dark mode support  
✅ Async email delivery (Celery)  
✅ Comprehensive error handling  

## 📱 Mobile Friendly

Dashboard is fully responsive:
- Mobile-optimized layout
- Touch-friendly buttons
- Readable on all screen sizes
- Dark mode for night viewing

## ⏰ Auto-Refresh

Dashboard statistics auto-refresh every 30 seconds:
- No manual refresh needed
- Real-time data updates
- Smooth animations

## 🔄 Workflow Example

```
1. Login as superuser
2. Navigate to /admin
3. Check statistics panel
   ↓
4. Review pending notifications
   ↓
5. Create new notification:
   - "System will be down for maintenance tonight 2-4 AM EST"
   - Type: Maintenance
   ↓
6. Click "Send to All Users"
   ↓
7. Users receive formatted email
   ↓
8. Notification appears in history
   ↓
9. Monitor stats for user engagement
```

## 💡 Tips & Best Practices

### When to Use Each Type
- **Info**: Features, announcements, tips
- **Maintenance**: Scheduled downtime, updates
- **Important**: Security, breaking changes
- **Alert**: Urgent issues, outages
- **Warning**: Deprecated features, cautions

### Writing Notifications
- Keep titles short and clear
- Include specific dates/times for maintenance
- Provide next steps or action items
- Avoid unnecessary notifications (user fatigue)
- Use appropriate severity level

### Monitoring
- Check stats daily for trends
- Review user growth metrics weekly
- Monitor notification delivery success
- Archive old notifications regularly

## 🚀 What's Next?

Future enhancements planned:
- Schedule notifications for specific times
- Target notifications to user groups
- Track notification read rates
- Save notification templates
- Multi-language support
- User subscription preferences

## 📋 Files & Locations

**Backend**:
- Model: `core/models.py` (SystemNotification)
- API: `core/views.py` (SystemNotificationViewSet)
- Tasks: `core/tasks.py` (send_notification_to_users)
- Routes: `core/urls.py`

**Frontend**:
- Dashboard: `src/app/pages/AdminDashboard.tsx`
- Routes: `src/app/routes.ts`
- Sidebar: `src/app/components/Sidebar.tsx`

**Database**:
- Migration: `core/migrations/0009_system_notification.py`

---

**Status**: ✅ Ready to Use  
**Access Level**: Superusers Only  
**Main URL**: `/admin`  

For detailed documentation, see the markdown files above! 🎉
