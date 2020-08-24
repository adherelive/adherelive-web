import {EVENT_STATUS} from "../../../constant";
import CreateJob from "./createJob";

class MedicationObserver {
    constructor() {
    }

    execute = (typeStatus, eventDetails) => {
        switch(typeStatus) {
            case EVENT_STATUS.SCHEDULED:
                return new CreateJob(eventDetails);
        }
    };
}

export default new MedicationObserver();