import FollowUpActivity from "./followUp";
import ReminderActivity from "./reminder";
import MedicationReminderActivity from "./medicationReminder";
import { createLogger } from "../../libs/log";

const log = createLogger("activitySdk:ActivityObserver");

/**
 *
 *
 * @class ActivityObserver
 */
class ActivityObserver {
  constructor() {}

  /**
   * Run the Observer for Events
   *
   * @returns
   */
  runObservers() {
    FollowUpActivity.runObservers();
    log.info(`Observing FOLLOWUP activity!`);
    ReminderActivity.runObservers();
    log.info(`Observing REMINDER activity!`);
    MedicationReminderActivity.runObservers();
    log.info(`Observing MEDICATION_REMINDER activity!`);
  }
}

module.exports = new ActivityObserver();
