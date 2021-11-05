import { defineMessages } from "react-intl";

const messages = defineMessages({
  completed: {
    id: "app.workout.timeline.completed.text",
    description: "",
    defaultMessage: "Workout Captured for - {time_text}",
  },
  expired: {
    id: "app.workout.timeline.expired.text",
    description: "",
    defaultMessage: "Not Captured",
  },
  not_recorded: {
    id: "app.workout.timeline.not.recorded.text",
    description: "",
    defaultMessage: "Not Recorded",
  },
  taken: {
    id: "app.workout.timeline.taken",
    description: "",
    defaultMessage: "Taken",
  },
  cancelled_reschedule: {
    id: "app.workout.timeline.cancelled.reschedule",
    description: "",
    defaultMessage: "(Cancelled) Reschedule in 10 minutes",
  },
  exercisesDone: {
    id: "app.workout.timeline.exercisesDone",
    description: "",
    defaultMessage: " {complete}/{total} exercises done",
  },
  timeText: {
    id: "app.workout.timeline.timeText",
    description: "",
    defaultMessage: "Time :  {time}",
  },
});

export default messages;
