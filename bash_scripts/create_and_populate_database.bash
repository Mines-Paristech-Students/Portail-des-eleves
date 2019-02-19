#!/usr/bin/env bash
# erases the database, creates a new one and loads fixtures in it

rm associations/migrations/*.py
rm authentication/migrations/*.py
rm chat/migrations/*.py
rm forum/migrations/*.py
rm polls/migrations/*.py
rm subscriptions/migrations/*.py

python manage.py reset_db --noinput
python manage.py makemigrations associations
python manage.py makemigrations authentication
python manage.py makemigrations chat
python manage.py makemigrations forum
python manage.py makemigrations polls
python manage.py makemigrations subscriptions
python manage.py migrate
python manage.py loaddata authentication
python manage.py loaddata associations
python manage.py loaddata forum
