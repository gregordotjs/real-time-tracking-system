//@ts-check
const chai = require("chai");
const chaiHttp = require("chai-http");
const { API_PREFIX } = require("../consts");

chai.use(chaiHttp);
const should = chai.should();
const server = require("../server");

const { test } = require("../knexfile");
const knex = require("knex")(test);

describe("GET /events endpoint tests", () => {
  before(async () => {
    await knex.migrate.latest();
    return knex.seed.run();
  });

  after(async () => {
    await knex.migrate.rollback();
    return await knex.destroy();
  });

  it("it should produce an event", (done) => {
    const data = "event-name";
    const accountId = 1;
    chai
      .request(server)
      .get(`${API_PREFIX}/events/${accountId}/?data=${data}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("data", data);
        done();
      });
  });

  it("it should return error (user is not active)", (done) => {
    const data = "event-name";
    const accountId = 2;
    chai
      .request(server)
      .get(`${API_PREFIX}/events/${accountId}/?data=${data}`)
      .end((err, res) => {
        res.should.have.status(500);
        res.text.should.be.a("string", `Account ${accountId} is not active!`);
        done();
      });
  });

  it("it should return error (user doesn't exist)", (done) => {
    const data = "event-name";
    const accountId = 15;
    chai
      .request(server)
      .get(`${API_PREFIX}/events/${accountId}/?data=${data}`)
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
