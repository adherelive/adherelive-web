import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchExerciseUrl } from "../../Helper/urls/exercises";
import { ADD_EXERCISE_COMPLETED, EDIT_EXERCISE_COMPLETED } from "../exercises";

export const SEARCH_EXERCISE_START = "SEARCH_EXERCISE_START";
export const SEARCH_EXERCISE_COMPLETED = "SEARCH_EXERCISE_COMPLETED";
export const SEARCH_EXERCISE_FAILED = "SEARCH_EXERCISE_FAILED";

export const searchExercise = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchExerciseUrl(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_EXERCISE_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_EXERCISE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH EXERCISE MODULE catch error -> ", error);
    }
    return response;
  };
};

function searchExerciseReducer(state, data) {
  let { exercises = {} } = data || {};
  if (exercises) {
    return {
      ...exercises,
    };
  } else {
    return state;
  }
}

function addedNewItemDetailReducer(state, data) {
  let { exercises = {} } = data || {};
  if (exercises) {
    return {
      ...state,
      ...exercises,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action || {};
  switch (type) {
    case SEARCH_EXERCISE_COMPLETED:
      return searchExerciseReducer(state, data);
    case ADD_EXERCISE_COMPLETED:
      return searchExerciseReducer(state, data);
    case EDIT_EXERCISE_COMPLETED:
      return searchExerciseReducer(state, data);
    default:
      return state;
  }
};
