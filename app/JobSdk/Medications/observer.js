import { EVENT_STATUS } from "../../../constant";
import CreateJob from "./createJob";
import StartJob from "./startJob";

class MedicationObserver {
  constructor() {}

  execute = (typeStatus, eventDetails) => {
    switch (typeStatus) {
      case EVENT_STATUS.SCHEDULED:
        return new CreateJob(eventDetails);
      case EVENT_STATUS.STARTED:
        return new StartJob(eventDetails);
    }
  };
}

export default new MedicationObserver();
