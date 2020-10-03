//@ts-check

const { ACCOUNTS_TABLE_NAME } = require("../consts");

exports.up = function (knex) {
  return knex.schema.createTable(ACCOUNTS_TABLE_NAME, (table) => {
    table.increments("account_id");
    table.string("account_name");
    table.boolean("is_active");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(ACCOUNTS_TABLE_NAME);
};
