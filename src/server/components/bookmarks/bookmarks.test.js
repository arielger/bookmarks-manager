const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../app.js");
const sequelize = require("../../db");
const { getRandomUserData, createRandomUser } = require("../users").factory;
const { getRandomBookmarkData, createRandomBookmark } = require("./").factory;

let token;
let userId;
let otherUserId;

describe("Bookmarks", () => {
  beforeAll(async () => {
    await sequelize.sync({
      force: true
    });
    console.log("💾 Database sync finished");

    const randomUser = getRandomUserData({
      username: "test"
    });

    // Create testing user and get JWT for testing
    const response = await request(app)
      .post("/users/signup")
      .send(randomUser);

    token = response.body.token; // eslint-disable-line prefer-destructuring
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      userId = decoded.id;
    });

    createRandomUser({ username: "other" }).then(user => {
      otherUserId = user.id;
    });
  });

  afterAll(() => {
    sequelize.close();
  });

  describe("/GET bookmarks", () => {
    test("it should return an empty array if there are no bookmarks", done => {
      request(app)
        .get("/bookmarks")
        .set("x-access-token", token)
        .expect("Content-Type", /json/)
        .expect(200, [], done);
    });

    test("it should return a list of bookmarks", done => {
      Promise.all([
        createRandomBookmark({ userId }),
        createRandomBookmark({ userId })
      ]).then(() => {
        request(app)
          .get("/bookmarks")
          .set("x-access-token", token)
          .expect("Content-Type", /json/)
          .expect(200)
          .expect(res => {
            expect(res.body).toHaveLength(2);
          })
          .end(done);
      });
    });
  });

  describe("/GET bookmark", () => {
    test("it should retrieve a bookmark data", done => {
      createRandomBookmark({
        url: "http://get-test.com/",
        userId
      }).then(bookmark => {
        request(app)
          .get(`/bookmarks/${bookmark.id}`)
          .set("x-access-token", token)
          .expect("Content-Type", /json/)
          .expect(200)
          .expect(res => {
            expect(res.body).toHaveProperty("url", "http://get-test.com/");
          })
          .end(done);
      });
    });

    test("it should not retrieve bookmarks from another user", done => {
      createRandomBookmark({ userId: otherUserId }).then(bookmark => {
        request(app)
          .get(`/bookmarks/${bookmark.id}`)
          .set("x-access-token", token)
          .expect(404)
          .end(done);
      });
    });
  });

  describe("/POST bookmarks", () => {
    test("it should create a new bookmark and retrieve it", done => {
      request(app)
        .post("/bookmarks")
        .send(
          getRandomBookmarkData({
            url: "http://bubble.example.com/"
          })
        )
        .set("x-access-token", token)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty("url", "http://bubble.example.com/");
        })
        .end(done);
    });
  });

  describe("/DELETE bookmark", () => {
    test("it should DELETE a bookmark by id", done => {
      createRandomBookmark({
        url: "http://test.example.com/",
        userId
      }).then(bookmark => {
        request(app)
          .delete(`/bookmarks/${bookmark.id}`)
          .set("x-access-token", token)
          .expect(200)
          .expect(res => {
            expect(res.body).toHaveProperty("url", "http://test.example.com/");
          })
          .end(done);
      });
    });

    test("it should return NOT FOUND when trying to delete unexisting bookmark", done => {
      request(app)
        .delete("/bookmarks/999999")
        .set("x-access-token", token)
        .expect(404)
        .end(done);
    });
  });
});
