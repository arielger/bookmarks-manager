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

const getByIdFromUser = (userId, id) =>
  Folder.findOne({ where: { id, userId } });

const updateByIdFromUser = (userId, folderId, updatedData) =>
  Folder.update(updatedData, {
    returning: true,
    where: { userId, id: folderId }
  }).then(([, [updatedFolder]]) => Promise.resolve(updatedFolder));

const deleteFromUser = (userId, id) =>
  Folder.findById(id, { where: { userId } }).then(folder => {
    if (!folder) return folder;
    folder.destroy();
    return folder;
  });

module.exports = {
  getAllFromUser,
  getByIdFromUser,
  add,
  updateByIdFromUser,
  deleteFromUser
};
