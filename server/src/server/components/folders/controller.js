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
  const folderData = R.pick(["title"], req.body);

  const validationResult = Joi.validate(folderData, folderValidator);

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
    .add(req.userId, folderData)
    .then(data => res.status(200).send(data));
};

module.exports = {
  getFolders,
  addFolder
};
