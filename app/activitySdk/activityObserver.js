import FollowUpActivity from "./followUp";
import ReminderActivity from "./reminder";
import MedicationReminderActivity from "./medicationReminder";
import Log from "../../libs/log";

const log = new Log("activitySdk:ActivityObserver");

//const Log = require("../../libs/log")("activitySdk:ActivityObserver");

class ActivityObserver {
  constructor() {}

  runObservers() {
    FollowUpActivity.runObservers();
    log.info(`Observing FOLLOWUP activity..!!`);
    ReminderActivity.runObservers();
    log.info(`Observing REMINDER activity..!!`);
    MedicationReminderActivity.runObservers();
    log.info(`Observing MEDICATION_REMINDER activity..!!`);
  }
}

module.exports = new ActivityObserver();
