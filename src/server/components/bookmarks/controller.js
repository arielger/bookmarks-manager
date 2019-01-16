const R = require("ramda");
const Joi = require("joi");
const sequelizeToJoi = require("@revolttv/sequelize-to-joi").default;
const { isURL } = require("validator");
const bookmarkService = require("./service");
const db = require("../../database/models");

const { Bookmark } = db;

const bookmarkValidator = sequelizeToJoi(Bookmark);

// @todo: Add PUT

// @todo: Implement pagination, filtering, sorting
const getBookmarks = (req, res) => {
  bookmarkService.getAllFromUser(req.userId).then(data => res.send(data));
};

const getBookmark = (req, res) => {
  const bookmarkId = req.params.id;

  bookmarkService
    .getByIdFromUser(req.userId, bookmarkId)
    .then(bookmark => {
      if (!bookmark) {
        return res
          .status(404)
          .send({ error: "Bookmark not found for the user" });
      }
      return res.status(200).send(bookmark);
    })
    .catch(err => res.status(500).send({ error: err }));
};

const addBookmark = (req, res) => {
  const bookmarkData = R.pick(["url", "title", "description"], req.body);

  // @todo: Move joi validation to middleware
  const validationResult = Joi.validate(bookmarkData, bookmarkValidator);

  if (validationResult.error) {
    return res.status(400).send({
      status: "failed",
      error: {
        original: validationResult.error._object, // eslint-disable-line no-underscore-dangle
        details: R.fromPairs(
          validationResult.error.details.map(({ message, type, path }) => [
            path,
            {
              message: message.replace(/['"]/g, ""),
              type
            }
          ])
        )
      }
    });
  }

  // Check
  // default sequelizeToJoi validator will only check for uri format

  if (!isURL(bookmarkData.url)) {
    return res.status(400).send({
      status: "failed",
      error: {
        original: bookmarkData,
        details: {
          url: {
            message: "Bookmark url is not a valid url"
          }
        }
      }
    });
  }

  return bookmarkService
    .add(req.userId, {
      url: req.body.url,
      title: req.body.title,
      description: req.body.description
    })
    .then(data => res.status(200).send(data));
};

const updateBookmark = (req, res) => {
  const bookmarkId = req.params.id;
  const updatedData = {
    url: req.body.url,
    title: req.body.title,
    description: req.body.description
  };

  bookmarkService
    .updateByIdFromUser(req.userId, bookmarkId, updatedData)
    .then(bookmark => {
      if (!bookmark) {
        return res
          .status(404)
          .send({ error: "Bookmark not found for the user" });
      }
      return res.status(200).send(bookmark);
    })
    .catch(err => res.status(500).send({ error: err }));
};

const deleteBookmark = (req, res) => {
  const bookmarkId = req.params.id;

  bookmarkService
    .deleteFromUser(req.userId, bookmarkId)
    .then(bookmark => {
      if (!bookmark) {
        return res
          .status(404)
          .send({ error: "Bookmark not found for the user" });
      }
      return res.status(200).send(bookmark);
    })
    .catch(err => res.status(500).send({ error: err }));
};

module.exports = {
  getBookmarks,
  getBookmark,
  addBookmark,
  updateBookmark,
  deleteBookmark
};
