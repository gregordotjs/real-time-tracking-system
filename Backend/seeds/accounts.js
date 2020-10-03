//@ts-check
const faker = require("faker");
const { ACCOUNTS_TABLE_NAME } = require("../consts");

const mocks = [];
for (let index = 0; index < 10; index++) {
  const isActive = index % 2 === 0 ? true : false;
  mocks.push({ account_name: faker.name.firstName(), is_active: isActive });
}

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(ACCOUNTS_TABLE_NAME)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(ACCOUNTS_TABLE_NAME).insert(mocks);
    });
};
