const db = require("../../database/models");

const { Folder } = db;

const getAllFromUser = userId =>
  Folder.findAll({
    where: { userId }
  });

const add = (userId, folder) =>
  Folder.create({
    ...folder,
    userId
  });

module.exports = {
  getAllFromUser,
  add
};
