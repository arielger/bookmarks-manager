const controller = require("./controller");
const factory = require("./factory");
const db = require("../../database/models");

const { Bookmark } = db;

module.exports = {
  controller,
  model: Bookmark,
  factory
};
