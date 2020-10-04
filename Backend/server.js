//@ts-check
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { API_PREFIX } = require("./consts");

app.set("json spaces", 2);

const events = require("./routes/events");
const accounts = require("./routes/accounts");
app.use(API_PREFIX, events);
app.use(API_PREFIX, accounts);

server.listen(3000, () =>
  console.log(`Example app listening on port ${3000}!`)
);

module.exports = app;
