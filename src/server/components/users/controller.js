const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./model");
const userService = require("./service");

const signUp = (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  userService
    .add({
      firstName,
      lastName,
      username,
      password: hashedPassword
    })
    .then(user => {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "24h"
      });

      return res.status(200).send({
        auth: true,
        token
      });
    })
    .catch(err => res.status(500).send(err));
};

const me = (req, res) => {
  User.findById(req.userId, {
    attributes: { exclude: ["password"] }
  })
    .then(user => {
      if (!user) return res.status(404).send("User not found");
      return res.status(200).send(user);
    })
    .catch(err =>
      res.status(500).send(`There was a problem finding the user: ${err}`)
    );
};

const logIn = (req, res) => {
  const { username, password } = req.body;

  // Check if user with the username exists

  User.findOne({ where: { username } })
    .then(user => {
      if (!user) return res.status(404).send("User not found");

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
