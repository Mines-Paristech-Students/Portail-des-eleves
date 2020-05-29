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

python3 manage.py reset_db --noinput

python3 manage.py makemigrations authentication
python3 manage.py makemigrations associations
python3 manage.py makemigrations polls
python3 manage.py makemigrations repartitions
python3 manage.py makemigrations subscriptions
python3 manage.py makemigrations tags

python3 manage.py migrate

python3 manage.py loaddata authentication profile
python3 manage.py loaddata association election event library marketplace media page role
python3 manage.py loaddata polls
python3 manage.py loaddata repartitions
python3 manage.py loaddata subscriptions
python3 manage.py loaddata tags
