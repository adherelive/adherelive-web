const through2 = require("through2");
let payloadBuilder = require("../libs/payloadBuilder");

function transform() {
  console.log("stream transformation started!!!");
  return through2.obj(function (chunk, enc, callback) {
    // console.log("chunk at transform stream", chunk);
    //let data = chunk.toString();
    let payload = payloadBuilder(chunk).getBuild();
    // console.log("payload", payload);
    this.push(JSON.stringify(payload));
  });
}

module.exports = transform;
