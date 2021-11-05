import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AddExerciseDrawer from "../../Components/Drawer/addExercise";
import { close } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import { addExercise, uploadExerciseContent } from "../../modules/exercises";

const mapStateToProps = (state) => {
  const { auth } = state;
  const { authenticated_user, authenticated_category } = auth;
  const {
    drawer: { visible, loading, data: { type, payload = {} } = {} },
    repetitions,
    care_plans,
    exercises,
    exercise_details,
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    close: () => dispatch(close()),
    addExercise: (data) => dispatch(addExercise(data)),
    uploadExerciseContent: (data) => dispatch(uploadExerciseContent(data)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddExerciseDrawer)
);
