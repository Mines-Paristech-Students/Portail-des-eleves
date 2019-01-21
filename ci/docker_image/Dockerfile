# This Docker image is used in the gitlab CI
# The same image is used for all tests, later we want to separate
# frontend from backend and not install everything as it is
# done here

FROM python:3.6-alpine
RUN echo http://dl-cdn.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories && \
    apk add --no-cache moreutils git py-pip build-base libffi-dev postgresql-dev rsync openssh-client nodejs nodejs-npm zlib-dev jpeg-dev
RUN wget https://raw.githubusercontent.com/Mines-Paristech-Students/Portail-des-eleves/master/Pipfile -O /root/Pipfile && \
    pip install pipenv
RUN cd /root/ && pipenv lock --requirements > requirements.txt && pip install -r requirements.txt
