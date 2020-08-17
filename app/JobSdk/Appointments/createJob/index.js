import AppointmentJob from "../";

class CreateJob extends AppointmentJob {
    constructor(data) {
        super(data);
    }

    getEmailTemplate = () => {
        const {getAppointmentData} = this;
        const {details: {} = {}} = getAppointmentData() || {};

        const templateData = [];

        return templateData;
    };

    getSmsTemplate = () => {};

    getPushAppTemplate = () => {};

    getInAppTemplate = () => {};
}

export default CreateJob;