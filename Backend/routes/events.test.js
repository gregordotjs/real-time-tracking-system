//@ts-check
const chai = require("chai");
const chaiHttp = require("chai-http");
const { API_PREFIX } = require("../consts");

chai.use(chaiHttp);
const should = chai.should();
const server = require("../server");

describe("/GET events/2/?data=event-name", () => {
  it("it should produce an event", (done) => {
    const data = "event-name";
    chai
      .request(server)
      .get(`${API_PREFIX}/events/2/?data=${data}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("data", data);
        done();
      });
  });
});

describe("/GET events/1/?data=event-name", () => {
  it("it should return error (user is not active)", (done) => {
    const data = "event-name";
    const accountId = 1;
    chai
      .request(server)
      .get(`${API_PREFIX}/events/${accountId}/?data=${data}`)
      .end((err, res) => {
        res.should.have.status(500);
        res.text.should.be.a("string", `Account ${accountId} is not active!`);
        done();
      });
  });
});

describe("/GET events/10/?data=event-name", () => {
  it("it should return error (user doesn't exist)", (done) => {
    const data = "event-name";
    const accountId = 10;
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
