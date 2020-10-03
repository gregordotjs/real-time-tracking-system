//@ts-check
const express = require("express");
const { getAll, getById } = require("../db/mocks");

const router = express.Router();

router.get("/accounts", async (req, res) => {
  try {
    const accounts = await getAll();
    res.json(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/accounts/:accountId", async (req, res) => {
  try {
    // @ts-ignore
    const { accountId } = req.params;
    const accounts = await getById(parseInt(accountId));
    res.json(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
