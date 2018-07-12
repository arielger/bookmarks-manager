const Bookmarks = require("../models").Bookmark;

const getAll = () => Bookmarks.findAll();

const getById = id => Bookmarks.findById(id);

const add = bookmark => Bookmarks.create(bookmark);

module.exports = {
  add,
  getAll,
  getById
};
