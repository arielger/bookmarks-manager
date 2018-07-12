const bookmarkService = require("../services/bookmark");

const getBookmarks = (req, res) => {
  bookmarkService.getAll().then(data => res.send(data));
};

const getBookmark = (req, res) => {
  bookmarkService.getById(req.params.id).then(data => res.send(data));
};

const addBookmark = (req, res) => {
  bookmarkService
    .add({
      url: req.body.url
    })
    .then(data => res.send(data));
};

module.exports = {
  getBookmarks,
  getBookmark,
  addBookmark
};
