import {EVENT_TYPE, NOTIFICATION_VERB} from "../../../constant";
import OtpJob from "./otpJob";
import AddPatientJob from "./addPatientJob";
import DeactivateDoctorJob from "./deactivateDoctorJob";
import ActivateDoctorJob from "./activateDoctorJob";

class AuthObserver {
    constructor() {
    }

    execute = (typeStatus, eventDetails) => {
        switch(typeStatus) {
            case EVENT_TYPE.OTP:
                return new OtpJob(eventDetails);
            case EVENT_TYPE.ADD_PATIENT:
                return new AddPatientJob(eventDetails);
            case NOTIFICATION_VERB.DEACTIVATE_DOCTOR:
                return new DeactivateDoctorJob(eventDetails);
            case NOTIFICATION_VERB.ACTIVATE_DOCTOR:
                return new ActivateDoctorJob(eventDetails);
        }
    };
}

export default new AuthObserver();