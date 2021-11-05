import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WorkoutTimeline from "../../Components/Workouts/timeline";
import { getWorkoutTimeline } from "../../modules/workouts";

const mapStateToProps = (state) => {
  const {
    workouts = {},
    schedule_events = {},
    pages: { workout_response_ids = [] } = {},
    workout_responses = {},
  } = state;

  return {
    workouts,
    schedule_events,
    workout_response_ids,
    workout_responses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWorkoutTimeline: (id) => dispatch(getWorkoutTimeline(id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WorkoutTimeline)
);
