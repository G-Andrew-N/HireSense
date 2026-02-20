#!/usr/bin/env python
import os
import sys
import django

# Set up Django
sys.path.insert(0, '/home/andrew/HireSense/BackEnd/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from core.models import SystemNotification, UserNotification
from django.contrib.auth.models import User

print('=== System Notifications ===')
sys_notifs = SystemNotification.objects.all()
print(f'Total: {sys_notifs.count()}')
for n in sys_notifs:
    print(f'ID: {n.id}, Title: {n.title}, Is Sent: {n.is_sent}, Created: {n.created_at}')
    print(f'  -> User receipts: {n.user_receipts.count()}')

print('\n=== User Notifications ===')
user_notifs = UserNotification.objects.all()
print(f'Total: {user_notifs.count()}')
for u in user_notifs[:20]:
    print(f'ID: {u.id}, User: {u.user.email}, Notif: {u.notification.id}, Is Read: {u.is_read}, Created: {u.created_at}')

print('\n=== Active Users ===')
users = User.objects.filter(is_active=True)
print(f'Total Active Users: {users.count()}')
for u in users:
    user_notif_count = UserNotification.objects.filter(user=u).count()
    print(f'- {u.email} (superuser: {u.is_superuser}, notifications: {user_notif_count})')
