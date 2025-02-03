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
    log.debug(`Observing FOLLOWUP activity..!!`);
    ReminderActivity.runObservers();
    log.debug(`Observing REMINDER activity..!!`);
    MedicationReminderActivity.runObservers();
    log.debug(`Observing MEDICATION_REMINDER activity..!!`);
  }
}

module.exports = new ActivityObserver();
