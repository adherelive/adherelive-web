import FollowUpActivity from "./followUp";
import ReminderActivity from "./reminder";
import MedicationReminderActivity from "./medicationReminder";
import { createLogger } from "../../libs/logger";

const logger = createLogger("activitySdk:ActivityObserver");

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
    logger.debug(`Observing FOLLOWUP activity!`);
    ReminderActivity.runObservers();
    logger.debug(`Observing REMINDER activity!`);
    MedicationReminderActivity.runObservers();
    logger.debug(`Observing MEDICATION_REMINDER activity!`);
  }
}

module.exports = new ActivityObserver();
