//@ts-check
const express = require("express");
const { API_PREFIX } = require("./consts");

const app = express();
app.set("json spaces", 2);

const events = require("./routes/events");
const accounts = require("./routes/accounts");
app.use(API_PREFIX, events);
app.use(API_PREFIX, accounts);

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`));

module.exports = app;
