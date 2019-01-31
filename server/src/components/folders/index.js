const controller = require("./controller");
const db = require("../../database/models");

const { Folder } = db;

module.exports = {
  controller,
  model: Folder
};
