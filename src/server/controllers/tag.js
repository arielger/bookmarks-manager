const tagService = require("../services/tag");

const getTags = (req, res) => {
  tagService.getAll().then(data => res.send(data));
};

const getTag = (req, res) => {
  tagService.getById(req.params.id).then(data => res.send(data));
};

const addTag = (req, res) => {
  tagService
    .add({
      url: req.body.url
    })
    .then(data => res.send(data));
};

module.exports = {
  getTags,
  getTag,
  addTag
};
