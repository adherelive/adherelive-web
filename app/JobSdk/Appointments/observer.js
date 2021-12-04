import {EVENT_STATUS, NOTIFICATION_STAGES} from "../../../constant";
import CreateJob from "./createJob";
import PriorJob from "./priorJob";
import StartJob from "./startJob";
import UpdateJob from "./updateJob";

class AppointmentObserver {
  constructor() {
  }
  
  execute = (typeStatus, eventDetails) => {
    switch (typeStatus) {
      case EVENT_STATUS.SCHEDULED:
        return new CreateJob(eventDetails);
      case EVENT_STATUS.PRIOR:
        return new PriorJob(eventDetails);
      case EVENT_STATUS.STARTED:
        return new StartJob(eventDetails);
      case NOTIFICATION_STAGES.UPDATE:
        return new UpdateJob(eventDetails);
    }
  };
}

export default new AppointmentObserver();
