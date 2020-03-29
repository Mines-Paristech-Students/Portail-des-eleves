#!/usr/bin/env bash
# erases the database, creates a new one and loads fixtures in it

cd ../backend

rm -Rf associations/migrations/*
rm -Rf authentication/migrations/*
rm -Rf chat/migrations/*
rm -Rf polls/migrations/*
rm -Rf repartitions/migrations/*
rm -Rf subscriptions/migrations/*
rm -Rf tags/migrations/*


python3 manage.py reset_db --noinput

python3 manage.py makemigrations associations
python3 manage.py makemigrations authentication
python3 manage.py makemigrations chat
python3 manage.py makemigrations polls
python3 manage.py makemigrations repartitions
python3 manage.py makemigrations subscriptions
python3 manage.py makemigrations tags

python3 manage.py migrate

python3 manage.py loaddata authentication
python3 manage.py loaddata associations
python3 manage.py loaddata messages
python3 manage.py loaddata polls
python3 manage.py loaddata profile
python3 manage.py loaddata repartitions
python3 manage.py loaddata subscriptions
python3 manage.py loaddata tags
