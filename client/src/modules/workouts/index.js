import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  getWorkoutDetailsUrl,
  addWorkoutUrl,
  getSingleWorkoutDetailsUrl,
  updateWorkoutUrl,
  getWorkoutsForPatientDetailsUrl,
  getWorkoutTimelineUrl,
  getWorkoutScheduleEventDetailsUrl,
  updateWorkoutTotalCaloriesUrl,
} from "../../Helper/urls/workout";

export const GET_WORKOUT_DETAILS_START = "GET_WORKOUT_DETAILS_START";
export const GET_WORKOUT_DETAILS_COMPLETED = "GET_WORKOUT_DETAILS_COMPLETED";
export const GET_WORKOUT_DETAILS_FAILED = "GET_WORKOUT_DETAILS_FAILED";

export const ADD_WORKOUT_START = "ADD_WORKOUT_START";
export const ADD_WORKOUT_COMPLETED = "ADD_WORKOUT_COMPLETED";
export const ADD_WORKOUT_FAILED = "ADD_WORKOUT_FAILED";

export const GET_SINGLE_WORKOUT_DETAILS_START =
  "GET_SINGLE_WORKOUT_DETAILS_START";
export const GET_SINGLE_WORKOUT_DETAILS_COMPLETED =
  "GET_SINGLE_WORKOUT_DETAILS_COMPLETED";
export const GET_SINGLE_WORKOUT_DETAILS_FAILED =
  "GET_SINGLE_WORKOUT_DETAILS_FAILED";

export const GET_WORKOUTS_FOR_PATIENT_START = "GET_WORKOUTS_FOR_PATIENT_START";
export const GET_WORKOUTS_FOR_PATIENT_COMPLETED =
  "GET_WORKOUTS_FOR_PATIENT_COMPLETED";
export const GET_WORKOUTS_FOR_PATIENT_FAILED =
  "GET_WORKOUTS_FOR_PATIENT_FAILED";

export const UPDATE_WORKOUT_START = "UPDATE_WORKOUT_START";
export const UPDATE_WORKOUT_COMPLETED = "UPDATE_WORKOUT_COMPLETED";
export const UPDATE_WORKOUT_FAILED = "UPDATE_WORKOUT_FAILED";

export const DELETE_WORKOUT_START = "DELETE_WORKOUT_START";
export const DELETE_WORKOUT_COMPLETED = "DELETE_WORKOUT_COMPLETED";
export const DELETE_WORKOUT_FAILED = "DELETE_WORKOUT_FAILED";

export const GET_WORKOUT_TIMELINE_START = "GET_WORKOUT_TIMELINE_START";
export const GET_WORKOUT_TIMELINE_COMPLETED = "GET_WORKOUT_TIMELINE_COMPLETED";
export const GET_WORKOUT_TIMELINE_FAILED = "GET_WORKOUT_TIMELINE_FAILED";

export const GET_WORKOUT_DETAILS_FOR_RESPONSE_START =
  "GET_WORKOUT_DETAILS_FOR_RESPONSE_START";
export const GET_WORKOUT_DETAILS_FOR_RESPONSE_COMPLETED =
  "GET_WORKOUT_DETAILS_FOR_RESPONSE_COMPLETED";
export const GET_WORKOUT_DETAILS_FOR_RESPONSE_FAILED =
  "GET_WORKOUT_DETAILS_FOR_RESPONSE_FAILED";

export const UPDATE_WORKOUT_TOTAL_CALORIES_START =
  "UPDATE_WORKOUT_TOTAL_CALORIES_START";
export const UPDATE_WORKOUT_TOTAL_CALORIES_COMPLETED =
  "UPDATE_WORKOUT_TOTAL_CALORIES_COMPLETED";
export const UPDATE_WORKOUT_TOTAL_CALORIES_FAILED =
  "UPDATE_WORKOUT_TOTAL_CALORIES_FAILED";

export const getWorkoutDetails = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_WORKOUT_DETAILS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getWorkoutDetailsUrl(),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: GET_WORKOUT_DETAILS_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_WORKOUT_DETAILS_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET WORKOUT_DETAILS MODULE catch error -> ", error);
    }
    return response;
  };
};

export const addWorkout = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_WORKOUT_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addWorkoutUrl(),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: ADD_WORKOUT_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: ADD_WORKOUT_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("ADD WORKOUT MODULE catch error -> ", error);
    }
    return response;
  };
};

