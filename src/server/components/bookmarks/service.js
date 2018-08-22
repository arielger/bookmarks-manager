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

module.exports = {
  add,
  getAllFromUser,
  getByIdFromUser
};
