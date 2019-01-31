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

const updateByIdFromUser = (userId, folderId, updatedData) =>
  Folder.update(updatedData, {
    returning: true,
    where: { userId, id: folderId }
  }).then(([, [updatedFolder]]) => Promise.resolve(updatedFolder));

module.exports = {
  getAllFromUser,
  add,
  updateByIdFromUser
};
