const sequelize = require("../database");

const globalSetup = async () => {
  await sequelize.sync({
    force: true
  });
  // eslint-disable-next-line no-console
  console.log("💾 Database sync finished");
};

module.exports = globalSetup;
