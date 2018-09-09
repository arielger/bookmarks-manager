const Bookmarks = require("./model");

const getAllFromUser = userId =>
  Bookmarks.findAll({
    where: { userId }
  });

const getByIdFromUser = (userId, id) =>
  Bookmarks.findById(id, { where: { userId } });

const add = (userId, bookmark) =>
  Bookmarks.create({
    ...bookmark,
    userId
  });

const deleteFromUser = (userId, id) =>
  Bookmarks.findById(id, { where: { userId } }).then(bookmark => {
    if (!bookmark) return bookmark;
    bookmark.destroy();
    return bookmark;
  });

module.exports = {
  add,
  getAllFromUser,
  getByIdFromUser,
  deleteFromUser
};
