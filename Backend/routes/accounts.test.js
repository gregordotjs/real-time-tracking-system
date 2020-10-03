//@ts-check
const chai = require("chai");
const chaiHttp = require("chai-http");
const { API_PREFIX } = require("../consts");

chai.use(chaiHttp);
const should = chai.should();
const server = require("../server");

const { test } = require("../knexfile");
const knex = require("knex")(test);

describe("GET /accounts endpoint tests", () => {
  before(async () => {
    await knex.migrate.latest();
    return knex.seed.run();
  });

  after(async () => {
    await knex.migrate.rollback();
    return await knex.destroy();
  });

  it("it should GET all accounts", (done) => {
    chai
      .request(server)
      .get(`${API_PREFIX}/accounts`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(10);
        done();
      });
  });

  it("it should GET account with id 1", (done) => {
    chai
      .request(server)
      .get(`${API_PREFIX}/accounts/1`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("accountId", 1);
        done();
      });
  });

  it("it should return error (since user doesn't exist)", (done) => {
    const accountId = 15;
    chai
      .request(server)
      .get(`${API_PREFIX}/accounts/${accountId}`)
      .end((err, res) => {
        res.should.have.status(500);
        res.text.should.be.a(
          "string",
          `Account with id ${accountId} does not exist.`
        );
        done();
      });
  });
});
