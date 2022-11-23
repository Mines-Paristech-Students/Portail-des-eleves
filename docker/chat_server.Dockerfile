FROM node:latest

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY chat_server .

RUN npm install --silent

CMD ["npm", "start"]