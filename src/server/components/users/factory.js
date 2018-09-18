const bcrypt = require("bcrypt");
const faker = require("faker");
const User = require("./model");

const getRandomUserData = ({ email, ...props } = {}) => {
  // Use the same value for email and password for testing
  const newEmail = email || faker.internet.email();

  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: newEmail,
    password: bcrypt.hashSync(newEmail, 8),
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
