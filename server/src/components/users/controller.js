const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ms = require("ms");
const uuidv4 = require("uuid/v4");
const { Op } = require("sequelize");
const { celebrate, Joi, isCelebrate } = require("celebrate");
const sequelizeToJoi = require("@revolttv/sequelize-to-joi").default;
const R = require("ramda");
const normalizeEmail = require("normalize-email");
const db = require("../../database/models");
const userService = require("./service");
const emailTransporter = require("../../emails/transporter");
const { googleAuthResults } = require("../../authentication/google");

const { User } = db;

const hashPassword = password => bcrypt.hashSync(password, 8);

const customJoiErrorHandler = (err, req, res, next) => {
  if (err && isCelebrate(err)) {
    return res.status(400).send({
      original: err._object, // eslint-disable-line no-underscore-dangle
      details: R.fromPairs(
        err.details.map(({ message, type, path }) => [
          path,
          {
            message: message.replace(/['"]/g, ""),
            type
          }
        ])
      )
    });
  }
  return next();
};

const passwordJoiValidator = Joi.string()
  .required()
  .min(6)
  .max(128);

const userValidator = sequelizeToJoi(User)
  // Need to validate the password outside of the model since
  // the password of the model is hashed
  .keys({ password: passwordJoiValidator });

const signUp = [
  celebrate({
    body: userValidator
  }),
  customJoiErrorHandler,
  async (req, res) => {
    const userData = R.pipe(
      R.pick(["firstName", "lastName", "password", "email"]),
      R.evolve({ email: normalizeEmail })
    )(req.body);

    const userWithSameEmail = await User.findOne({
      where: { email: userData.email }
    });

    if (userWithSameEmail) {
      return res.status(400).send({
        original: userData,
        details: {
          email: {
            message: "There is already an user with that email"
          }
        }
      });
    }

    return userService
      .add({ ...userData, password: hashPassword(userData.password) })
      .then(user => {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "24h"
        });

        return res.status(200).send({ auth: true, token });
      })
      .catch(err => res.status(500).send(err));
  }
];

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

const logIn = [
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    })
  }),
  customJoiErrorHandler,
  (req, res) => {
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
  }
];

const logInWithProvider = (req, res) => {
  if (!req.user) {
    return res.send(401, "User Not Authenticated");
  }

  let message;

  if (req.user.result === googleAuthResults.LINK) {
    message = `There was already an account with your email (${
      req.user.email
    }). From now on you can log in with Google or email.`;
  } else if (
    req.query.isSignUp &&
    req.user.result === googleAuthResults.EXISTING
  ) {
    message = `User ${req.user.firstName} ${
      req.user.lastName
    } at Google already had an account so you have been logged in.`;
  }

  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: "24h"
  });
  return res.status(200).send({ auth: true, token, message });
};

const logOut = (req, res) => {
  res.status(200).send({ auth: false, token: null });
};

const forgotPassword = [
  celebrate({
    body: {
      email: Joi.string().email()
    }
  }),
  customJoiErrorHandler,
  async (req, res) => {
    const email = normalizeEmail(req.body.email);

    try {
      const user = await User.findOne({ where: { email } });

      // Prevent sending "no user found" message for security reasons
      if (user) {
        const resetPasswordToken = uuidv4();

        await user.update({
          resetPasswordToken,
          resetPasswordExpires: Date.now() + ms("15m")
        });

        const resetPasswordURL = `${
          process.env.CLIENT_URL
        }/password/reset?token=${resetPasswordToken}`;

        emailTransporter.sendMail({
          from: "Bookmarks manager <bookmarks-manager@example.com>",
          to: user.email,
          subject: "Password reset instructions",
          html: `To reset your password, plase click this link: <a href="${resetPasswordURL}">${resetPasswordURL}</a>`
        });
      }

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(`Error on the server: ${error}`);
    }
  }
];

const resetPassword = [
  celebrate({
    body: Joi.object().keys({
      newPassword: passwordJoiValidator,
      token: Joi.string()
        .guid()
        .required()
    })
  }),
  customJoiErrorHandler,
  async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: req.body.token,
          resetPasswordExpires: { [Op.gt]: Date.now() }
        }
      });

      if (!user) {
        res
          .status(400)
          .send({ error: "Password reset token is invalid or has expired" });
      }

      await user.update({
        password: hashPassword(req.body.newPassword),
        resetPasswordToken: null,
        resetPasswordExpires: null
      });

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send({ error: `Error on the server: ${error}` });
    }
  }
];

module.exports = {
  signUp,
  me,
  logIn,
  logInWithProvider,
  forgotPassword,
  resetPassword,
  logOut
};
