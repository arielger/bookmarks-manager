const bookmarkService = require("./service");

const getBookmarks = (req, res) => {
  bookmarkService.getAllFromUser(req.userId).then(data => res.send(data));
};

const getBookmark = (req, res) => {
  bookmarkService
    .getByIdFromUser(req.userId, req.params.id)
    .then(bookmark => {
      if (!bookmark)
        return res.status(404).send("Bookmark not found for the user");
      return res.status(200).send(bookmark);
    })
    .catch(err => res.status(500).send(err));
};

const addBookmark = (req, res) => {
  bookmarkService
    .add(req.userId, { url: req.body.url })
    .then(data => res.send(data));
};

module.exports = {
  getBookmarks,
  getBookmark,
  addBookmark
};
