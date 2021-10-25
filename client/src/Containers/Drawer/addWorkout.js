import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AddWorkoutDrawer from "../../Components/Drawer/addWorkout";
import { close } from "../../modules/drawer";
import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { getWorkoutDetails, addWorkout } from "../../modules/workouts";
import { addExercise } from "../../modules/exercises";

// import { addDiet } from "../../modules/diets";

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
    visible: visible && type === DRAWER.ADD_WORKOUT,
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
    addWorkout: (data) => dispatch(addWorkout(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddWorkoutDrawer)
);
