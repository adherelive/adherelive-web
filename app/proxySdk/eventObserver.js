import { EVENTS, Proxy_Sdk } from ".";
import eventExecutor from "./eventExecutor";

import { createLogger } from "../../libs/log";
import { createLogger } from "./libs/logger";

const log = createLogger("proxySdk:EventObserver");

const {
  SEND_EMAIL,
  SEND_SMS,
  SEND_NOTIFICATION,
  EMAIL_ERROR,
  NOTIFICATION_ERROR,
  SMS_ERROR,
} = EVENTS;

class EventObserver {
  constructor() {
    this._event = Proxy_Sdk;
  }

  async errorEventHandler(err, type) {
    try {
      let logger = new Logger("event_error", {
        eventType: type,
        errorData: err,
      });
      await logger.log();
    } catch (err) {
      throw err;
    }
  }

  runObservers() {
    this._event.on(SEND_EMAIL, eventExecutor.sendMail);

    log.info(`Observing EMAIL events..!!`);
    this._event.on(SEND_SMS, eventExecutor.sendSms);
    log.info(`Observing SMS events..!!`);

    //error event observers
    log.info(`Observing EMAIL ERROR events..!!`);
    this._event.on(EMAIL_ERROR, this.errorEventHandler);

    log.info(`Observing SMS ERROR events..!!`);
    this._event.on(SMS_ERROR, this.errorEventHandler);
  }
}

module.exports = new EventObserver();
