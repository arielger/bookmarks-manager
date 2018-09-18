const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const sequelize = require("../../database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: { isAlpha: true }
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: { isAlpha: true }
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
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
