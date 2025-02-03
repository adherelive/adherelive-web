const emailLoggerModel = require("../../models/emailLogger");
// const smsLoggerModel = require("../../models/smsLogger");
// const eventErrorLoggerModel = require("../../models/eventErrorLogger");

class Logger {
    constructor(type, payload) {
        // Optional safeguard
        if (!(this instanceof Logger)) {
            throw new Error("Use 'new' to instantiate Logger");
        }

        switch (type) {
            case "email":
                this._model = emailLoggerModel;
                break;
            case "sms":
                // this._model = smsLoggerModel;
                break;
            case "event_error":
                // this._model = eventErrorLoggerModel;
                break;
            default:
                // throw new Error(`Unsupported logger type: ${type}`);
                break;
        }

        this.loggerPayload = payload;
    }

    async log() {
        if (!this.loggerPayload) throw new Error("Invalid data to log");
        // Uncomment and implement the actual logging logic here
        // let result = new this._model(this.loggerPayload);
        // await result.save();
    }

    // info(message) {
    //     log.debug(`[INFO] ${message}`);
    // }
}

module.exports = Logger;
