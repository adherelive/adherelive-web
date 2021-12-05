import {EVENT_STATUS} from "../../../constant";
import CreateJob from "./createJob";

class CarePlanObserver {
  constructor() {
  }
  
  execute = (typeStatus, eventDetails) => {
    switch (typeStatus) {
      case EVENT_STATUS.SCHEDULED:
        return new CreateJob(eventDetails);
    }
  };
}

export default new CarePlanObserver();
