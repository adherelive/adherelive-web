let through2 = require("through2");
let payloadValidator = require("../libs/validator");

function validate() {
  try {
    console.log("stream validation started");
    return through2.obj(function(chunk, enc, callback) {
      // console.log("chunk at validate stream", chunk.toString());
      let data = JSON.parse(chunk.toString());
      let isValid = payloadValidator(data).isValid();
      if (isValid) {
        // console.log("data at validate stream", data);
        this.push(data);
      } else {
        // console.log("rejecting chunk due to invalid payload :", data);
      }
      // callback();
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = validate;
