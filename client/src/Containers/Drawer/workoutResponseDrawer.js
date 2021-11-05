import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WorkoutResponseDrawer from "../../Components/Drawer/workoutResponses";
import { getWorkoutScheduleEventDetails } from "../../modules/workouts";

import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    drawer: {
      visible,
      data: { type, payload: { workout_id, workout_name, loading } = {} } = {},
    },
    workouts = {},
    schedule_events = {},
    pages: { workout_response_ids = [] } = {},
    workout_responses = {},
  } = state;

  return {
    workout_id,
    workout_name,
    loading,
    visible: visible && type === DRAWER.WORKOUT_RESPONSE,
    workouts,
    schedule_events,
    workout_response_ids,
    workout_responses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WorkoutResponseDrawer)
);
