//@ts-check
const express = require("express");

const validateAccount = require("../middleware/validate-account");
const Events = require("../models/Events");
const router = express.Router();

router.get("/events/:accountId", validateAccount, (req, res) => {
  // @ts-ignore
  const { account, data } = req;
  const event = new Events(account.accountId, Date.now(), data);
  res.json({ event });
});

module.exports = router;
