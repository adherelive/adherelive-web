import {NOTIFICATION_STAGES} from "../../../constant";
import CreateJob from "./createJob";

class VitalObserver {
    constructor() {
    }

    execute = (typeStatus, eventDetails) => {
        switch(typeStatus) {
            case NOTIFICATION_STAGES.CREATE:
                return new CreateJob(eventDetails);
        }
    };
}

export default new VitalObserver();