const Sequelize = require("sequelize");
const sequelize = require("../../db");
const User = require('../users').model;

const Bookmark = sequelize.define("bookmark", {
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Bookmark.belongsTo(User);

module.exports = Bookmark;
