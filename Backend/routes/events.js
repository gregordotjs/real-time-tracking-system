//@ts-check
require("dotenv").config();
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
  res.json({ ...event });
});

module.exports = router;
