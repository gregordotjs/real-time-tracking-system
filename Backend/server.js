//@ts-check
require('dotenv').config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { API_PREFIX } = require("./consts");

app.set("json spaces", 2);

const events = require("./routes/events");
const accounts = require("./routes/accounts");
app.use(API_PREFIX, events);
app.use(API_PREFIX, accounts);

server.listen(process.env.SERVICE_PORT, () =>
  console.log(`Example app listening on port ${process.env.SERVICE_PORT}!`)
);

module.exports = app;
