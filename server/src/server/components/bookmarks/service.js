const db = require("../../database/models");

const { Bookmark } = db;

const getFromUser = (userId, pageSize, page, folderId) =>
  Bookmark.findAndCountAll({
    where: {
      userId,
      ...(folderId ? { folderId } : {})
    },
    limit: pageSize,
    offset: (page - 1) * pageSize
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
  getFromUser,
  getByIdFromUser,
  updateByIdFromUser,
  deleteFromUser
};
