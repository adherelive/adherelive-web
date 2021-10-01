import { NOTIFICATION_STAGES } from "../../../constant";
import CreateJob from "./createJob";
import StartJob from "./startJob";
import UpdateJob from "./updateJob";
import ResponseJob from "./responseJob";

class VitalObserver {
    constructor() {
    }

  execute = (typeStatus, eventDetails) => {
    switch (typeStatus) {
      case NOTIFICATION_STAGES.CREATE:
        return new CreateJob(eventDetails);
      case NOTIFICATION_STAGES.START:
        return new StartJob(eventDetails);
      case NOTIFICATION_STAGES.UPDATE:
        return new UpdateJob(eventDetails);
      case NOTIFICATION_STAGES.RESPONSE_ADDED:
        return new ResponseJob(eventDetails);
    }
  };
}

export default new VitalObserver();
