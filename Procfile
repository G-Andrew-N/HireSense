web: cd BackEnd/app && gunicorn -w 3 -b 0.0.0.0:$PORT app.wsgi:application
worker: cd BackEnd/app && celery -A app worker -l info --concurrency=2
beat: cd BackEnd/app && celery -A app beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
