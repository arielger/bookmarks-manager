const db = require("../../database/models");

const { User } = db;

const add = user => User.create(user);

module.exports = {
  add
};
