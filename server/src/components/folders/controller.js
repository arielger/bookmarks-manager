const R = require("ramda");
const Joi = require("joi");
const sequelizeToJoi = require("@revolttv/sequelize-to-joi").default;
const folderService = require("./service");
const db = require("../../database/models");

const { Folder } = db;

const folderValidator = sequelizeToJoi(Folder);

const getFolders = (req, res) =>
  folderService.getAllFromUser(req.userId).then(data => res.send(data));

const addFolder = (req, res) => {
  const validationResult = Joi.validate(req.body, folderValidator);

  if (validationResult.error) {
    return res.status(400).send({
      status: "failed",
      error: {
        original: validationResult.error._object, // eslint-disable-line no-underscore-dangle
        details: R.fromPairs(
          validationResult.error.details.map(({ message, type, path }) => [
            path,
            {
              message: message.replace(/['"]/g, ""),
              type
            }
          ])
        )
      }
    });
  }

  return folderService
    .add(req.userId, req.body)
    .then(data => res.status(200).send(data));
};

const updateFolder = (req, res) => {
  const folderId = req.params.id;

  const validationResult = Joi.validate(req.body, folderValidator);

  if (validationResult.error) {
    return res.status(400).send({
      status: "failed",
      error: {
        original: validationResult.error._object, // eslint-disable-line no-underscore-dangle
        details: R.fromPairs(
          validationResult.error.details.map(({ message, type, path }) => [
            path,
            {
              message: message.replace(/['"]/g, ""),
              type
            }
          ])
        )
      }
    });
  }

  return folderService
    .updateByIdFromUser(req.userId, folderId, req.body)
    .then(folder => {
      if (!folder) {
        return res.status(404).send({
          error: "Folder not found for the user"
        });
      }
      return res.status(200).send(folder);
    })
    .catch(err => res.status(500).send({ error: err }));
};

const deleteFolder = (req, res) => {
  const folderId = req.params.id;

  folderService
    .deleteFromUser(req.userId, folderId)
    .then(folder => {
      if (!folder) {
        return res.status(404).send({
          error: "Folder not found for the user"
        });
      }
      return res.status(200).send(folder);
    })
    .catch(err =>
      res.status(500).send({
        error: err
      })
    );
};

module.exports = {
  getFolders,
  addFolder,
  updateFolder,
  deleteFolder
};
