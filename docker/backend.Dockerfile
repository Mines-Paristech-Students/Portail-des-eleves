FROM python:3.7
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y poppler-utils

WORKDIR /app

COPY backend backend

RUN pip install --upgrade pip>=21.2.4

RUN pip install -r backend/requirements.txt 

COPY cli cli

RUN chmod +x ./cli/create_and_populate_database.bash

EXPOSE 8000

CMD ./cli/create_and_populate_database.bash ; python ./backend/manage.py runserver 0.0.0.0:8000