require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    logging: true
  },
  test: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    logging: true
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    protocol: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: true
    },
    logging: true
  }
};
