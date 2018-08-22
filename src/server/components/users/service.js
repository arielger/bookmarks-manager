const Users = require("./model");

const add = user => Users.create(user);

module.exports = {
    add
};
