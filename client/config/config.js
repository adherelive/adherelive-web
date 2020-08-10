const dotenv = require("dotenv");

module.exports = () => {
  dotenv.load();
  process.config = {
    WEB_URL: process.env.WEB_URL,
  };
};
