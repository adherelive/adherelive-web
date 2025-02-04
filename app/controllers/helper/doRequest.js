const axios = require('axios');

module.exports = async (value) =>
  new Promise((resolve, reject) => {
    axios.get(value).then((response) => {
        logger.debug(response.data);
    }).catch((error) => {
        logger.error(error);
    });
  });
