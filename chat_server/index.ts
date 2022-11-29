const express = require("express");
const socketio_jwt = require("socketio-jwt");
import { createServer } from "http";

import { Message } from "./message";

const dotenv = require("dotenv");
dotenv.config();
const db = require("./db");

const app = express();
const port = process.env.PORT || 3001;

export const httpServer = createServer(app);
export const io = require("socket.io")(httpServer, {
  cors: {
    origin: process.env.FRONTEND_BASE_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

/**
 * The JWT authentication is made with https://github.com/auth0-community/auth0-socketio-jwt
 *
 * The public key is taken from the SSO server
 */
const public_key = process.env.JWT_PUBLIC_KEY;
if (public_key === undefined) {
  throw new Error(
    "Environnement variable JWT_PUBLIC_KEY cannot be empty \n Please check the .env file !"
  );
}

// Authentification using handshake
const jwtOption = {
  secret: process.env.JWT_PUBLIC_KEY,
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

    const message: Message = {
      username: String(socket.decoded_token.user),
      message: String(request.message),
      posted_on: new Date(),
    };

    await db.add(message);

    // The message is sended to everyone (including sender)
    io.sockets.emit("broadcast", {
      username: message.username,
      message: message.message,
      posted_on: message.posted_on.toISOString(),
    });
  });

  socket.on("fetch", async (request: any) => {
    if (request.from === undefined || request.limit === undefined) {
      return;
    }

    const response = await db.get(request.from, request.limit);

    socket.emit("fetch_response", response.rows);
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
