const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DEVELOPMENT_DATABASE,
  process.env.DB_DEVELOPMENT_USERNAME,
  process.env.DB_DEVELOPMENT_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_DEVELOPMENT_HOST,
    port: process.env.DB_DEVELOPMENT_PORT
  }
);

require("sequelize-values")(sequelize);

// Force sync all models
sequelize.sync({ force: true });

module.exports = sequelize;
