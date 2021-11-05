import { defineMessages } from "react-intl";

const messages = defineMessages({
  dashboard: {
    id: "app.dashboard.header.dashboard",
    description: "",
    defaultMessage: "Dashboard",
  },
  patients: {
    id: "app.dashboard.content.patients",
    description: "",
    defaultMessage: "Patients",
  },
  patientExistError: {
    id: "app.dashboard.content.patientExistError",
    description: "",
    defaultMessage: "Patient already exist with same number!",
  },
  somethingWentWrongError: {
    id: "app.dashboard.content.somethingWentWrongError",
    description: "",
    defaultMessage: "Something went wrong",
  },
  graphs: {
    id: "app.dashboard.content.graphs",
    description: "",
    defaultMessage: "Graphs",
  },
  summary: {
    id: "app.dashboard.content.summary",
    description: "",
    defaultMessage: "Summary",
  },
  watchList: {
    id: "app.dashboard.content.watchList",
    description: "",
    defaultMessage: "Watch List",
  },
  critical_text: {
    id: "app.dashboard.graph.critical",
    description: "",
    defaultMessage: "Critical",
  },
  non_critical_text: {
    id: "app.dashboard.graph.non.critical",
    description: "",
    defaultMessage: "Non Critical",
  },
  compliant_text: {
    id: "app.dashboard.graph.compliant",
    description: "",
    defaultMessage: "Compliant",
  },
  non_compliant_text: {
    id: "app.dashboard.graph.non.compliant",
    description: "",
    defaultMessage: "Non Compliant",
  },
  no_graph_text: {
    id: "app.dashboard.graph.no.graph.text",
    description: "",
    defaultMessage: "Please add graphs from the menu above to display here",
  },
  phoneNo: {
    id: "app.dashboard.phoneNo",
    description: "",
    defaultMessage: "Phone Number",
  },
  searchPatient: {
    id: "app.dashboard.search.patient",
    description: "",
    defaultMessage: "Search Patient by name/phone number",
  },
  noMatch: {
    id: "app.dashboard.no.match",
    description: "",
    defaultMessage: "No Match found",
  },
});

export default messages;
