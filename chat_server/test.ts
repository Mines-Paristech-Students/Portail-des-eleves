const jwt = require("jsonwebtoken");
const io = require("socket.io-client");
const dotenv = require("dotenv");
import { assert } from "chai";
import { index } from "./index";

// Parsing environnement configuration
dotenv.config();

const public_key = process.env.JWT_PUBLIC_KEY;
const jwt_algo = process.env.JWT_ALGO || "RS256";
const token = process.env.JWT_TOKEN_TEST;
const token_user = process.env.JWT_TOKEN_TEST_USER || "17bocquet";

describe("Testing Django public key integration", () => {
  it("Check dotenv configutation", () => {
    assert.notEqual(token, undefined);
    assert.notEqual(public_key, undefined);
  });

  it("Can decode token", function () {
    var decoded = jwt.verify(token, public_key, { algorithms: [jwt_algo] });
    assert.strictEqual(token_user, decoded.user);
  });
});

// Tests
describe("Testing the messages service", () => {
  // These variables shouldn't be initialize yet, unless they launch a timeout while testing
  var server, socket_options, socket;

  before("Launching the server and getting sockets options", function (done) {
    server = index.server;
    socket_options = {
      url: "http://localhost:" + server.address().port,
      options: {
        forceNew: true,
        query: "token=" + token,
      },
    };
    done();
  });

  after("Closing the server", function (done) {
    server.close();
    done();
  });

  beforeEach("Creating a client", function (done) {
    socket = io.connect(socket_options.url, socket_options.options);
    socket
      .on("connect", () => {
        done();
      })
      .on("error", (err) => {
        done(err);
      });
  });

  afterEach("Destroying the client", function (done) {
    socket.close();
    done();
  });

  // The tests

  it("User can post a message, socket broadcast is correct", function (done) {
    let message = "licorne";

    // This broadcast checks that the message is correct
    socket.on("broadcast", function (data) {
      assert.strictEqual(
        data.username,
        token_user,
        "Inserted username is correct"
      );
      assert.strictEqual(
        data.message,
        "licorne",
        "Inserted message is correct"
      );
      assert.exists(data.posted_on);
      done();
    });

    // Emit the message
    socket.emit("message", { message: message });
  });

  it("User can retrieve a message from the database", function (done) {
    let message = "licorne";
    let limit = 1;
    let date = new Date("2100-12-17T03:24:00");

    // Check that the answer is correct
    socket.on("fetch_response", function (rows) {
      assert.strictEqual(rows.length, limit, "Correct number of rows");
      let row = rows[rows.length - 1];
      assert.strictEqual(
        row.username,
        token_user,
        "Last message username is correct"
      );
      assert.strictEqual(
        row.message,
        "licorne",
        "Last message content is correct"
      );
      assert.exists(row.posted_on);
      done();
    });

    socket.on("broadcast", function (data) {
      socket.emit("fetch", { from: date, limit: 1 });
    });

    // Emit the message and fetch last
    socket.emit("message", { message: message });
  });
});
