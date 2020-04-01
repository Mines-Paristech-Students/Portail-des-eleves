const io = require("socket.io-client")
const jwt = require('jsonwebtoken');

const profile = {
  username: '17doe',
  email: 'john@doe.com',
  id: 123
};

const token = jwt.sign(
  profile,
  'licorne',
);

const socket_options = {
  url: 'http://localhost:3001',
  options: {
    forceNew: true,
    query: 'token='+ token,
  }
};

const socket = io.connect(socket_options.url, socket_options.options);