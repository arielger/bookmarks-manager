const Sequelize = require("sequelize");
const { sequelize } = require("../../database");
const Bookmark = require("../bookmarks").model;
const User = require("../users").model;

const Tag = sequelize.define("tag", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

Tag.belongsTo(User);
Tag.belongsToMany(Bookmark, { through: "BookmarkTag" });
Bookmark.belongsToMany(Tag, { through: "BookmarkTag" });

module.exports = Bookmark;
