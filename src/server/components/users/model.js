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
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    // @todo: Review length validation -> not working
    validate: {
      len: {
        args: [6, 128],
        msg: "The password should have at least 6 characters."
      }
    }
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
