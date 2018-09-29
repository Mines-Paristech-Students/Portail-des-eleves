#!/bin/bash
# Run on the host directly, install migrations and restart gunicorn
export PATH=/home/portail/bin:/home/portail/.local/bin:$PATH
cd ~/src/
pipenv run python manage.py makemigrations
pipenv run python manage.py migrate
sudo systemctl restart gunicorn
