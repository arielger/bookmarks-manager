const faker = require("faker");
const Bookmark = require("./model");

const getRandomBookmarkData = (props = {}) => ({
  url: faker.internet.url(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...props
});

const createRandomBookmark = props =>
  Bookmark.create(getRandomBookmarkData(props));

module.exports = {
  getRandomBookmarkData,
  createRandomBookmark
};
