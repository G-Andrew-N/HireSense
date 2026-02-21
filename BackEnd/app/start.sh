#!/bin/bash
# Startup script to run both Gunicorn web server and Celery worker in one container
# This allows free hosting on Render by avoiding separate worker services

set -e  # Exit on any error

echo "Starting HireSense services..."

# Start Celery worker in background with output to stdout/stderr
echo "Starting Celery worker..."
celery -A app worker --loglevel=info --pool=solo 2>&1 | sed 's/^/[CELERY-WORKER] /' &
WORKER_PID=$!

# Start Celery beat (scheduler) in background with output to stdout/stderr
echo "Starting Celery beat..."
celery -A app beat --loglevel=info 2>&1 | sed 's/^/[CELERY-BEAT] /' &
BEAT_PID=$!

# Give workers a moment to initialize
sleep 3

# Check if workers are still running
if ! kill -0 $WORKER_PID 2>/dev/null; then
    echo "ERROR: Celery worker failed to start or crashed immediately"
    exit 1
fi

if ! kill -0 $BEAT_PID 2>/dev/null; then
    echo "WARNING: Celery beat failed to start or crashed (non-fatal)"
fi

echo "Celery worker PID: $WORKER_PID"
echo "Celery beat PID: $BEAT_PID"

# Start Gunicorn web server in foreground
# WEB_CONCURRENCY defaults to 1 for low memory environments
echo "Starting Gunicorn web server..."
exec gunicorn app.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WEB_CONCURRENCY:-1} \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
