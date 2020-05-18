#!/usr/bin/env bash
# erases the database, creates a new one and loads fixtures in it

cd ../backend

rm -Rf  authentication/migrations/*
rm -Rf  associations/migrations/*
rm -Rf  polls/migrations/*
rm -Rf  profile/migrations/*
rm -Rf  repartitions/migrations/*
rm -Rf  subscriptions/migrations/*
rm -Rf  tags/migrations/*

python manage.py reset_db --noinput

python manage.py makemigrations authentication
python manage.py makemigrations associations
python manage.py makemigrations polls
python manage.py makemigrations repartitions
python manage.py makemigrations subscriptions
python manage.py makemigrations tags

python manage.py migrate

python manage.py loaddata authentication profile
python manage.py loaddata association election event library marketplace media page role
python manage.py loaddata polls
python manage.py loaddata repartitions
python manage.py loaddata subscriptions
python manage.py loaddata tags
