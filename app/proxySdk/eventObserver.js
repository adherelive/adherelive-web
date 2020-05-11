const { Proxy_Sdk, EVENTS } = require(".");
const eventExecutor = require("./eventExecutor");
const Logger = require("./libs/logger");
const Log = require("../../libs/log")("proxySdk:EventObserver");

const {
  SEND_EMAIL,
  SEND_SMS,
  SEND_NOTIFICATION,
  EMAIL_ERROR,
  NOTIFICATION_ERROR,
  SMS_ERROR
} = EVENTS;

class EventObserver {
  constructor() {
    this._event = Proxy_Sdk;
  }

  async errorEventHandler(err, type) {
    try {
      let logger = new Logger("event_error", {
        eventType: type,
        errorData: err
      });
      logger.log();
    } catch (err) {
      throw err;
    }
  }

  runObservers() {
    this._event.on(SEND_EMAIL, eventExecutor.sendMail);

    Log.info(`Observing EMAIL events..!!`);
    this._event.on(SEND_SMS, eventExecutor.sendSms);
    Log.info(`Observing SMS events..!!`);

    //error event observers
    Log.info(`Observing EMAIL ERROR events..!!`);
    this._event.on(EMAIL_ERROR, this.errorEventHandler);

    Log.info(`Observing SMS ERROR events..!!`);
    this._event.on(SMS_ERROR, this.errorEventHandler);
  }
}

module.exports = new EventObserver();
