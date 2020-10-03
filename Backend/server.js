//@ts-check
const express = require("express");
const app = express();

app.set('json spaces', 2);

const events = require("./routes/events");
const accounts = require("./routes/accounts");
app.use("/api/v1", events);
app.use("/api/v1", accounts);

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`));
