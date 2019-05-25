# For Django and gunicorn

FROM python:3.6-alpine

RUN apk add --no-cache postgresql-libs zlib-dev jpeg-dev
RUN apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev git
RUN git clone https://www.github.com/Mines-Paristech-Students/Portail-des-eleves/ /root/Portail-des-eleves/
RUN pip install pipenv
RUN cd /root/Portail-des-eleves/ && pipenv lock --requirements > requirements.txt && pipenv run pip install -r requirements.txt
RUN cd /root/Portail-des-eleves/ && pipenv run pip install gunicorn
RUN apk --purge del .build-deps