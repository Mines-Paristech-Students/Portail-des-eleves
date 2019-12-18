'use strict'

import express from "express";
import { createServer } from 'http';
const socketio_jwt = require('socketio-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


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
    const profile = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        id: 123
    };

    // We are sending the profile inside the token
    const token = jwt.sign(profile, options.secret, { expiresIn: 60 * 60 * 5 });
    res.json({ token: token });
});

// Using handshake
io.use(socketio_jwt.authorize(options));

io.sockets.on('echo', (m) => {
    io.sockets.emit('echo-response', m);
});

export let server = httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});
