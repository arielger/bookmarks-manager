const Sequelize = require("sequelize");
const sequelize = require("../db");

const Bookmark = sequelize.define("bookmark", {
  url: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Bookmark;
