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
    },
    start_date: {
        id: "app.drawer.add.appointment.start.date",
        description: "",
        defaultMessage: "Start Date"
    },
    start_time: {
        id: "app.drawer.add.appointment.start.time",
        description: "",
        defaultMessage: "Start Time"
    },
    end_time: {
        id: "app.drawer.add.appointment.end.time",
        description: "",
        defaultMessage: "End Time"
    },
    submit_text: {
        id: "app.drawer.add.appointment.submit",
        description: "",
        defaultMessage: "Submit"
    },
});

export default message;