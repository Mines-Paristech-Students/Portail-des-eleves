#!/usr/bin/env bash
# erases the database, creates a new one and loads fixtures in it

cd ../backend

<<<<<<< HEAD
rm -Rf associations/migrations/*
rm -Rf authentication/migrations/*
rm -Rf chat/migrations/*
rm -Rf polls/migrations/*
rm -Rf repartitions/migrations/*
rm -Rf subscriptions/migrations/*
rm -Rf tags/migrations/*
rm -Rf courses/migrations/*

=======
rm -Rf  authentication/migrations/*
rm -Rf  associations/migrations/*
rm -Rf  polls/migrations/*
rm -Rf  profile/migrations/*
rm -Rf  repartitions/migrations/*
rm -Rf  subscriptions/migrations/*
rm -Rf  tags/migrations/*
>>>>>>> master

python3 manage.py reset_db --noinput

<<<<<<< HEAD
python3 manage.py makemigrations associations
python3 manage.py makemigrations authentication
python3 manage.py makemigrations chat
python3 manage.py makemigrations polls
python3 manage.py makemigrations repartitions
python3 manage.py makemigrations subscriptions
python3 manage.py makemigrations tags
python3 manage.py makemigrations courses 
=======
python manage.py makemigrations authentication
python manage.py makemigrations associations
python manage.py makemigrations polls
python manage.py makemigrations repartitions
python manage.py makemigrations subscriptions
python manage.py makemigrations tags
>>>>>>> master

python3 manage.py migrate

<<<<<<< HEAD
python3 manage.py loaddata authentication
python3 manage.py loaddata associations
python3 manage.py loaddata messages
python3 manage.py loaddata polls
python3 manage.py loaddata profile
python3 manage.py loaddata repartitions
python3 manage.py loaddata subscriptions
python3 manage.py loaddata tags
python3 manage.py loaddata courses
=======
python manage.py loaddata authentication profile
python manage.py loaddata association election event library marketplace media page role
python manage.py loaddata polls
python manage.py loaddata repartitions
python manage.py loaddata subscriptions
python manage.py loaddata tags
>>>>>>> master
