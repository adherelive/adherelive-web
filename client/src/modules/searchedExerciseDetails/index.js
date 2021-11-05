import { SEARCH_EXERCISE_COMPLETED } from "../searchedExercises";
import { ADD_EXERCISE_COMPLETED, EDIT_EXERCISE_COMPLETED } from "../exercises";

function searchExerciseDetaisReducer(state, data) {
  let { exercises = {}, exercise_details = {} } = data || {};
  if (exercises && exercise_details) {
    return {
      ...exercise_details,
    };
  } else {
    return state;
  }
}

function addedNewExerciseReducer(state, data) {
  let { exercises = {}, exercise_details = {} } = data || {};
  if (exercises && exercise_details) {
    return {
      ...state,
      ...exercise_details,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action || {};
  switch (type) {
    case SEARCH_EXERCISE_COMPLETED:
      return searchExerciseDetaisReducer(state, data);
    case ADD_EXERCISE_COMPLETED:
      return addedNewExerciseReducer(state, data);
    case EDIT_EXERCISE_COMPLETED:
      return addedNewExerciseReducer(state, data);
    default:
      return state;
  }
};
