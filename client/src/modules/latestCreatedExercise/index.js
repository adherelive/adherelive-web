import { ADD_EXERCISE_COMPLETED } from "../exercises";

const CLEAR_LATEST_CREATED_EXERCISE = "CLEAR_LATEST_CREATED_EXERCISE";

export const clearLatestCreatedExercise = () => {
  return async (dispatch) => {
    try {
      const data = {
        exercises: {},
        exercise_details: {},
        exercise_contents: {},
        created: false,
      };

      dispatch({
        type: CLEAR_LATEST_CREATED_EXERCISE,
        data,
      });
    } catch (error) {
      console.log("CLEAR_LATEST_CREATED_EXERCISE ERROR --> ", error);
    }
  };
};

function latestExerciseCreatedReducer(state, data) {
  const {
    exercises: payloadExercises = {},
    exercise_details: payloadExerciseDetails = {},
    exercise_id = null,
    exercise_detail_id = null,
    exercise_contents = {},
  } = data || {};
  let createdExerciseData = {},
    createdExerciseDetaildData = {};
  const exercise = payloadExercises[exercise_id];
  const exercise_detail = payloadExerciseDetails[exercise_detail_id];
  createdExerciseData[exercise_id] = { ...exercise };
  createdExerciseDetaildData[exercise_detail_id] = { ...exercise_detail };

  if (exercise) {
    return {
      exercises: { ...createdExerciseData },
      exercise_details: { ...createdExerciseDetaildData },
      exercise_contents,
      created: true,
    };
  } else {
    return state;
  }
}

function clearDataReducer(state, data) {
  return {
    exercises: {},
    exercise_details: {},
    exercise_contents: {},
    created: false,
  };
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case ADD_EXERCISE_COMPLETED:
      return latestExerciseCreatedReducer(state, data);
    case CLEAR_LATEST_CREATED_EXERCISE:
      return clearDataReducer(state, data);
    default:
      return state;
  }
};
