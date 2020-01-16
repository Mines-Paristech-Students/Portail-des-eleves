# Chat server

This project was built arround two containers (yet only used for testing) :
* A "web-container" with node.js and typescript
* A "database-container" for postgress. It is used to store the table that imitates the one used in deployement.

## Openning the project

1. If you are working with visual studio code, then simply open the folder into a remote container (see module), and choose the docker-compose.yml as config file.
2. If you don't have visual studio code, you will need to do it manually! Don't worry, it's not time expensive. Simply run the following commands :

```bash
# First cmd window
cd .devcontainer
docker-compose up
# Second cmd windows
docker exec -it devcontainer_web_1 /bin/bash
cd workspace
npm test
```

# Testing

Just run the following command in visual studio / container terminal :
```bash
npm test
```