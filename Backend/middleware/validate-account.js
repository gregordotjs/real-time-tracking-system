//@ts-check

const { getById } = require("../db/accounts");

/**
 * @param {any} req
 * @param {any} res
 * @param {() => void} next
 */
const validateAccount = async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const { data } = req.query;

    const account = await getById(parseInt(accountId));

    if (!account.isActive)
      throw new Error(`Account ${accountId} is not active!`);

    req.account = account;
    req.data = data;
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = validateAccount;
