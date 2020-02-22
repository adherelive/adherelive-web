const mongoose = require("mongoose");
const Log = require("../libs/log")("mongo");

class Mongo {
  constructor(configUrl) {
    if (!configUrl) {
      this.configUrl = `${process.config.db.connection}://${
        process.config.db.username
      }:${process.config.db.password}@${process.config.db.host}:${
        process.config.db.port
      }/${process.config.db.database}`;
    } else {
      this.configUrl = configUrl;
    }
    console.log("this.configUrl", this.configUrl);

    // this.configUrl =
    //   configUrl == "" ? "mongodb://localhost:27017/rpm" : configUrl;
    //console.log("config url: ", this.configUrl);
    this.db = mongoose.connect(this.configUrl, { useNewUrlParser: true });
    mongoose.connection
      .on("error", err => {
        Log.warn(`Couldn't connect MongoDb`);
        Log.errLog(1000, "Mongo Constructor", err);
      })
      .on("open", () => {
        Log.info("Connection Established!!");
      });
  }

  getConnection() {
    return this.db;
  }

  disconnectConnection() {
    mongoose.connection.close();
  }
}

module.exports = Mongo;
