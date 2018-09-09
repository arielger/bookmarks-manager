const Sequelize = require("sequelize");
const sequelize = require("../../database");
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
    notEmpty: true,
    validate: { isUrl: true }
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: true,
    notEmpty: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
    notEmpty: true
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

Bookmark.belongsTo(User);

module.exports = Bookmark;
