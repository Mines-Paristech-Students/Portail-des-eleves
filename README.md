# Portail-des-eleves

# How to install everything ?

These explanations are made for Ubuntu users

## Clone the repository

Make sure you have git installed (by running the command *git --version*). If not, *apt-get install git*.
Then create a folder and run the command *git clone https://github.com/Mines-Paristech-Students/Portail-des-eleves.git*

## Python

You need to have the 3.6 version of Python. You can check with *python --version* or *python3 --version*.
If it is not a 3.6.x version, follow the instructions of the first answer [here](https://askubuntu.com/questions/865554/how-do-i-install-python-3-6-using-apt-get)

## Pipenv

Pipenv's goal is for you to have the right packages for the project.
You can install it by doing *pip install pipenv*.
Then in the project's directory, run *pipenv install*, and let it install everything.

## Postgresql

We use Postgresql for our database. You need to install the *postgresql* package first (*apt-get install postgresql*).
Then you need to install the server. Choose another repository and run *wget https://get.enterprisedb.com/postgresql/postgresql-9.6.9-1-linux-x64.run* (for a 64-bit computer).
You need to execute this file by doing *sudo chmod +x postgresql-9.6.9-1-linux-x64.run* and *sudo ./postgresql-9.6.9-1-linux-x64.run*.
Follow the instruction for the setup.
Start the server with *pg_ctlcluster 9.6 main start*
Then switch to the postgres account with *sudo -i -u postgres* and launch *psql*.
There you need to create an user and the project data base :
*CREATE USER root; ALTER ROLE root WITH CREATEDB; CREATE DATABASE portail OWNER root;
ALTER USER root WITH ENCRYPTED PASSWORD 'password';*
Then you can exit with *\q* and live postgres account with *exit*.

## Create the tables
In the project's directory, run *pipenv run python manage.py migrate*

## Create an user for you
Run *pipenv run python manage.py createsuperuser --pseudo xxx*, then write your email adress, name, date of birth and password.

## Install Node.js and Angular
*curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs*
Then check the version with *node -v* (8.X or greater) and *npm -v* (5.x or greater).
Go in the "frontend" directory and run *npm install*

## Launch the backend
*pipenv run python manage.py runserver*
You can check this adress : 127.0.0.1:8000

## Launch the frontend
In the frontend folder : *ng serve*
Visit : 127.0.0.1:4200 to go on the site. You can log in with the login created just before.