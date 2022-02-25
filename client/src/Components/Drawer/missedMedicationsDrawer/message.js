import { defineMessages } from "react-intl";

const messages = defineMessages({
  somethingWentWrong: {
    id: "app.missedMedications.somethingWentWrong",
    description: "",
    defaultMessage: "Something went wrong.",
  },
  medication_header: {
    id: "app.missedMedications.medication.header",
    description: "",
    defaultMessage: "Missed Medications",
  },
  repeat_days: {
    id: "app.missedMedications.repeat.days",
    description: "",
    defaultMessage: "Repeat Days",
  },
  medicine_name: {
    id: "app.missedMedications.medicine.name",
    description: "",
    defaultMessage: "Medicine Name",
  },
  medicine_time: {
    id: "app.missedMedications.medicine.time",
    description: "",
    defaultMessage: "Time",
  },
  patient_name: {
    id: "app.missedMedications.patient.name",
    description: "",
    defaultMessage: "Patient",
  },
  critical: {
    id: "app.missedMedications.critical",
    description: "",
    defaultMessage: "Critical",
  },

  non_critical: {
    id: "app.missedMedications.not.critical",
    description: "",
    defaultMessage: "Non critical",
  },
  no_critical_missed: {
    id: "app.missedMedications.no.critical.missed",
    description: "",
    defaultMessage: "No missed critical medication",
  },
  no_non_critical_missed: {
    id: "app.missedMedications.no.non.critical.missed",
    description: "",
    defaultMessage: "No missed non critical medication",
  },
});

export default messages;
