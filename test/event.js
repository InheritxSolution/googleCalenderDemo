process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();

chai.use(chaiHttp);

describe("Event api unit test", () => {
  beforeEach((done) => {
    done();
  });
  describe("Check /GET event", () => {
    it("it should GET all the events as array", (done) => {
      chai
        .request(server)
        .get("/api/event")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.data.should.be.a("array");
          //   res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  
  describe("/POST event - Success", () => {
    it("it should create a calendar event", (done) => {
      let start = new Date();
      let end = new Date(2022, 0, 1);
      let randomDate = start.getTime() + Math.random() * (end.getTime() - start.getTime());
      let eStart = (new Date(randomDate)).toISOString();
      let eEnd = (new Date(randomDate+3600000)).toISOString();
      var event = {
          event_title: "Booking From Sample Cust For SMp001 Service",
          meeting:
          `Booking From Sample Cust For SMp001 Service at ${eStart} - ${eEnd}`,
          meeting_start_time: `${eStart}`,
          meeting_end_time: `${eEnd}`,
      };
      chai
        .request(server)
        .post("/api/event")
        .send(event)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          //   res.body.status.should.be.eql(1);
          done();
        });
    });
  });
});
