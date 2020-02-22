const emailLoggerModel = require("../../models/emailLogger");
const smsLoggerModel = require("../../models/smsLogger");
const eventErrorLoggerModel = require("../../models/eventErrorLogger");
class Logger {
  constructor(type, payload) {
    switch (type) {
      case "email":
        this._model = emailLoggerModel;
        break;
      case "sms":
        this._model = smsLoggerModel;
        break;
      case "event_error":
        this._model = eventErrorLoggerModel;
      default:
        break;
    }

    this.loggerPayload = payload;
  }

  async log() {
    if (!this.loggerPayload) throw new Error("Invalid data to log");
    let result = new this._model(this.loggerPayload);
  }
}

module.exports = Logger;
