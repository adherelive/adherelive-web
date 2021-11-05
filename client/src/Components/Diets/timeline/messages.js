import { defineMessages } from "react-intl";

const messages = defineMessages({
  completed: {
    id: "app.diet.timeline.completed.text",
    description: "",
    defaultMessage: "Diet Captured for - {time_text}",
  },
  expired: {
    id: "app.diet.timeline.expired.text",
    description: "",
    defaultMessage: "Not Captured",
  },
  not_recorded: {
    id: "app.diet.timeline.not.recorded.text",
    description: "",
    defaultMessage: "Not Recorded",
  },
  taken: {
    id: "app.diet.timeline.taken",
    description: "",
    defaultMessage: "Taken",
  },
  cancelled_reschedule: {
    id: "app.diet.timeline.cancelled.reschedule",
    description: "",
    defaultMessage: "(Cancelled) Reschedule in 10 minutes",
  },
});

export default messages;
