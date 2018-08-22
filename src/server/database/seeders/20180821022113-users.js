const bcrypt = require("bcrypt");
const faker = require("faker");
const R = require("ramda");
/* eslint-disable no-console */

const generateRandomUser = () => {
  const username = faker.internet.userName();

  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username,
    password: bcrypt.hashSync(username, 8),
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const generateRandomTag = userId => ({
  title: faker.random.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
  userId
});

const generateRandomBookmark = userId => ({
  url: faker.internet.url(),
  createdAt: new Date(),
  updatedAt: new Date(),
  userId
});

module.exports = {
  up: async queryInterface => {
    const users = R.times(generateRandomUser, 5);
    const dbUsers = await queryInterface.bulkInsert("users", users, {
      returning: true
    });

    // Add tags for each user
    const tags = R.pipe(
      R.map(user => R.times(() => generateRandomTag(user.id), 5)),
      R.flatten
    )(dbUsers);

    queryInterface.bulkInsert("tags", tags, {
      returning: true
    });

    // Add bookmarks for each user
    const bookmarks = R.pipe(
      R.map(user => R.times(() => generateRandomBookmark(user.id), 5)),
      R.flatten
    )(dbUsers);

    queryInterface.bulkInsert("bookmarks", bookmarks);
  },

  down: async queryInterface => {
    console.log("🗑 Delete bookmarks");
    await queryInterface.bulkDelete("bookmarks", null, {});

    console.log("🗑 Delete tags");
    await queryInterface.bulkDelete("tags", null, {});

    console.log("🗑 Delete users");
    await queryInterface.bulkDelete("users", null, {});
  }
};
