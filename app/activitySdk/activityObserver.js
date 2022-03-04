import FollowUpActivity from "./followUp";
import ReminderActivity from "./reminder";
import MedicationReminderActivity from "./medicationReminder";

const Log = require("../../libs/log")("activitySdk:ActivityObserver");

class ActivityObserver {
  constructor() {}

  runObservers() {
    FollowUpActivity.runObservers();
    Log.info(`Observing FOLLOWUP activity..!!`);
    ReminderActivity.runObservers();
    Log.info(`Observing REMINDER activity..!!`);
    MedicationReminderActivity.runObservers();
    Log.info(`Observing MEDICATION_REMINDER activity..!!`);
  }
}

module.exports = new ActivityObserver();
