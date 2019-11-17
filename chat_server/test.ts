import io from 'socket.io-client';
import {io as ioServer} from "./index";

/**
 * Setup WS & HTTP servers
 */
beforeAll(done => {
  console.log("coucou");
  done();
});

/**
 *  Cleanup WS & HTTP servers
 */
afterAll(done => {
  console.log("buye");
  done();
});

/**
 * Run before each test
 */
beforeEach(done => {
  io.on("connect", done);
});

/**
 * Run after each test
 */
afterEach(done => {
  io.disconnect();
  done()
});

describe("basic socket.io example", () => {
  test("should communicate with waiting for socket.io handshakes", done => {
    io.emit("message", {"coucou"});
    done();
  });
});
