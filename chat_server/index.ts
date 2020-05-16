const express = require("express");
const socketio_jwt = require("socketio-jwt");
import { createServer } from "http";

const dotenv = require("dotenv");
dotenv.config();

const db = require("./db");

class Message {
  constructor(
    public username: string,
    public message: string,
    public posted_on: Date
  ) {
    this.username = username;
    this.message = message;
    this.posted_on = posted_on;
  }
}

/**
 * The JWT authentication is made with https://github.com/auth0-community/auth0-socketio-jwt
 */

const app = express();
let port = process.env.PORT || 3001;

export let httpServer = createServer(app);
export let io = require("socket.io")(httpServer);

// Public key from django
const public_key = process.env.JWT_PUBLIC_KEY;
if (public_key === undefined) {
  throw new Error(
    "Environnement variable JWT_PUBLIC_KEY cannot be empty \n Please check the .env file !"
  );
}

// Authentification using handshake
let jwtOption = {
  secret: process.env.JWT_PUBLIC_KEY, // We use the public key
  handshake: true,
};

// JWT auth middleware
io.use(socketio_jwt.authorize(jwtOption));

// Main Socket
io.sockets.on("connection", (socket) => {
  socket.on("message", async (request: any) => {
    if (request.message === undefined) {
      return;
    }

    if (request.message == "") {
      return;
    }

    let model = new Message(
      socket.decoded_token.username,
      request.message,
      new Date()
    );
    await db.add(model.username, model.message);

    // The message is sended to everyone (including sender)
    io.sockets.emit("broadcast", model);
  });

  socket.on("fetch", async (request: any) => {
    if (request.from === undefined || request.limit === undefined) {
      return;
    }

    let messages = await db.get(request.from, request.limit);
    socket.emit("fetch_response", messages.rows);
  });
});

const server = httpServer.listen(port, () => {
  console.log("listening on port %s", port);
});

// This is done for testing purposes
export var index = {
  server: server,
  app: app,
};
