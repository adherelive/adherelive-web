import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AddExerciseGroupDrawer from "../../Components/Drawer/addExerciseGroup";
import { close } from "../../modules/drawer";
import {
  addExercise,
  storeExerciseAndDetails,
  updateExercise,
  uploadExerciseContent,
} from "../../modules/exercises";
import { searchExercise } from "../../modules/searchedExercises";
import { clearLatestCreatedExercise } from "../../modules/latestCreatedExercise";

const mapStateToProps = (state) => {
  const { auth } = state;
  const { authenticated_user, authenticated_category } = auth;
  const {
    drawer: { loading, data: { payload = {} } = {} },
    repetitions,
    care_plans,
    exercises,
    exercise_details,
    searched_exercises,
    searched_exercise_details,
    doctors,
    latest_created_exercise,
    exercise_contents,
  } = state;

  return {
    authenticated_user,
    authenticated_category,
    loading,
    payload,
    repetitions,
    care_plans,
    exercises,
    exercise_details,
    searched_exercises,
    searched_exercise_details,
    doctors,
    latest_created_exercise,
    exercise_contents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    addExercise: (data) => dispatch(addExercise(data)),
    updateExercise: ({ exercise_id, data }) =>
      dispatch(updateExercise({ exercise_id, data })),
    searchExercise: (value) => dispatch(searchExercise(value)),
    storeExerciseAndDetails: (data) => dispatch(storeExerciseAndDetails(data)),
    clearLatestCreatedExercise: () => dispatch(clearLatestCreatedExercise()),
    uploadExerciseContent: (data) => dispatch(uploadExerciseContent(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddExerciseGroupDrawer)
);
