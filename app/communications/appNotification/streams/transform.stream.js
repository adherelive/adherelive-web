const through2 = require("through2");
let payloadBuilder = require("../libs/payloadBuilder");

function transform() {
  return through2.obj(function (chunk, enc, callback) {
    //let data = chunk.toString();
    let payload = payloadBuilder(chunk).getBuild();

    this.push(JSON.stringify(payload));
  });
}

module.exports = transform;
