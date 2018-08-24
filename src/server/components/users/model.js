const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const sequelize = require("../../db");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { isAlpha: true }
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { isAlpha: true }
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

User.verifyPassword = (password, cb) => {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

module.exports = User;
