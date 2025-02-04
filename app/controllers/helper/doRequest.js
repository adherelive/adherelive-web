import { createLogger } from "../../../libs/logger";

const axios = require('axios');

const logger = createLogger("HELPER DO REQUEST");

module.exports = async (value) =>
  new Promise((resolve, reject) => {
    axios.get(value).then((response) => {
        logger.debug("Response data for DoRequest Helper: ", response.data);
    }).catch((error) => {
        logger.error("Error in the Helper for DoRequest: ", error);
    });
  });
