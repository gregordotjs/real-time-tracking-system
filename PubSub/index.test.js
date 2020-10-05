//@ts-check
require("dotenv").config();
const chai = require("chai");
chai.should();
const socket = require("socket.io");
const ioClient = require("socket.io-client");
const io = socket();
const redisAdapter = require("socket.io-redis");
io.adapter(
  redisAdapter({
    host: process.env.REDIS_URL,
    port: parseInt(process.env.REDIS_PORT),
  })
);

let client;
let emitter;

describe("Socket.io", () => {
  beforeEach((done) => {
    io.listen(5001);
    client = ioClient.connect("http://localhost:5001");
    emitter = require("socket.io-emitter")({
      host: process.env.REDIS_URL,
      port: parseInt(process.env.REDIS_PORT),
    });
    done();
  });
  afterEach((done) => {
    io.close();
    client.disconnect();
    done();
  });

  describe("Events", () => {
    it("Clients should connect", () => {
      io.on("connection", function (socket) {
        socket.connected.should.equal(true);
        socket.should.have.property("id").to.be.a("string");
      });
    });

    it("Client should try to reconnect", (done) => {
      io.close();

      client.on("reconnect_attempt", () => {
        done();
      });
    });

    it("Clients should receive a message when the event is emited.", (done) => {
      emitter.emit("event", JSON.stringify({ accountId: 1, data: "test" }));

      client.on("event", function (event) {
        const res = JSON.parse(event);
        event.should.be.a("string");
        res.should.have.property("accountId", 1);
        done();
      });
    });
  });
});
