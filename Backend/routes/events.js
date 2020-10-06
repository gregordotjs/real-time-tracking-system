//@ts-check
require("dotenv").config();
/*
* basic socket.io solution
const socketClient = require("socket.io-client");
const io = socketClient.connect(
  `${process.env.SOCKET_IO_URL}:${process.env.SOCKET_IO_PORT}`,
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 20,
  }
);
*/

const express = require("express");
const validateAccount = require("../middleware/validate-account");
const Events = require("../models/Events");
const router = express.Router();

const emitter = require("socket.io-emitter")({
  host: process.env.REDIS_URL,
  port: parseInt(process.env.REDIS_PORT),
});
const client = require("redis").createClient();

router.get("/events/:accountId", validateAccount, (req, res) => {
  // @ts-ignore
  const { account, data, app } = req;

  const event = new Events(account.accountId, Date.now(), data);

  // store event into redis
  client.zadd("events", event.timestamp, JSON.stringify(event));
  // emit event, using socket.io-emitter
  emitter.emit("event", JSON.stringify(event));

  // Basic socket.io solution
  // io.emit("event-socket-io", JSON.stringify(event));
  res.json({ ...event });
});

module.exports = router;
