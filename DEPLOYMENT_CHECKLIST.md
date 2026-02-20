# Render Deployment Checklist

## Pre-Deployment Setup

- [ ] Check `requirements.txt` contains:
  - [ ] `celery[redis]>=5.3,<6.0`
  - [ ] `redis>=5.0,<6.0`
  - [ ] `django-celery-beat>=2.5,<3.0`
  - [ ] `gunicorn>=21.0,<22.0`

- [ ] Verify Django settings (in `app/settings.py`):
  - [ ] `INSTALLED_APPS` contains `'django_celery_beat'`
  - [ ] Celery configuration with BROKER_URL and RESULT_BACKEND
  - [ ] CELERY_BEAT_SCHEDULE defined

- [ ] Check project files:
  - [ ] `Procfile` exists at project root
  - [ ] `render.yaml` exists at project root (optional, for auto-deploy)
  - [ ] Both files have correct paths to `BackEnd/app/`

---

## Render Setup

### Redis Database

- [ ] Create Redis instance on Render
  - [ ] Name: `hiresense-redis`
  - [ ] Plan: Free or Starter
  - [ ] Region: Same as Django app
- [ ] Copy **Internal Database URL**
  - Format: `redis://red-xxx:6379/0`

### Django Web Service

- [ ] Create Web Service from GitHub
  - [ ] Build command: `cd BackEnd/app && pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
  - [ ] Start command: `cd BackEnd/app && gunicorn -w 3 -b 0.0.0.0:$PORT app.wsgi:application`
  
- [ ] Set Environment Variables:
  ```
  DEBUG=False
  SECRET_KEY=<your-secret-key>
  ALLOWED_HOSTS=<your-domain>
  DATABASE_URL=<postgresql-url>
  CELERY_BROKER_URL=<redis-internal-url>
  CELERY_RESULT_BACKEND=<redis-internal-url>
  ```

- [ ] Deploy and verify it's running

### Celery Worker Service

- [ ] Create Background Job from same GitHub repo
  - [ ] Build command: `cd BackEnd/app && pip install -r requirements.txt`
  - [ ] Start command: `cd BackEnd/app && celery -A app worker -l info --concurrency=2`
  - [ ] **Scale**: 1-2 instances

- [ ] Set Environment Variables (same as Web service):
  ```
  CELERY_BROKER_URL=<redis-internal-url>
  CELERY_RESULT_BACKEND=<redis-internal-url>
  ```

- [ ] Check logs for message: `celery@<hostname> ready`

### Celery Beat Service

- [ ] Create Background Job from same GitHub repo
  - [ ] Build command: `cd BackEnd/app && pip install -r requirements.txt`
  - [ ] Start command: `cd BackEnd/app && celery -A app beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler`
  - [ ] **Scale**: **EXACTLY 1** (critical - prevents duplicate tasks)

- [ ] Set Environment Variables (same as Web service):
  ```
  CELERY_BROKER_URL=<redis-internal-url>
  CELERY_RESULT_BACKEND=<redis-internal-url>
  ```

- [ ] Check logs for message: `celery beat v5.x.x started`

---

## Post-Deployment Verification

### Verify Services Running

- [ ] Django Web Service
  - [ ] Logs show: "Starting development server at..."
  - [ ] Service has green "Live" status

- [ ] Celery Worker
  - [ ] Logs show: `celery@<hostname> ready`
  - [ ] Shows available tasks (core.tasks.*)

- [ ] Celery Beat
  - [ ] Logs show: `celery beat v5.x.x started`
  - [ ] Shows scheduled tasks being set

### Test Task Execution

Using Django Shell or admin:

- [ ] Manually trigger a task:
  ```python
  from core.tasks import scan_all_job_sites
  result = scan_all_job_sites.delay()
  # Should return a task ID
  ```

- [ ] Check worker logs - task should show execution
- [ ] Verify Redis is connected (check worker logs for connection messages)

### Check Database Migrations

- [ ] Verify `django_celery_beat` tables exist:
  - [ ] `django_celery_beat_periodictask`
  - [ ] `django_celery_beat_schedule`
  - [ ] `django_celery_beat_clockedschedule`

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Monitor service logs for errors
- [ ] Verify tasks are executing on schedule
- [ ] Check Redis connection status

### Redis Monitoring

- [ ] Monitor Redis memory usage (Render dashboard)
- [ ] Check for connection issues
- [ ] Verify internal URL is being used (not external)

### Task Monitoring

- [ ] View executed tasks in Django admin:
  - [ ] `/admin/django_celery_beat/periodictask/`
  - [ ] Filter by execution date to see recent runs

---

## Common Issues & Solutions

### ❌ Worker won't connect to Redis

**Check**:
- [ ] Redis service is running (green status on Render)
- [ ] CELERY_BROKER_URL uses **internal** URL (not external)
- [ ] Environment variables are set on the worker service
- [ ] Redis plan allows connections

**Fix**: Restart services after updating env vars

### ❌ Tasks not executing

**Check**:
- [ ] Beat service status is "Live"
- [ ] Worker service status is "Live"
- [ ] Redis is connected (no connection errors in logs)
- [ ] Tasks exist in `django_celery_beat_periodictask` table

**Fix**: 
1. Check task is registered in `core.tasks`
2. Verify CELERY_BEAT_SCHEDULE is correct
3. Restart beat service

### ❌ Duplicate tasks running

**Check**:
- [ ] Beat service scale is exactly 1 instance

**Fix**: 
- Scale beat service to exactly 1 (critical!)
- Restart beat service

### ❌ Out of memory / high CPU

**Check**:
- [ ] Worker concurrency setting
- [ ] Task complexity
- [ ] Redis memory usage

**Fix**:
- Reduce concurrency: `--concurrency=1`
- Check for infinite loops in tasks
- Upgrade Render plan

---

## Deployment Variations

### Option A: Using render.yaml (Automatic)
- [ ] Push `render.yaml` to repo
- [ ] Create new Web Service on Render
- [ ] All services auto-created

### Option B: Manual with Procfile
- [ ] Create Web Service
- [ ] Create Worker background job
- [ ] Create Beat background job
- [ ] Create Redis database
- [ ] Link all environment variables

---

## Rollback Plan

If deployment fails:

1. [ ] Check service logs for errors
2. [ ] Verify environment variables
3. [ ] Restart services (Render dashboard → Service → Restart)
4. [ ] Check Redis connectivity
5. [ ] Review recent code changes
6. [ ] Roll back commits if needed

---

## Performance Tuning

After initial setup, optimize:

- [ ] Worker concurrency: Start with 2, reduce if OOM
- [ ] Task time limits: Adjust based on actual execution time
- [ ] Worker prefetch: Set `worker_prefetch_multiplier=1` for slow tasks
- [ ] Redis memory policy: Set to `allkeys-lru` for auto cleanup

Example worker command (optimized):
```bash
celery -A app worker -l info --concurrency=1 --prefetch-multiplier=1
```

---

## Success Indicators ✅

You'll know deployment is successful when:

- [ ] All services show "Live" status on Render
- [ ] No connection errors in logs
- [ ] Tasks appear in Beat schedule
- [ ] Tasks execute on schedule (check logs)
- [ ] Django admin shows executed tasks in `/admin/django_celery_beat/periodictask/`
- [ ] Celery task results stored in Redis
- [ ] No duplicate task execution
- [ ] Email/notifications being sent on schedule

---

## Next: Monitor Production

After successful deployment:

1. Monitor logs daily for first week
2. Check task execution reports
3. Monitor Redis memory usage
4. Set up alerts for service failures (if available)
5. Adjust schedules based on needs
