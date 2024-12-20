import { EventEmitter } from "events";
import { ACTIVITIES, STAGES } from "./activityType";
import { ACTIVITY_TYPE, EVENT_TYPE } from "../../constant";
// const log = require("../../libs/log")("ACTIVITY_SDK");
import Log from "../../libs/log";
const log = Log("ACTIVITY_SDK");

class Activity extends EventEmitter {
  constructor() {
    super();
  }

  executeAppointment({ activityType, stage, data }) {
    switch (activityType) {
      case ACTIVITY_TYPE.FOLLOWUP:
        this.emit(ACTIVITIES.FOLLOW_UP[stage], data);
        break;
      default:
        log.warn(`Invalid Activity Type: ${activityType}`);
    }
  }

  execute(args) {
    const { eventType, activityType, stage, data } = args;
    log.info(`initial ${eventType}, ${stage}, ${activityType}, ${data}`);
    //add validation for parameter here
    switch (eventType) {
      case EVENT_TYPE.APPOINTMENT:
        this.executeAppointment({ activityType, stage, data });
        break;
      case EVENT_TYPE.REMINDER:
        this.emit(ACTIVITIES.REMINDER[stage], data);
        break;
      case EVENT_TYPE.MEDICATION_REMINDER:
        this.emit(ACTIVITIES.MEDICATION_REMINDER[stage], data);
        break;
      default:
        log.warn(`Invalid Event Type: ${eventType}`);
    }
  }
}

const ActivitySdk = new Activity();

module.exports = { ActivitySdk, STAGES };
