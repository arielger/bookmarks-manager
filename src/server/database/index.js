const Sequelize = require("sequelize");
const config = require("./config");

const envConfig = config.development;

const sequelize = new Sequelize(
  envConfig.database,
  envConfig.username,
  envConfig.password,
  {
    dialect: "postgres",
    host: envConfig.host,
    port: process.env.DB_DEVELOPMENT_PORT,
    logging: false
  }
);

require("sequelize-values")(sequelize);

module.exports = sequelize;
