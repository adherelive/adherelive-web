import { defineMessages } from "react-intl";

const messages = defineMessages({
  somethingWentWrong: {
    id: "app.missedVitals.somethingWentWrong",
    description: "",
    defaultMessage: "Something went wrong.",
  },
  vital_header: {
    id: "app.missedVitals.vital.header",
    description: "",
    defaultMessage: "Missed Actions",
  },
  patient_name: {
    id: "app.missedVitals.patient.name",
    description: "",
    defaultMessage: "Patient",
  },
  vital_name: {
    id: "app.missedVitals.vital.name",
    description: "",
    defaultMessage: "Vital",
  },
  critical: {
    id: "app.missedVitals.critical",
    description: "",
    defaultMessage: "Critical",
  },

  non_critical: {
    id: "app.missedVitals.not.critical",
    description: "",
    defaultMessage: "Non critical",
  },
  no_critical_missed: {
    id: "app.missedVitals.no.critical.missed",
    description: "",
    defaultMessage: "No missed critical action",
  },
  no_non_critical_missed: {
    id: "app.missedVitals.no.non.critical.missed",
    description: "",
    defaultMessage: "No missed non critical action",
  },
});

export default messages;
