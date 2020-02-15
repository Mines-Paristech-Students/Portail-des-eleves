FROM postgres:latest

COPY init-user-db.sh /usr/local/bin
RUN ln -s /usr/local/bin/init-user-db.sh /docker-entrypoint-initdb.d/init-user-db.sh
CMD ["postgres"]