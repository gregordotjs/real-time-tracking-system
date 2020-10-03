//@ts-check

const { ACCOUNTS_TABLE_NAME } = require("../consts");
const Account = require("../models/Account");
const knex = require("./connection");

/**
 * @returns {Promise<{accountId: number, accountName: string, isActive: boolean}[]>}
 */
const getAll = async () => {
  try {
    /** @type {any} */
    const data = await knex.select("*").from(ACCOUNTS_TABLE_NAME);
    const accounts = data.map(
      (data) => new Account(data.account_id, data.account_name, data.is_active)
    );
    return accounts;
  } catch (error) {
    return error;
  }
};

/**
 * @param {number} accountId
 * @returns {Promise<{accountId: number, accountName: string, isActive: boolean}>}
 */
const getById = async (accountId) => {
  let account;
  let ex;
  try {
    /** @type {any} */
    const data = await knex
      .select("*")
      .from(ACCOUNTS_TABLE_NAME)
      .where({ account_id: accountId })
      .first();

    if (data) {
      const { account_id, account_name, is_active } = data;
      account = new Account(account_id, account_name, is_active);
    } else {
      ex = `Account with id ${accountId} does not exist.`;
    }
  } catch (error) {
    ex = error;
  } finally {
    if (account) {
      return account;
    }
    if (ex) {
      throw new Error(ex);
    }
  }
};

module.exports = {
  getById,
  getAll,
};
