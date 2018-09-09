const faker = require("faker");
const Tag = require("./model");

const getRandomTagData = (userId, props = {}) => ({
  title: faker.random.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
  userId,
  ...props
});

const createRandomTag = props => Tag.create(getRandomTagData(props));

module.exports = {
  getRandomTagData,
  createRandomTag
};
