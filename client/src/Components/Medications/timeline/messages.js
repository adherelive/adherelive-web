import { defineMessages } from "react-intl";

const messages = defineMessages({
  completed: {
    id: "app.medication.timeline.completed.text",
    description: "",
    defaultMessage: "Completed",
  },
  expired: {
    id: "app.medication.timeline.expired.text",
    description: "",
    defaultMessage: "Expired",
  },
  not_recorded: {
    id: "app.medication.timeline.not.recorded.text",
    description: "",
    defaultMessage: "Not Recorded",
  },
  taken: {
    id: "app.medication.timeline.taken",
    description: "",
    defaultMessage: "Taken",
  },
  cancelled_reschedule: {
    id: "app.medication.timeline.cancelled.reschedule",
    description: "",
    defaultMessage: "(Cancelled) Reschedule in 10 minutes",
  },
});

export default messages;
