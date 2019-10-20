rmdir /S /Q associations\migrations
rmdir /S /Q authentication\migrations
rmdir /S /Q chat\migrations
rmdir /S /Q forum\migrations
rmdir /S /Q polls\migrations
rmdir /S /Q repartitions\migrations
rmdir /S /Q subscriptions\migrations
rmdir /S /Q tags\migrations\


python manage.py reset_db --noinput

python manage.py makemigrations associations
python manage.py makemigrations authentication
python manage.py makemigrations chat
python manage.py makemigrations forum
python manage.py makemigrations polls
python manage.py makemigrations repartitions
python manage.py makemigrations subscriptions
python manage.py makemigrations tags

python manage.py migrate

python manage.py loaddata authentication
python manage.py loaddata associations
python manage.py loaddata messages
python manage.py loaddata forum
python manage.py loaddata polls
python manage.py loaddata repartitions
python manage.py loaddata subscriptions
python manage.py loaddata profile
