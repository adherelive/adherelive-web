import { EventEmitter } from "events";
import { NOTIFY_WITH } from "./notificationType";
import { json } from "body-parser";

const userService = require("../services/user/user.service");
const log = require("../../libs/log")("NOTIFICATION_SDK");

class Notification extends EventEmitter {
  constructor() {
    super();
  }

  notify = () => {};

  execute = async (userId, payload) => {
    //need to make below keys same

    console.log("payload====================>", payload);
    const {
      data: { eventType, eventCategory, userId: loggedInUser = "" } = {}
    } = payload;
    const isReminder = eventType === "reminder" || eventCategory === "reminder";

    const user = await userService.getUser({ _id: userId });
    if (!user && user === null) {
      return;
    }
    const {
      _id,
      contactNo: { verified: contactNoVerified } = {},
      settings: {
        preferences: { smsAlerts, emailAlerts, pushAlerts, reminderAlerts }
      } = {}
    } = user;

    log.info(
      smsAlerts,
      emailAlerts,
      pushAlerts,
      reminderAlerts,
      isReminder,
      contactNoVerified
    );

    if (isReminder && !reminderAlerts) {
      return;
    }
    if (
      smsAlerts &&
      contactNoVerified &&
      JSON.stringify(loggedInUser) !== JSON.stringify(_id)
    ) {
      this.emit(NOTIFY_WITH.SMS, { payload: payload, user: user });
    }
    if (emailAlerts) {
      this.emit(NOTIFY_WITH.EMAIL, { payload: payload, user: user });
    }
    if (pushAlerts && JSON.stringify(loggedInUser) !== JSON.stringify(_id)) {
      this.emit(NOTIFY_WITH.PUSH_APP, {
        payLoad: payload,
        user: user,
        actor: loggedInUser
      });
    }
  };
}

const NotificationSdk = new Notification();

module.exports = { NotificationSdk };
