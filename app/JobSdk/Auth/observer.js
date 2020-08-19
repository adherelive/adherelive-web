import {EVENT_TYPE} from "../../../constant";
import OtpJob from "./otpJob";
import AddPatientJob from "./addPatientJob";

class AuthObserver {
    constructor() {
    }

    execute = (typeStatus, eventDetails) => {
        switch(typeStatus) {
            case EVENT_TYPE.OTP:
                return new OtpJob(eventDetails);
            case EVENT_TYPE.ADD_PATIENT:
                return new AddPatientJob(eventDetails);
        }
    };
}

export default new AuthObserver();