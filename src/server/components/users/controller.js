const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const sequelizeToJoi = require("@revolttv/sequelize-to-joi").default;
const R = require("ramda");
const User = require("./model");
const userService = require("./service");

const userValidator = sequelizeToJoi(User);

// @todo: Review error results
const signUp = async (req, res) => {
  const userData = R.pick(
    ["firstName", "lastName", "password", "email"],
    req.body
  );

  const validationResult = Joi.validate(userData, userValidator);

  if (validationResult.error) {
    return res.status(400).send({
      error: validationResult.error.details
        .map(detail => detail.message)
        .join(" / ")
    });
  }

  if (userData.password.length < 6 || userData.password.length > 128) {
    return res.status(400).send({
      error: "The password should have at least 6 characters"
    });
  }

  const userWithSameEmail = await User.findOne({
    where: { email: userData.email }
  });

  if (userWithSameEmail) {
    return res.status(400).send({
      error: "There is already an user with that email"
    });
  }

  const hashedPassword = bcrypt.hashSync(userData.password, 8);

  return userService
    .add({ ...userData, password: hashedPassword })
    .then(user => {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "24h"
      });

      return res.status(200).send({ auth: true, token });
    })
    .catch(err => res.status(500).send(err));
};

const me = (req, res) => {
  User.findById(req.userId, {
    attributes: { exclude: ["password"] }
  })
    .then(user => {
      if (!user)
        return res.status(404).send({
          error: "User not found"
        });
      return res.status(200).send(user);
    })
    .catch(err =>
      res.status(500).send(`There was a problem finding the user: ${err}`)
    );
};

const logIn = (req, res) => {
  const { email, password } = req.body;

  // Check if user with the email exists

  User.findOne({ where: { email } })
    .then(user => {
      if (!user)
        return res.status(404).send({
          error: "User not found"
        });

      // If exists check if the password match

      const passwordIsValid = bcrypt.compareSync(password, user.password);

      if (!passwordIsValid)
        return res.status(401).send({
          auth: false,
          token: null
        });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "24h"
      });

      return res.status(200).send({ auth: true, token });
    })
    .catch(err => res.status(500).send(`Error on the server: ${err}`));
};

const logOut = (req, res) => {
  res.status(200).send({ auth: false, token: null });
};

module.exports = {
  signUp,
  me,
  logIn,
  logOut
};
