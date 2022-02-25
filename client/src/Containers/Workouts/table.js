import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WorkoutTable from "../../Components/Workouts/table";
import { getWorkoutsForPatient } from "../../modules/workouts";
import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";

const mapStateToProps = (state) => {
  const {
    workouts = {},
    auth: { auth_role = null } = {},
    care_plans = {},
  } = state;

  return {
    workouts,
    auth_role,
    care_plans,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWorkoutsForPatient: (patient_id) =>
      dispatch(getWorkoutsForPatient(patient_id)),
    openEditWorkoutDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_WORKOUT, payload })),
    openWorkoutResponseDrawer: (payload) =>
      dispatch(open({ type: DRAWER.WORKOUT_RESPONSE, payload })),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(WorkoutTable)
);
