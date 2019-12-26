import { assert } from 'chai';

const io = require('socket.io-client');

// The index we are testing
const index = require('./index'); 

// Generating a random-token for testing
const jwt = require('jsonwebtoken');
import jwt_option from './jwt_option';

const profile = {
  username: '17doe',
  email: 'john@doe.com',
  id: 123
};

const token = jwt.sign(profile, jwt_option.secret, { expiresIn: 60 * 60 * 5 });

// Tests
describe("Testing the messages service", () => {

  // These variables shouldn't be initialize yet, unless they launch a timeout while testing
  var server, socket_options, socket;

  // Done before ALL tests
  before("Launching the server and getting sockets options", function (done) {
    server = index.server;
    socket_options = {
      url: 'http://localhost:'+server.address().port,
      options: {
        forceNew: true,
        query: 'token=' + token
      }
    }
    done();
  });

  after("Closing the server", function (done) {
    server.close();
    done();
  });

  // Done before EACH test
  beforeEach("Creating a client", function(done) {
    try {
      socket = io.connect(socket_options.url, socket_options.options); 
      socket
        .on('connect', () => {
          done();
        })
        .on('error', (err) => {
          done(err);
        });
    } catch (err) {
      done(err);
    }
  });

  afterEach("Destroying the client", function(done) {
    socket.close();
    done();
  });

  // The tests 

  // FIXME : Do I have to surround with try / catch

  it("User can post a message, and the message is correct", function(done) {
    let message = "licorne";

    // This broadcast checks that the message is correct
    socket.on('broadcast', function(data) {
      assert.strictEqual(data.username, profile.username, "Inserted username is correct");
      assert.strictEqual(data.message, message, "Inserted message is correct");
      done();
    });

    // Emit the message
    socket.emit("message", {message: message});
  });

  it("User can retrieve a message from the database", function(done) {
    let message = "licorne";
    let limit = 1;
    let date = new Date('2100-12-17T03:24:00');
    
    // Check that the answer is correct
    socket.on("fetch_response", function(rows) {
      assert.strictEqual(rows.length, limit, "Correct number of rows")
      let row = rows[rows.length-1]
      assert.strictEqual(row.username, profile.username, "Last message username is correct");
      assert.strictEqual(row.message, message, "Last message content is correct");
      done();
    });
    
    socket.on('broadcast', function(data) {
      socket.emit("fetch", {from: date, limit: 1});
    });

    // Emit the message and fetch last
    socket.emit("message", {message: message});
  });
});