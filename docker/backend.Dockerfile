FROM ubuntu:18.04

RUN apt-get update
RUN apt-get -y install python3-dev build-essential

WORKDIR /workspace/

COPY backend/ .

RUN apt-get -y install python3-pip

RUN pip3 install -r requirements.txt

COPY cli/create_and_populate_database.bash .

RUN cp backend/.env.dist backend/.env

ENTRYPOINT ["./create_and_populate_database.bash"]

CMD ["python3 manage.py runsever"]