// @ts-check
// with “accountId”. “accountName”, “isActive”
const faker = require("faker");
const Account = require("../models/Account");

const mocks = [];
for (let index = 1; index <= 5; index++) {
  const isActive = index % 2 === 0 ? true : false;
  mocks.push(new Account(index, faker.name.firstName(), isActive));
}

/**
 * @returns {Promise<{accountId: number, accountName: string, isActive: boolean}[]>}
 */
const getAll = () => new Promise((res) => res(mocks));

/**
 * @param {number} accountId
 * @returns {Promise<{accountId: number, accountName: string, isActive: boolean}>}
 */
const getById = (accountId) =>
  new Promise((res, rej) => {
    const account = mocks.find((a) => a.accountId === accountId);
    if (account) res(account);
    else rej(`Account with id ${accountId} does not exist.`);
  });

module.exports = {
  getById,
  getAll,
};
