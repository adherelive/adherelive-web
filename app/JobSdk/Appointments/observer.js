import {EVENT_STATUS} from "../../../constant";
import CreateJob from "./createJob";

class AppointmentObserver {
    constructor() {
    }

    execute = (typeStatus, eventDetails) => {
        switch(typeStatus) {
            case EVENT_STATUS.SCHEDULED:
                return new CreateJob(eventDetails);
            case EVENT_STATUS.PENDING:
                // return new PriorJob(eventDetails);
        }
    };
}

export default new AppointmentObserver();