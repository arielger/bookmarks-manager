const Sequelize = require("sequelize");
const sequelize = require("../db");
const Bookmark = require("./Bookmark");

const Tag = sequelize.define("tag", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Tag.belongsToMany(Bookmark, { through: "BookmarkTag" });
Bookmark.belongsToMany(Tag, { through: "BookmarkTag" });

module.exports = Bookmark;
