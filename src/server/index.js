const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const config = require("./config");
const router = require("./router");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
router.set(app);

app.listen(config.port, () =>
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${config.port} 👋`)
);
