#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER docker WITH SUPERUSER PASSWORD 'docker';
    CREATE DATABASE portail_message;
    GRANT ALL PRIVILEGES ON DATABASE portail_message TO docker;
EOSQL