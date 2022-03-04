import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import EditWorkoutDrawer from "../../Components/Drawer/editWorkout";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { addExercise } from "../../modules/exercises";
import {
  updateWorkout,
  getSingleWorkoutDetails,
  deleteWorkout,
  getWorkoutDetails,
  updateWorkoutTotalCalories,
} from "../../modules/workouts";
import { getPatientCarePlanDetails } from "../../modules/carePlans";

const mapStateToProps = (state) => {
  const { auth } = state;
  const { authenticated_user, authenticated_category, auth_role } = auth;
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    repetitions,
    care_plans,
    exercises,
    exercise_details,
    searched_exercises,
    searched_exercise_details,
    all_workout_details = {},
  } = state;

  return {
    authenticated_user,
    authenticated_category,
    auth_role,
    visible: visible && type === DRAWER.EDIT_WORKOUT,
    loading,
    payload,
    repetitions,
    care_plans,
    exercises,
    exercise_details,
    searched_exercises,
    searched_exercise_details,
    all_workout_details,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    getWorkoutDetails: () => dispatch(getWorkoutDetails()),
    addExercise: (data) => dispatch(addExercise(data)),
    updateWorkout: (id, data) => dispatch(updateWorkout(id, data)),
    getSingleWorkoutDetails: (id) => dispatch(getSingleWorkoutDetails(id)),
    deleteWorkout: (id) => dispatch(deleteWorkout(id)),
    getPatientCarePlanDetails: (patientId) =>
      dispatch(getPatientCarePlanDetails(patientId)),
    updateWorkoutTotalCalories: ({ workout_id, total_calories }) =>
      dispatch(
        updateWorkoutTotalCalories({
          workout_id,
          total_calories,
        })
      ),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditWorkoutDrawer)
);
