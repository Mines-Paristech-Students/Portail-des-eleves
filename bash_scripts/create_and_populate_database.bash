# erases the database, creates a new one and loads fixtures in it

python manage.py makemigrations
python manage.py migrate
python manage.py loaddata authentication
