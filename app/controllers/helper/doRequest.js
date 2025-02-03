const axios = require('axios');

module.exports = async (value) =>
  new Promise((resolve, reject) => {
    axios.get(value).then((response) => {
        log.info(response.data);
    }).catch((error) => {
        log.error(error);
    });
  });
