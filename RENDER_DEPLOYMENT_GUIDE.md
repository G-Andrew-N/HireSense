# Deploying Celery & Celery Beat on Render

## Quick Setup (Using render.yaml)

### 1. Set Up Redis Database
1. Go to [render.com](https://render.com) Dashboard
2. Click **"Create"** → **"Redis"**
3. Configure:
   - **Name**: `hiresense-redis`
   - **Region**: Same as Django app
   - **Plan**: Free or Starter
4. Copy the **Internal Database URL** from the dashboard

### 2. Deploy Django App
1. Push the `render.yaml` to your repo
2. Go to **Dashboard** → **New** → **Web Service**
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml` and create all services

### 3. Set Environment Variables
In Render Dashboard, go to your web service **Settings** → **Environment**:

```
CELERY_BROKER_URL=redis://red-xxx:6379/0
CELERY_RESULT_BACKEND=redis://red-xxx:6379/0
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://...
```

Replace `red-xxx` with your Redis instance identifier.

---

## Manual Setup (Using Procfile)

### 1. Create Web Service
- Go to **Dashboard** → **New** → **Web Service**
- Connect GitHub repo
- Set build command: `cd BackEnd/app && pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
- Set start command: `cd BackEnd/app && gunicorn -w 3 -b 0.0.0.0:$PORT app.wsgi:application`

### 2. Create Celery Worker Service
- Go to **Dashboard** → **New** → **Background Job**
- Connect same GitHub repo
- Set build command: `cd BackEnd/app && pip install -r requirements.txt`
- Set start command: `cd BackEnd/app && celery -A app worker -l info --concurrency=2`
- Scale: **Scaling** → Set to 1-2 instances

### 3. Create Celery Beat Service
- Go to **Dashboard** → **New** → **Background Job**
- Connect same GitHub repo
- Set build command: `cd BackEnd/app && pip install -r requirements.txt`
- Set start command: `cd BackEnd/app && celery -A app beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler`
- Scale: Set to exactly 1 instance (important to avoid duplicate tasks!)

### 4. Create Redis Database
- Go to **Dashboard** → **New** → **Redis**
- Configure as described above

### 5. Link Redis to Services
For each service (Web, Worker, Beat):
- **Settings** → **Environment** → Add:
  - `CELERY_BROKER_URL` = Redis internal URL
  - `CELERY_RESULT_BACKEND` = Redis internal URL

---

## Important Configuration Notes

### Beat Scheduler Settings
```python
# Two options for Celery Beat scheduler:

# Option 1: Database Scheduler (Recommended for Render)
# Uses Django's database to store schedule
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# Option 2: Memory Scheduler (Default)
# Uses local file (celerybeat-schedule)
# Note: File-based schedule may not persist across restarts on Render
```

### Ensure Only 1 Beat Instance
- **CRITICAL**: Run only ONE Celery Beat instance
- Multiple instances will cause duplicate tasks
- In Render, scale Beat service to exactly 1

### Worker Concurrency for Free Tier
```bash
# Free tier has limited resources
celery -A app worker -l info --concurrency=2

# If experiencing OOM errors, reduce to 1:
celery -A app worker -l info --concurrency=1
```

---

## Testing on Render

### 1. Verify Services Are Running
```bash
# Check Render logs for each service
# Worker logs should show: "celery@render ready"
# Beat logs should show: "celery beat v5.x.x started"
```

### 2. Test Task Execution
```python
# SSH into Django instance or use shell management command
from core.tasks import scan_all_job_sites
result = scan_all_job_sites.delay()
print(result.status)  # Should be 'PENDING' or 'SUCCESS'
```

### 3. Monitor Task Status
- Go to Django admin: `/admin/django_celery_beat/periodictask/`
- View scheduled tasks and their execution history
- Check **PeriodicTask** model for task execution logs

---

## Monitoring & Debugging

### View Logs
1. Render Dashboard → Each service → **Logs**
2. Look for errors like:
   - "Unable to locate celery"
   - "Connection refused" (check Redis URL)
   - "Task not found" (verify CELERY_APP setting)

### Common Issues

**Issue**: "Connection refused" when connecting to Redis
- **Fix**: Verify internal Redis URL is correct (not external URL)
- Check environment variables are set on the service

**Issue**: Tasks not executing on schedule
- **Fix**: Ensure Beat service is running (scale = 1)
- Check `django_celery_beat_periodictask` table for schedule

**Issue**: Duplicate task execution
- **Fix**: Scale Beat service to exactly 1 instance
- Don't run multiple Beat instances

**Issue**: Out of memory errors
- **Fix**: Reduce worker concurrency: `--concurrency=1`
- Increase Render service plan

---

## Task Schedule Reference

Current configured tasks in `settings.py`:

| Task | Schedule | Purpose |
|------|----------|---------|
| `scan_all_job_sites` | Hourly (0 min) | Fetch job postings |
| `analyze_new_jobs_for_all_users` | Every 30 min | Analyze new jobs |
| `run_match_analysis_for_all_users` | Daily 2 AM UTC | Run matching algorithm |
| `send_daily_match_notifications` | Daily 8 AM UTC | Email daily matches |
| `send_weekly_reports` | Monday 9 AM UTC | Send weekly reports |

### Adjust Schedules
Edit the `CELERY_BEAT_SCHEDULE` in [app/settings.py](app/settings.py)

```python
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'task-name': {
        'task': 'core.tasks.task_function',
        'schedule': crontab(hour=2, minute=0),  # 2 AM UTC daily
    },
}
```

---

## Celery Beat Scheduler Options

### Option 1: Database Scheduler (Recommended)
```python
# settings.py
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

# Advantages:
# - Persists across restarts
# - Can manage schedules from Django admin
# - Scales better with Render
```

### Option 2: Default Memory Scheduler
```bash
# Just use: celery -A app beat -l info
# (without --scheduler flag)

# Advantages:
# - Simpler, no database queries
# Disadvantages:
# - Schedule stored in local file (celerybeat-schedule)
# - May not persist on Render's ephemeral disk
```

---

## Production Best Practices

1. **Separate Worker Instances**: Deploy worker and beat as separate services
2. **Monitor Redis**: Keep Redis instance monitoring enabled
3. **Log Rotation**: Render handles logs automatically
4. **Resource Limits**: Set appropriate CPU and memory for services
5. **Error Handling**: All tasks should have exception handling
6. **Timeouts**: Set reasonable task timeouts (currently 30 min hard limit)

---

## Next Steps

1. ✅ Create `render.yaml` or `Procfile` (done)
2. ✅ Configure Celery in Django settings (done)
3. 📍 Set up Redis on Render
4. 📍 Set environment variables
5. 📍 Deploy to Render
6. 📍 Monitor initial execution
7. 📍 Adjust schedules as needed
