const Tags = require("./model");

const getAllFromUser = userId =>
  Tags.findAll({
    where: { userId }
  });

const getByIdFromUser = (userId, id) =>
  Tags.findById(id, { where: { userId } });

const add = (userId, tag) =>
  Tags.create({
    ...tag,
    userId
  });

module.exports = {
  add,
  getAllFromUser,
  getByIdFromUser
};
