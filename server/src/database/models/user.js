const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isAlpha: true }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isAlpha: true }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING
    },
    googleId: {
      type: DataTypes.STRING,
      notEmpty: true,
      unique: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });

  User.verifyPassword = (password, cb) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) return cb(err);
      return cb(null, isMatch);
    });
  };

  return User;
};
