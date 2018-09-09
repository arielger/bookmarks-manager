const faker = require("faker");
const Bookmark = require("./model");

const getRandomBookmarkData = (userId, props = {}) => ({
  url: faker.internet.url(),
  title: faker.random.words(),
  description: faker.lorem.paragraph(),
  createdAt: new Date(),
  updatedAt: new Date(),
  userId,
  ...props
});

const createRandomBookmark = (...props) =>
  Bookmark.create(getRandomBookmarkData(...props));

module.exports = {
  getRandomBookmarkData,
  createRandomBookmark
};
