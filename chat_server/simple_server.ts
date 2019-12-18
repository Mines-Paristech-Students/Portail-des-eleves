import express from "express";
import { createServer} from 'http';

const app = express();
app.set("port", process.env.PORT || 3000);

export let httpServer = createServer(app);
export let io = require('socket.io')(httpServer);

io
.sockets.on('connection', function(socket){
    console.log('a user connected');

    socket.on('message', function(message) {
        console.log(message);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

export let server = httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
