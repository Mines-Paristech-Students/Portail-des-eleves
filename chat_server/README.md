# Chat server

This is the chat service of the "portail". Here are some important points about it :
1. It runs on the main database as the backend
2. The authentification is done using jwt. The public key will be shared by both the backend and the chat server, but the only way to get it will be through an API request to the backend.

## Setting up the project

### Building the project locally

There are two steps you will need to do :
1. Copy the environnement variables ;
2. Create the database (on the same postgres instance as the backend).

```bash
sudo -i -u postgres
psql
CREATE DATABASE portail_message OWNER root
```

### Building the container 

Another way to use the project is with containers. If you are using vscode, I would recommand checking the "Remote container" extension, but you can still run :

```bash
# First cmd window
cd .devcontainer
docker-compose up
```

If you look at the yml file, you will see that the main components are :
* A "web-container" with node.js and typescript
* A "database-container" for postgress. It is used to store the table that imitates the one used in deployement.

### Running the tests

If you are using containers, you first need to go "into" the container using :
```bash
docker exec -it devcontainer_web_1 /bin/bash
cd workspace
```
```bash 
npm test
```
