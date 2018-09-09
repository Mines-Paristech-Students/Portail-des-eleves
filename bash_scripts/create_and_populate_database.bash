#!/usr/bin/env bash
# erases the database, creates a new one and loads fixtures in it

rm associations/migrations/*.py
rm authentication/migrations/*.py

python manage.py reset_db --noinput
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata authentication
python manage.py loaddata associations
