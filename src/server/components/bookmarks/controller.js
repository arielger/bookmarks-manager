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
        return res.status(404).send("Bookmark not found for the user");
      }
      return res.status(200).send(bookmark);
    })
    .catch(err => res.status(500).send(err));
};

const addBookmark = (req, res) => {
  bookmarkService
    .add(req.userId, { url: req.body.url })
    .then(data => res.send(data));
};

const deleteBookmark = (req, res) => {
  const bookmarkId = req.params.id;

  bookmarkService
    .deleteFromUser(req.userId, bookmarkId)
    .then(bookmark => {
      if (!bookmark) {
        return res.status(404).send("Bookmark not found for the user");
      }
      return res.status(200).send(bookmark);
    })
    .catch(err => res.status(500).send(err));
};

module.exports = {
  getBookmarks,
  getBookmark,
  addBookmark,
  deleteBookmark
};
