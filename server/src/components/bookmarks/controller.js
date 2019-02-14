const R = require("ramda");
const Joi = require("joi");
const cheerio = require("cheerio");
const axios = require("axios");
const sequelizeToJoi = require("@revolttv/sequelize-to-joi").default;
const { isURL } = require("validator");
const bookmarkService = require("./service");
const folderService = require("../folders/service");
const db = require("../../database/models");

const isValidNumber = R.both(R.is(Number), R.complement(R.equals(NaN)));

const { Bookmark } = db;

const bookmarkValidator = sequelizeToJoi(Bookmark);

// Default to page title or description if they are not defined
const getBookmarkDefaults = async bookmark => {
  if (bookmark.title && bookmark.description) return bookmark;

  try {
    const { data } = await axios.get(bookmark.url);

    const $ = cheerio.load(data);
    return R.pipe(
      R.unless(R.has("title"), R.assoc("title", $("title").text())),
      R.unless(
        R.has("description"),
        R.assoc("description", $("meta[name=description]").attr("content"))
      )
    )(bookmark);
  } catch (error) {
    return bookmark;
  }
};

// @todo: Implement filtering, sorting
const getBookmarks = (req, res) => {
  const PAGE_SIZE = 10;
  const page = R.pipe(
    n => parseInt(n, 10),
    R.when(R.either(R.complement(isValidNumber), R.gt(1)), R.always(1))
  )(req.query.page);

  const folderId = R.pipe(
    n => parseInt(n, 10),
    R.when(R.complement(isValidNumber), R.always(undefined))
  )(req.query.folderId);

  bookmarkService
    .getFromUser({
      userId: req.userId,
      pageSize: PAGE_SIZE,
      page,
      folderId,
      search: req.query.search
    })
    .then(result => {
      const pageCount = Math.ceil(result.count / PAGE_SIZE);
      const morePagesAvailable = pageCount > page;

      return res.send({
        info: {
          count: result.count,
          pages: pageCount,
          morePagesAvailable
        },
        results: result.rows
      });
    });
};

const getBookmark = (req, res) => {
  const bookmarkId = req.params.id;

  bookmarkService
    .getByIdFromUser(req.userId, bookmarkId)
    .then(bookmark => {
      if (!bookmark) {
        return res.status(404).send({
          error: "Bookmark not found for the user"
        });
      }
      return res.status(200).send(bookmark);
    })
    .catch(err =>
      res.status(500).send({
        error: err
      })
    );
};

const addBookmark = async (req, res) => {
  const bookmarkData = R.pick(
    ["url", "title", "description", "folderId"],
    req.body
  );

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

  if (bookmarkData.folderId) {
    const folder = await folderService.getByIdFromUser(
      req.userId,
      bookmarkData.folderId
    );
    if (!folder) {
      return res.status(400).send({
        error: `The user doesn't have any folder with the id: ${
          bookmarkData.folderId
        }`
      });
    }
  }

  return bookmarkService
    .add(req.userId, await getBookmarkDefaults(bookmarkData))
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
        return res.status(404).send({
          error: "Bookmark not found for the user"
        });
      }
      return res.status(200).send(bookmark);
    })
    .catch(err =>
      res.status(500).send({
        error: err
      })
    );
};

const deleteBookmark = (req, res) => {
  const bookmarkId = req.params.id;

  bookmarkService
    .deleteFromUser(req.userId, bookmarkId)
    .then(bookmark => {
      if (!bookmark) {
        return res.status(404).send({
          error: "Bookmark not found for the user"
        });
      }
      return res.status(200).send(bookmark);
    })
    .catch(err =>
      res.status(500).send({
        error: err
      })
    );
};

module.exports = {
  getBookmarks,
  getBookmark,
  addBookmark,
  updateBookmark,
  deleteBookmark
};
