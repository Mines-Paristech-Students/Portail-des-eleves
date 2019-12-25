'use strict'

import express, { request } from "express";
import { createServer } from 'http';

const socketio_jwt = require('socketio-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

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

var options = {
    secret: 'aaafoo',
    timeout: 1000,
    handshake: true
};

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    // TODO
    // Use this function to see if the user exists on the database and send the creditentials 
    const profile = {
        username: '17doe',
        last_name: 'Doe',
        email: 'john@doe.com',
        id: 123
    };

    // We are sending the profile inside the token
    const token = jwt.sign(profile, options.secret, { expiresIn: 60 * 60 * 5 });
    res.json({ token: token });
});

// Middleware that resplaces the old "authentificated" API
io.use(socketio_jwt.authorize(options));

io.sockets
.on('connection', (socket) => {

    socket.on('message', async function(request: any) {
      if(request.message === undefined) {
          return;
      }

    // FIXME : do we really want the time to be based on the server
      let message = new Message(socket.decoded_token.username, request.message, new Date());
      
      // TODO send to the database
      // socket.broadcast.emit (excludes the sender)

      io.sockets.emit('broadcast', {message: message});
    })
    .on('fetch', async function(request: any){
    });

});


io.sockets.on('echo', (m) => {
    io.sockets.emit('echo-response', m);
});

export let server = httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});
