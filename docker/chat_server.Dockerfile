FROM node:latest

WORKDIR /workspace
COPY . /workspace/
RUN npm install

CMD ["npm", "start"]