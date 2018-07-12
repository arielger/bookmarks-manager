const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const config = require("./config");
const router = require("./router");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
router.set(app);

app.listen(config.port, () =>
  console.log(`App listening on port ${config.port}`)
);
