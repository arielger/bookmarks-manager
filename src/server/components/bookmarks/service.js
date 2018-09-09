const Bookmarks = require("./model");

const getAllFromUser = userId =>
  Bookmarks.findAll({
    where: { userId }
  });

const getByIdFromUser = (userId, id) =>
  Bookmarks.findOne({ where: { id, userId } });

const add = (userId, bookmark) =>
  Bookmarks.create({
    ...bookmark,
    userId
  });

const updateByIdFromUser = (userId, bookmarkId, updatedData) =>
  Bookmarks.update(updatedData, {
    returning: true,
    where: { userId, id: bookmarkId }
  }).then(([, [updatedBookmark]]) => Promise.resolve(updatedBookmark));

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
  updateByIdFromUser,
  deleteFromUser
};
