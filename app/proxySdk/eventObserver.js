import { EVENTS, Proxy_Sdk } from ".";
import eventExecutor from "./eventExecutor";

import { createLogger } from "../../libs/log";
import Logger from "./libs/logger";

const logger = createLogger("ProxySDK Event Logging");

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
      let eventHandlerLogger = new Logger("event_error", {
        eventType: type,
        errorData: err,
      });
      await eventHandlerLogger.log();
    } catch (err) {
      throw err;
    }
  }

  runObservers() {
    logger.info(`Observing EMAIL events!`);
    this._event.on(SEND_EMAIL, eventExecutor.sendMail);

    logger.info(`Observing SMS events!`);
    this._event.on(SEND_SMS, eventExecutor.sendSms);

    //error event observers
    logger.info(`Observing EMAIL ERROR events!`);
    this._event.on(EMAIL_ERROR, this.errorEventHandler);

    logger.info(`Observing SMS ERROR events!`);
    this._event.on(SMS_ERROR, this.errorEventHandler);
  }
}

module.exports = new EventObserver();
