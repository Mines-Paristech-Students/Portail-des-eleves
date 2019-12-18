/**
 * Things that should be checked
 * 1. Can connect
 * 2. Can post things
 * 3. Recup le bon offset
 * Cannot read/write without the token
 */

/**
 * TODO : fix the port to have a right name for it
 */

// Just look at the official repo for the loogin

var io = require('socket.io-client');

// Load before unless triggers a timeout
var tested = require('./simple_server')

import { should, assert, expect } from 'chai';
const request = require('request');

// Yet I'm just creating an agent
// The rest of the work is already manager by the official repo's tests
describe("Testing socket.io with authentification", () => {

  var socketURL = 'http://localhost:3000';

  var options = {
    transports: ['websocket'],
    'force new connection': true
  };

  var server;

  before("Setting the server", function (done) {
    server = tested.server;
    done();
  });

  after("Closing the server", function (done) {
    server.close();
    done();
  });


  // First test
  describe("When user logged in", function () {

    // Signing the token
    before("Logging the user", function (done) {
      request.post({
        url: 'http://localhost:3000/login',
        form: { username: 'jose', password: 'Pa123' },
        json: true
      }, (err, resp, body) => {
        this.token = body.token;
        done();
      });
    });

    it("Connecting a client", function (done) {
      const socket = io.connect('http://localhost:3000', {
        forceNew: true,
        query: 'token=' + this.token
      });
      socket
        .on('connect', () => {
          socket.close();
          done();
        })
        .on('error', done);
    });
  });
});