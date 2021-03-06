const request = require("supertest");
const app = require("../../app.js");
const { getRandomBookmarkData, createRandomBookmark } = require("./").factory;

let token;
let userId;
let otherUserId;

describe("Bookmarks", () => {
  beforeAll(() => {
    ({ token, userId, otherUserId } = global);
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
        createRandomBookmark(userId),
        createRandomBookmark(userId)
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
      createRandomBookmark(userId, {
        url: "http://get-test.com/"
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
      createRandomBookmark(otherUserId).then(bookmark => {
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
          getRandomBookmarkData(userId, {
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

  describe("/PUT bookmark", () => {
    test("it should update bookmark url", done => {
      createRandomBookmark(userId, {
        url: "http://test-put.example.com/"
      }).then(bookmark => {
        request(app)
          .put(`/bookmarks/${bookmark.id}`)
          .send({ url: "http://changed.example.com/" })
          .set("x-access-token", token)
          .expect(200)
          .expect(res => {
            expect(res.body).toHaveProperty(
              "url",
              "http://changed.example.com/"
            );
          })
          .end(done);
      });
    });

    test("it should not be able to update bookmark from another user", done => {
      createRandomBookmark(otherUserId).then(bookmark => {
        request(app)
          .put(`/bookmarks/${bookmark.id}`)
          .send({ url: "http://changed.example.com/" })
          .set("x-access-token", token)
          .expect(404)
          .end(done);
      });
    });
  });

  describe("/DELETE bookmark", () => {
    test("it should DELETE a bookmark by id", done => {
      createRandomBookmark(userId, {
        url: "http://test.example.com/"
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
