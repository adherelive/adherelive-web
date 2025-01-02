const dotenv = require("dotenv").config();

module.exports = {
  development: {
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
  },
  test: {
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
  },
  production: {
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
  },
};
