//@ts-check

const { development } = require("../knexfile");
const knex = require("knex")(development);

module.exports = knex;
