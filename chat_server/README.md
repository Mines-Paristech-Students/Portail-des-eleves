# Chat server

This project was built arround two containers (yet only used for testing) :
* A "web-container" with node.js and typescript
* A "database-container" for postgress. It is used to store the table that imitates the one used in deployement.

## Openning the project

You can run the project in two ways :
1. Using the tools provided by VsCode (Remote containers)
2. Using Linux and docker

### Building the container 

```bash
# First cmd window
cd .devcontainer
docker-compose up
```

### Running the tests

```bash
docker exec -it devcontainer_web_1 /bin/bash
cd workspace
npm test
```
