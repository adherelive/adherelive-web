let through2 = require("through2");
let payloadValidator = require("../libs/validator");

function validate() {
  try {
    return through2.obj(function (chunk, enc, callback) {
      let data = JSON.parse(chunk.toString());
      let isValid = payloadValidator(data).isValid();
      if (isValid) {
        this.push(data);
      } else {
      }
      // callback();
    });
  } catch (err) {
    throw err;
  }
}

module.exports = validate;
