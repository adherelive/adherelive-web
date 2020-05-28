import { defineMessages } from "react-intl";
import messages from "../PatientDetails/message";

const message = defineMessages({
    add_appointment: {
        id: "app.drawer.add.appointment.title",
        description: "",
        defaultMessage: "New Appointment"
    },
    patient: {
        id: "app.drawer.add.appointment.patient",
        description: "",
        defaultMessage: "Patient"
    },
    select_patient: {
        id: "app.drawer.add.appointment.select.patient",
        description: "",
        defaultMessage: "Select Patient"
    }
});

export default message;