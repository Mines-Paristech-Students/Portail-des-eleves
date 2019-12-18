/**
 * Things that should be checked
 * 1. Can connect
 * 2. Can post things
 * 3. Recup le bon offset
 * Cannot read/write without the token
 */

var io = require('socket.io-client');

import { should, assert, expect} from 'chai';

describe("Testing server", () => {
  var socketURL = 'http://localhost:3000';
  
  var options ={
    transports: ['websocket'],
    'force new connection': true
  };

  var server;

  before("Setting the server", function(done) {
    server = require('./simple_server').server;
    done();
  });

  after("Closing the server", function(done) {
    server.close();
    done();
  });

  it("Should connect", function(done) {
    var client = io.connect(socketURL, options);
    client.once("connect", () => {
      client.disconnect();
      done();
    });
  });
  
});