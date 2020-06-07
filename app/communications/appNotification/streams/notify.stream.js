let through2 = require("through2");
let Notfier = require("../libs/notify");

function notifier() {
  try {
    return through2(function(chunk, enc, callback) {
      //let data = chunk.toString();
      // console.log("chunk  at notify stream", chunk.toString());
      let data = JSON.parse(chunk.toString());
      // console.log("notification stream data", data);
      Notfier(data)
        .connect()
        .verb("create-reminder")
        .sendNotification();
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = notifier;
