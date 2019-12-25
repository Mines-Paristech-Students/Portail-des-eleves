docker build -f database.Dockerfile -t test_database:latest .

docker run --rm -P -p 127.0.0.1:5432:5432 -e POSTGRES_PASSWORD="1234" --name pg test_database