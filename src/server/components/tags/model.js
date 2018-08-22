const Sequelize = require("sequelize");
const sequelize = require("../../db");
const Bookmark = require("../bookmarks").model;
const User = require("../users").model;

const Tag = sequelize.define("tag", {
  title: { type: Sequelize.STRING, allowNull: false }
});

Tag.belongsTo(User);
Tag.belongsToMany(Bookmark, { through: "BookmarkTag" });
Bookmark.belongsToMany(Tag, { through: "BookmarkTag" });

module.exports = Bookmark;
