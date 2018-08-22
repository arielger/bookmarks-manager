const Sequelize = require("sequelize");

const sequelize = new Sequelize("bookmarks_manager", "", "", {
  dialect: "postgres",
  host: "localhost",
  port: 5432
});

require("sequelize-values")(sequelize);

// Force sync all models
sequelize.sync({ force: true });

module.exports = sequelize;
