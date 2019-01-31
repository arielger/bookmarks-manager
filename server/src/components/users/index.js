const controller = require("./controller");
const db = require("../../database/models");
const factory = require("./factory");

module.exports = {
  controller,
  model: db.User,
  factory
};
