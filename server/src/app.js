const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

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
