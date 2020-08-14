import AppointmentJob from "../";

class CreateJob extends AppointmentJob {
    constructor(data) {
        super(data);
    }

    getEmailTemplate = () => {};

    getSmsTemplate = () => {};

    getPushAppTemplate = () => {};

    getInAppTemplate = () => {};
}