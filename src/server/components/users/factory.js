const bcrypt = require("bcrypt");
const faker = require("faker");
const User = require("./model");

const getRandomUserData = ({ username, ...props }) => {
  // Use the same value for username and password for testing

  const user = username || faker.internet.userName();

  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: user,
    password: bcrypt.hashSync(user, 8),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...props
  };
};

const createRandomUser = props => User.create(getRandomUserData(props));

module.exports = {
  getRandomUserData,
  createRandomUser
};
