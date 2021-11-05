import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WorkoutResponseEventDetails from "../../Components/Drawer/workoutResponseEventDetails";
import { getWorkoutScheduleEventDetails } from "../../modules/workouts";

import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    workouts = {},
    schedule_events = {},
    pages: { workout_response_ids = [] } = {},
    workout_responses = {},
    exercise_groups = {},
    exercises = {},
    exercise_details = {},
    exercise_contents = {},
    workout_exercise_groups = [],
    repetitions = {},
  } = state;

  return {
    workouts,
    schedule_events,
    workout_response_ids,
    workout_responses,
    exercise_groups,
    exercises,
    exercise_details,
    exercise_contents,
    workout_exercise_groups,
    repetitions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getWorkoutScheduleEventDetails: (schedule_event_id) =>
      dispatch(getWorkoutScheduleEventDetails(schedule_event_id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WorkoutResponseEventDetails)
);
