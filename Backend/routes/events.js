//@ts-check
const express = require("express");

const validateAccount = require("../middleware/validate-account");
const Events = require("../models/Events");
const router = express.Router();
const io = require("socket.io-emitter")({ host: "127.0.0.1", port: 6379 });

var redis = require("redis"),
  client = redis.createClient();

router.get("/events/:accountId", validateAccount, (req, res) => {
  // @ts-ignore
  const { account, data, app } = req;

  const event = new Events(account.accountId, Date.now(), data);

  //zadd table_name data timestamp_in_unix

  client.zadd("events", event.timestamp, JSON.stringify(event));

  io.emit("event", JSON.stringify(event));

  res.json({ ...event });
});

module.exports = router;
