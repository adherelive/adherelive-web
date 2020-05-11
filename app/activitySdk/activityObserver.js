import FollowUpActivity from "./followUp";
import MedicationActivity from "./medication";
import MaterialDeliveryActivity from "./materialDelivery";
import AdverseEventActivity from "./adverseEvent";
import ReminderActivity from "./reminder";
import MedicationReminderActivity from "./medicationReminder";

const Log = require("../../libs/log")("activitySdk:ActivityObserver");

class ActivityObserver {
  constructor() {}

  runObservers() {
    FollowUpActivity.runObservers();
    Log.info(`Observing FOLLOWUP activity..!!`);
    MedicationActivity.runObservers();
    Log.info(`Observing MEDICATION activity..!!`);
    MaterialDeliveryActivity.runObservers();
    Log.info(`Observing MATERIAL_DELIVERY activity..!!`);
    AdverseEventActivity.runObservers();
    Log.info(`Observing ADVERSE_EVENT activity..!!`);
    ReminderActivity.runObservers();
    Log.info(`Observing REMINDER activity..!!`);
    MedicationReminderActivity.runObservers();
    Log.info(`Observing MEDICATION_REMINDER activity..!!`);
  }
}

module.exports = new ActivityObserver();
