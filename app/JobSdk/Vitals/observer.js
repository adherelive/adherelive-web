import {NOTIFICATION_STAGES} from "../../../constant";
import CreateJob from "./createJob";
import StartJob from "./startJob";
import UpdateJob from "./updateJob";

class VitalObserver {
    constructor() {
    }

    execute = (typeStatus, eventDetails) => {
        switch(typeStatus) {
            case NOTIFICATION_STAGES.CREATE:
                return new CreateJob(eventDetails);
            case NOTIFICATION_STAGES.START:
                return new StartJob(eventDetails);
            case NOTIFICATION_STAGES.UPDATE:
                return new UpdateJob(eventDetails);
        }
    };
}

export default new VitalObserver();