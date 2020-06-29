#!/bin/bash
set -e

# Chat database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER docker WITH SUPERUSER PASSWORD 'docker';
    CREATE DATABASE portail_message;
    GRANT ALL PRIVILEGES ON DATABASE portail_message TO docker;
EOSQL

# Server database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER root WITH PASSWORD 'password';
    CREATE DATABASE portail OWNER root;
    ALTER USER root WITH SUPERUSER;
EOSQL