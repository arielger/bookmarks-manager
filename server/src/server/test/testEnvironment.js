/* eslint-disable import/no-extraneous-dependencies  */
/* eslint-disable class-methods-use-this  */
const request = require("supertest");
const jwt = require("jsonwebtoken");
const NodeEnvironment = require("jest-environment-node");
const app = require("../app");
const { sequelize } = require("../database");
const {
  getRandomUserData,
  createRandomUser
} = require("../components/users").factory;

class TestEnvironment extends NodeEnvironment {
  async setup() {
    // Create testing user and get JWT for testing
    const response = await request(app)
      .post("/users/signup")
      .send(getRandomUserData());

    this.global.token = response.body.token;
    jwt.verify(this.global.token, process.env.JWT_SECRET, (err, decoded) => {
      this.global.userId = decoded.id;
    });

    const otherUser = await createRandomUser();
    this.global.otherUserId = otherUser.id;
  }

  async teardown() {
    await sequelize.close();
  }
}

module.exports = TestEnvironment;
