const R = require("ramda");
const passport = require("passport");
const GoogleStrategy = require("passport-google-token").Strategy;
const { User } = require("../database");

// Show different messages in the front-end depending on the result of the authentication
// eslint-disable-next-line import/prefer-default-export
const googleAuthResults = {
  EXISTING: "EXISTING",
  LINK: "LINK",
  CREATE_NEW: "CREATE_NEW"
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET
    },
    async (accessToken, refreshToken, profile, cb) => {
      const email = R.pipe(
        R.propOr([], "emails"),
        R.head,
        R.prop("value")
      )(profile);

      try {
        const user = await User.findOne({
          raw: true,
          where: { googleId: profile.id }
        });

        if (user) {
          return cb(undefined, {
            result: googleAuthResults.EXISTING,
            ...user
          });
        }

        // Check if there is an user with the same email to do account linking
        const sameEmailUser = await User.findOne({
          raw: true,
          where: { email }
        });

        if (sameEmailUser) {
          User.update(
            {
              googleId: profile.id,
              firstName: R.path(["name", "givenName"], profile),
              lastName: R.path(["name", "familyName"], profile)
            },
            {
              returning: true,
              raw: true,
              where: { email }
            }
          );
          return cb(undefined, {
            result: googleAuthResults.LINK,
            ...sameEmailUser
          });
        }

        // If there is no user with the same email, create a new user
        const newUser = await User.create({
          firstName: R.path(["name", "givenName"], profile),
          lastName: R.path(["name", "familyName"], profile),
          email,
          googleId: profile.id
        });

        return cb(undefined, {
          result: googleAuthResults.CREATE_NEW,
          ...newUser
        });
      } catch (error) {
        return cb(error, false, error.message);
      }
    }
  )
);

module.exports = { googleAuthResults };
