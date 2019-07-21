#!/usr/bin/env bash
# erases the database, creates a new one and loads fixtures in it

rm -Rf associations/migrations/*
rm -Rf authentication/migrations/*
rm -Rf chat/migrations/*
rm -Rf forum/migrations/*
rm -Rf polls/migrations/*
rm -Rf repartitions/migrations/*
rm -Rf subscriptions/migrations/*


python manage.py reset_db --noinput

python manage.py makemigrations associations
python manage.py makemigrations authentication
python manage.py makemigrations chat
python manage.py makemigrations forum
python manage.py makemigrations polls
python manage.py makemigrations repartitions
python manage.py makemigrations subscriptions

python manage.py migrate

python manage.py loaddata authentication
python manage.py loaddata associations
python manage.py loaddata chat
python manage.py loaddata forum
python manage.py loaddata polls
python manage.py loaddata repartitions
python manage.py loaddata subscriptions
