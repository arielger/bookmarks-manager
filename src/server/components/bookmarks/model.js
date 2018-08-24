const Sequelize = require("sequelize");
const sequelize = require("../../db");
const User = require("../users").model;

const Bookmark = sequelize.define("bookmark", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { isUrl: true }
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

Bookmark.belongsTo(User);

module.exports = Bookmark;
