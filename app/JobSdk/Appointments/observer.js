import { EVENT_STATUS } from "../../../constant";
import CreateJob from "./createJob";
import PriorJob from "./priorJob";
import StartJob from "./startJob";

class AppointmentObserver {
  constructor() {}

  execute = (typeStatus, eventDetails) => {
    switch (typeStatus) {
      case EVENT_STATUS.SCHEDULED:
        return new CreateJob(eventDetails);
      case EVENT_STATUS.PRIOR:
        return new PriorJob(eventDetails);
      case EVENT_STATUS.STARTED:
        return new StartJob(eventDetails);
    }
  };
}

export default new AppointmentObserver();
