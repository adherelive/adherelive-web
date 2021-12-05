import {EVENT_STATUS} from "../../../constant";
import StartJob from "./startJob";
import MissedJob from "./missedJob";

class AgoraObserver {
  constructor() {
  }
  
  execute = (typeStatus, eventDetails) => {
    switch (typeStatus) {
      case EVENT_STATUS.STARTED:
        return new StartJob(eventDetails);
      case EVENT_STATUS.EXPIRED:
        return new MissedJob(eventDetails);
    }
  };
}

export default new AgoraObserver();
