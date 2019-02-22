const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const { errors } = require("celebrate");

dotenv.config();

require("./database");
const router = require("./router");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(passport.initialize());
require("./authentication/google");

app.use(errors());

router.set(app);

app.use((req, res) => {
  res.status(404);
  res.send({ error: "Not found" });
});

// Prevent bounding server to port in test env
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 5000;

  app.listen(port, () =>
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port} 👋`)
  );
}

// for testing
module.exports = app;
