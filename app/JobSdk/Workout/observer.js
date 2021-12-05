import {EVENT_STATUS, NOTIFICATION_STAGES} from "../../../constant";
import CreateJob from "./createJob";
import StartJob from "./startJob";
import PriorJob from "./priorJob";
import ResponseJob from "./responseJob";

class WorkoutObserver {
  constructor() {
  }
  
  execute = (typeStatus, eventDetails) => {
    switch (typeStatus) {
      case EVENT_STATUS.SCHEDULED:
        return new CreateJob(eventDetails);
      case EVENT_STATUS.STARTED:
        return new StartJob(eventDetails);
      case EVENT_STATUS.PRIOR:
        return new PriorJob(eventDetails);
      case NOTIFICATION_STAGES.RESPONSE_ADDED:
        return new ResponseJob(eventDetails);
    }
  };
}

export default new WorkoutObserver();
