const bookmarkService = require("./service");

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
  bookmarkService
    .add(req.userId, {
      url: req.body.url,
      title: req.body.title,
      description: req.body.description
    })
    .then(data => res.send(data));
};

const updateBookmark = (req, res) => {
  const bookmarkId = req.params.id;
  const updatedData = {
    url: req.body.url
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
