const Tags = require("../models").Tag;

const getAll = () => Tags.findAll();

const getById = id => Tags.findById(id);

const add = tag => Tags.create(tag);

module.exports = {
  add,
  getAll,
  getById
};
