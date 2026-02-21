#!/bin/bash
# Startup script to run both Gunicorn web server and Celery worker in one container
# This allows free hosting on Render by avoiding separate worker services

echo "Starting HireSense services..."

# Start Celery worker in background
echo "Starting Celery worker..."
celery -A app worker --loglevel=info --pool=solo &

# Start Celery beat (scheduler) in background
echo "Starting Celery beat..."
celery -A app beat --loglevel=info &

# Give workers a moment to initialize
sleep 3

# Start Gunicorn web server in foreground
# WEB_CONCURRENCY defaults to 1 for low memory environments
echo "Starting Gunicorn web server..."
exec gunicorn app.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WEB_CONCURRENCY:-1} \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
