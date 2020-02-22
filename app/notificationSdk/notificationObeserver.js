import EmailNotification from "./email";
import SmsNotification from "./sms";
import PushAppNotification from "./pushApp";

const Log = require("../../libs/log")("notificationSdk:notificationObserver");

class NotificationObserver {
  constructor() {}

  runObservers() {
    EmailNotification.runObservers();
    Log.info(`Observing EMAIL Notification..!!`);
    SmsNotification.runObservers();
    Log.info(`Observing SMS Notification..!!`);
    PushAppNotification.runObservers();
    Log.info(`Observing PUSH_APP Notification..!!`);
  }
}

module.exports = new NotificationObserver();
