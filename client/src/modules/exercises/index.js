import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  addExerciseUrl,
  updateExerciseUrl,
  uploadExerciseContentUrl,
} from "../../Helper/urls/exercises";

// import {GET_SINGLE_DIET_DETAILS_COMPLETED} from "../../modules/diets";

export const ADD_EXERCISE_START = "ADD_EXERCISE_START";
export const ADD_EXERCISE_COMPLETED = "ADD_EXERCISE_COMPLETED";
export const ADD_EXERCISE_FAILED = "ADD_EXERCISE_FAILED";

export const EDIT_EXERCISE_START = "EDIT_EXERCISE_START";
export const EDIT_EXERCISE_COMPLETED = "EDIT_EXERCISE_COMPLETED";
export const EDIT_EXERCISE_FAILED = "EDIT_EXERCISE_FAILED";

export const UPLOAD_EXERCISE_CONTENT_START = "UPLOAD_EXERCISE_CONTENT_START";
export const UPLOAD_EXERCISE_CONTENT_COMPLETED =
  "UPLOAD_EXERCISE_CONTENT_COMPLETED";
export const UPLOAD_EXERCISE_CONTENT_FAILED = "UPLOAD_EXERCISE_CONTENT_FAILED";

export const STORE_EXERCISE_AND_DETAILS = "STORE_EXERCISE_AND_DETAILS";

export const addExercise = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addExerciseUrl(),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ADD_EXERCISE_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: ADD_EXERCISE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("ADD EXERCISE MODULE catch error -> ", error);
    }
    return response;
  };
};

export const updateExercise = ({ exercise_id, data: payload }) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateExerciseUrl(exercise_id),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: EDIT_EXERCISE_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: EDIT_EXERCISE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("EDIT EXERCISE MODULE catch error -> ", error);
    }
    return response;
  };
};

export const storeExerciseAndDetails = (data) => {
  return async (dispatch) => {
    try {
      const { exercises, exercise_details } = data;
      if (exercises && exercise_details) {
        dispatch({
          type: STORE_EXERCISE_AND_DETAILS,
          data,
        });
      }
    } catch (error) {
      console.log("STORE EXERCISE MODULE catch error -> ", error);
    }
  };
};

export const uploadExerciseContent = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: uploadExerciseContentUrl(),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: UPLOAD_EXERCISE_CONTENT_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: UPLOAD_EXERCISE_CONTENT_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("UPLOAD_EXERCISE_CONTENT  catch error -> ", error);
    }
    return response;
  };
};

function exerciseReducer(state, data) {
  const { exercises } = data || {};
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
    case ADD_EXERCISE_COMPLETED:
      return exerciseReducer(state, data);
    case EDIT_EXERCISE_COMPLETED:
      return exerciseReducer(state, data);
    case STORE_EXERCISE_AND_DETAILS:
      return exerciseReducer(state, data);
    // case GET_SINGLE_DIET_DETAILS_COMPLETED:
    //     return foodItemReducer(state, data);
    default:
      return exerciseReducer(state, data);
  }
};
