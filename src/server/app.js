const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = require("./database");
const router = require("./router");

if (process.env.NODE_ENV === "development") {
  // Force sync all models
  sequelize.sync({ force: true });
}

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
router.set(app);

// Prevent bounding server to port in test env
if (process.env.NODE_ENV !== "test") {
  const port = process.env.SERVER_PORT || 5000;

  app.listen(port, () =>
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port} 👋`)
  );
}

// for testing
module.exports = app;
