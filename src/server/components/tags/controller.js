const tagService = require("./service");

const getTags = (req, res) => {
  tagService.getAllFromUser(req.userId).then(data => res.send(data));
};

const getTag = (req, res) => {
  tagService
    .getByIdFromUser(req.userId, req.params.id)
    .then(tag => {
      if (!tag) return res.status(404).send("Tag not found for the user");
      return res.status(200).send(tag);
    })
    .catch(err => res.status(500).send(err));
};

const addTag = (req, res) => {
  tagService
    .add(req.userId, { url: req.body.url })
    .then(data => res.send(data));
};

module.exports = {
  getTags,
  getTag,
  addTag
};
