import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  addDietUrl,
  getDietsForCareplanUrl,
  getDietDetailsByIdUrl,
  updateDietUrl,
  getAllDietsForDoctorUrl,
  getDietTimelineUrl,
  getPatientPreferenceDietDetailsUrl,
  updateDietTotalCaloriesUrl,
} from "../../Helper/urls/diet";

export const ADD_DIET_START = "ADD_DIET_START";
export const ADD_DIET_COMPLETED = "ADD_DIET_COMPLETED";
export const ADD_DIET_FAILED = "ADD_DIET_FAILED";

export const UPDATE_DIET_START = "UPDATE_DIET_START";
export const UPDATE_DIET_COMPLETED = "UPDATE_DIET_COMPLETED";
export const UPDATE_DIET_FAILED = "UPDATE_DIET_FAILED";

export const GET_CAREPLAN_DIETS_START = "GET_CAREPLAN_DIETS_START";
export const GET_CAREPLAN_DIETS_COMPLETED = "GET_CAREPLAN_DIETS_COMPLETED";
export const GET_CAREPLAN_DIETS_FAILED = "GET_CAREPLAN_DIETS_FAILED";

export const GET_SINGLE_DIET_DETAILS_START = "GET_SINGLE_DIET_DETAILS_START";
export const GET_SINGLE_DIET_DETAILS_COMPLETED =
  "GET_SINGLE_DIET_DETAILS_COMPLETED";
export const GET_SINGLE_DIET_DETAILS_FAILED = "GET_SINGLE_DIET_DETAILS_FAILED";

export const GET_ALL_DIETS_FOR_DOCTOR_START = "GET_ALL_DIETS_FOR_DOCTOR_START";
export const GET_ALL_DIETS_FOR_DOCTOR_COMPLETED =
  "GET_ALL_DIETS_FOR_DOCTOR_COMPLETED";
export const GET_ALL_DIETS_FOR_DOCTOR_FAILED =
  "GET_ALL_DIETS_FOR_DOCTOR_FAILED";

export const DELETE_DIET_START = "DELETE_DIET_START";
export const DELETE_DIET_COMPLETED = "DELETE_DIET_COMPLETED";
export const DELETE_DIET_FAILED = "DELETE_DIET_FAILED";

export const GET_DIET_TIMELINE_START = "GET_DIET_TIMELINE_START";
export const GET_DIET_TIMELINE_COMPLETED = "GET_DIET_TIMELINE_COMPLETED";
export const GET_DIET_TIMELINE_FAILED = "GET_DIET_TIMELINE_FAILED";

export const GET_PATEINT_PREFERENCE_DIET_DETAILS_START =
  "GET_PATEINT_PREFERENCE_DIET_DETAILS_START";
export const GET_PATEINT_PREFERENCE_DIET_DETAILS_COMPLETED =
  "GET_PATEINT_PREFERENCE_DIET_DETAILS_COMPLETED";
export const GET_PATEINT_PREFERENCE_DIET_DETAILS_FAILED =
  "GET_PATEINT_PREFERENCE_DIET_DETAILS_FAILED";

export const UPDATE_DIET_TOTAL_CALORIES_START =
  "UPDATE_DIET_TOTAL_CALORIES_START";
export const UPDATE_DIET_TOTAL_CALORIES_COMPLETED =
  "UPDATE_DIET_TOTAL_CALORIES_COMPLETED";
export const UPDATE_DIET_TOTAL_CALORIES_FAILED =
  "UPDATE_DIET_TOTAL_CALORIES_FAILED";

export const addDiet = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addDietUrl(),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ADD_DIET_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: ADD_DIET_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("ADD DIET MODULE catch error -> ", error);
    }
    return response;
  };
};

export const getPatientPreferenceDietDetails = (patient_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getPatientPreferenceDietDetailsUrl(patient_id),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_PATEINT_PREFERENCE_DIET_DETAILS_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_PATEINT_PREFERENCE_DIET_DETAILS_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log(
        "GET_PATEINT_PREFERENCE_DIET_DETAILS MODULE catch error -> ",
        error
      );
    }
    return response;
  };
};

export const updateDiet = (payload, diet_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateDietUrl(diet_id),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: UPDATE_DIET_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: UPDATE_DIET_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("UPDATE DIET MODULE catch error -> ", error);
    }
    return response;
  };
};

export const updateDietTotalCalories = ({ total_calories, diet_id }) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateDietTotalCaloriesUrl(diet_id, total_calories),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: UPDATE_DIET_TOTAL_CALORIES_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: UPDATE_DIET_TOTAL_CALORIES_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("UPDATE_DIET_TOTAL_CALORIES MODULE catch error -> ", error);
    }
    return response;
  };
};

export const getDietsForCareplan = (care_plan_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getDietsForCareplanUrl(care_plan_id),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_CAREPLAN_DIETS_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_CAREPLAN_DIETS_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET CAREPLAN DIETS MODULE catch error -> ", error);
    }
    return response;
  };
};

export const getSingleDietData = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getDietDetailsByIdUrl(id),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_SINGLE_DIET_DETAILS_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_SINGLE_DIET_DETAILS_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET_SINGLE_DIET_DETAILS  MODULE catch error -> ", error);
    }
    return response;
  };
};

export const deleteDiet = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: getDietDetailsByIdUrl(id),
      });

      const { status, payload: { data: resp_data = {}, message = "" } = {} } =
        response || {};

      const data = {
        deleted_diet_id: id,
        ...resp_data,
      };

      if (status === true) {
        dispatch({
          type: DELETE_DIET_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: DELETE_DIET_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("DELETE DIET  MODULE catch error -> ", error);
    }
    return response;
  };
};

export const getAllDietsForDoctor = () => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAllDietsForDoctorUrl(),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_ALL_DIETS_FOR_DOCTOR_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_ALL_DIETS_FOR_DOCTOR_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET ALL DIETS FOR DOCTOR MODULE catch error -> ", error);
    }
    return response;
  };
};

export const getDietTimeline = (dietId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_DIET_TIMELINE_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getDietTimelineUrl(dietId),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({ type: GET_DIET_TIMELINE_COMPLETED, data });
      } else {
        dispatch({ type: GET_DIET_TIMELINE_FAILED, message });
      }
    } catch (error) {
      console.log("UPDATE DIET MODULE catch error -> ", error);
    }
    return response;
  };
};

function deleteDietReducer(state, data) {
  const { deleted_diet_id } = data || {};

  if (deleted_diet_id) {
    const { [deleted_diet_id.toString()]: diet, ...rest } = state || {};

    if (diet) {
      let updatedDiet = { ...rest };
      return {
        ...updatedDiet,
      };
    } else {
      return state;
    }
  } else {
    return state;
  }
}

function dietReducer(state, data) {
  const { diets = {} } = data || {};
  if (diets) {
    return {
      ...state,
      ...diets,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action || {};
  switch (type) {
    case ADD_DIET_COMPLETED:
      return dietReducer(state, data);
    case UPDATE_DIET_COMPLETED:
      return dietReducer(state, data);
    case GET_CAREPLAN_DIETS_COMPLETED:
      return dietReducer(state, data);
    case DELETE_DIET_COMPLETED:
      // return deleteDietReducer(state,data); // delete diet reducer
      return dietReducer(state, data);
    default:
      return dietReducer(state, data);
  }
};
