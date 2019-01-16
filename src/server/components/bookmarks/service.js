const db = require("../../database/models");

const { Bookmark } = db;

const getAllFromUser = userId =>
  Bookmark.findAll({
    where: { userId }
  });

const getByIdFromUser = (userId, id) =>
  Bookmark.findOne({ where: { id, userId } });

const add = (userId, bookmark) =>
  Bookmark.create({
    ...bookmark,
    userId
  });

const updateByIdFromUser = (userId, bookmarkId, updatedData) =>
  Bookmark.update(updatedData, {
    returning: true,
    where: { userId, id: bookmarkId }
  }).then(([, [updatedBookmark]]) => Promise.resolve(updatedBookmark));

const deleteFromUser = (userId, id) =>
  Bookmark.findById(id, { where: { userId } }).then(bookmark => {
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
