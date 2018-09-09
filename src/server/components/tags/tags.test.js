const request = require("supertest");
const app = require("../../app.js");
const { getRandomTagData } = require("./").factory;

let token;
let userId;

describe("Tags", () => {
  beforeAll(() => {
    ({ token, userId } = global);
  });

  describe("/POST tags", () => {
    test("it should create a new tag and retrieve it", done => {
      done();
      request(app)
        .post("/tags")
        .send(
          getRandomTagData(userId, {
            title: "http://test.example.com/"
          })
        )
        .set("x-access-token", token)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty("title", "http://test.example.com/");
        })
        .end(done);
    });
  });
});
