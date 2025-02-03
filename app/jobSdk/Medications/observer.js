import { EVENT_STATUS, NOTIFICATION_STAGES } from "../../../constant";
import CreateJob from "./createJob";
import StartJob from "./startJob";
import UpdateJob from "./updateJob";
import DeleteJob from "./deleteJob";

class MedicationObserver {
  constructor() {}

  execute = (typeStatus, eventDetails) => {
    log.debug("medication observer called", { typeStatus, eventDetails });
    switch (typeStatus) {
      case EVENT_STATUS.SCHEDULED:
        return new CreateJob(eventDetails);
      case EVENT_STATUS.STARTED:
        return new StartJob(eventDetails);
      case NOTIFICATION_STAGES.UPDATE:
        return new UpdateJob(eventDetails);
      case NOTIFICATION_STAGES.DELETE:
        return new DeleteJob(eventDetails);
    }
  };
}

export default new MedicationObserver();
