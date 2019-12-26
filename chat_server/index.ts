const express = require("express");
const socketio_jwt = require('socketio-jwt');
import { createServer} from 'http';

const db = require('./db/db');

import jwt_option from './jwt_option';


class Message {
	constructor(public username: string, public message: string, public posted_on: Date){
        this.username = username;
        this.message = message;
        this.posted_on = posted_on;
    }
}

/**
 * The JWT authentication is made with https://github.com/auth0-community/auth0-socketio-jwt
 */

const app = express();
app.set("port", process.env.PORT || 3000);

export let httpServer = createServer(app);
export let io = require('socket.io')(httpServer);

// Authentification using handshake
io.use(socketio_jwt.authorize(jwt_option));

io.sockets
.on('connection', (socket) => {

	socket.on("message", async (request: any) => {
		if (request.message === undefined ){
			return
		}

		let model = new Message(socket.decoded_token.username, request.message, new Date());
		await db.add(model.username, model.message);

		// The message is sended to everyone (including sender)
		io.sockets.emit('broadcast', model);
	});

	socket.on("fetch", async (request: any) => {
		if (request.from === undefined || request.limit === undefined){
			return
		}

		let messages = await db.get(request.from, request.limit);
		socket.emit("fetch_response", messages.rows);
	});

});

const server = httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});


// This is done for testing purposes
module.exports = {
	server: server,
	app : app
}