export const getSingleWorkoutDetails = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_SINGLE_WORKOUT_DETAILS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getSingleWorkoutDetailsUrl(id),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: GET_SINGLE_WORKOUT_DETAILS_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_SINGLE_WORKOUT_DETAILS_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET_SINGLE_WORKOUT_DETAILS MODULE catch error -> ", error);
    }
    return response;
  };
};

export const getWorkoutsForPatient = (patientId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_WORKOUTS_FOR_PATIENT_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getWorkoutsForPatientDetailsUrl(patientId),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: GET_WORKOUTS_FOR_PATIENT_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_WORKOUTS_FOR_PATIENT_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET_WORKOUTS_FOR_PATIENT  MODULE catch error -> ", error);
    }
    return response;
  };
};

export const updateWorkout = (id, payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_WORKOUT_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateWorkoutUrl(id),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: UPDATE_WORKOUT_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: UPDATE_WORKOUT_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("UPDATE WORKOUT MODULE catch error -> ", error);
    }
    return response;
  };
};

export const deleteWorkout = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: getSingleWorkoutDetailsUrl(id),
      });

      const { status, payload: { data: resp_data = {}, message = "" } = {} } =
        response || {};

      const data = {
        deleted_workout_id: id,
        ...resp_data,
      };

      if (status === true) {
        dispatch({
          type: DELETE_WORKOUT_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: DELETE_WORKOUT_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("DELETE WORKOUT MODULE catch error -> ", error);
    }
    return response;
  };
};

export const updateWorkoutTotalCalories = ({ workout_id, total_calories }) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_WORKOUT_TOTAL_CALORIES_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateWorkoutTotalCaloriesUrl(workout_id, total_calories),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: UPDATE_WORKOUT_TOTAL_CALORIES_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: UPDATE_WORKOUT_TOTAL_CALORIES_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log(
        "UPDATE WORKOUT TOTAL CALORIES MODULE catch error -> ",
        error
      );
    }
    return response;
  };
};

export const getWorkoutTimeline = (workoutId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_WORKOUT_TIMELINE_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getWorkoutTimelineUrl(workoutId),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({ type: GET_WORKOUT_TIMELINE_COMPLETED, data });
      } else {
        dispatch({ type: GET_WORKOUT_TIMELINE_FAILED, message });
      }
    } catch (error) {
      console.log("UPDATE WORKOUT MODULE catch error -> ", error);
    }
    return response;
  };
};

export const getWorkoutScheduleEventDetails = (schedule_event_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_WORKOUT_DETAILS_FOR_RESPONSE_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getWorkoutScheduleEventDetailsUrl(schedule_event_id),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({ type: GET_WORKOUT_DETAILS_FOR_RESPONSE_COMPLETED, data });
      } else {
        dispatch({ type: GET_WORKOUT_DETAILS_FOR_RESPONSE_FAILED, message });
      }
    } catch (error) {
      console.log(
        "GET_WORKOUT_DETAILS_FOR_RESPONSE MODULE catch error -> ",
        error
      );
    }
    return response;
  };
};

function deleteWorkoutReducer(state, data) {
  const { deleted_workout_id } = data || {};

  if (deleted_workout_id) {
    const { [deleted_workout_id.toString()]: workout, ...rest } = state || {};

    if (workout) {
      let updatedWorkout = { ...rest };
      return {
        ...updatedWorkout,
      };
    } else {
      return state;
    }
  } else {
    return state;
  }
}

function workoutsReducer(state, data) {
  const { workouts } = data || {};
  if (workouts) {
    return {
      ...state,
      ...workouts,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case GET_WORKOUT_DETAILS_COMPLETED:
      return workoutsReducer(state, data);
    case ADD_WORKOUT_COMPLETED:
      return workoutsReducer(state, data);
    case GET_SINGLE_WORKOUT_DETAILS_COMPLETED:
      return workoutsReducer(state, data);
    case GET_WORKOUTS_FOR_PATIENT_COMPLETED:
      return workoutsReducer(state, data);
    case UPDATE_WORKOUT_COMPLETED:
      return workoutsReducer(state, data);
    case GET_WORKOUT_DETAILS_FOR_RESPONSE_COMPLETED:
      return workoutsReducer(state, data);
    case DELETE_WORKOUT_COMPLETED:
      // return deleteWorkoutReducer(state,data); // delete reducer
      return workoutsReducer(state, data);
    default:
      return workoutsReducer(state, data);
  }
};
