import { TREATMENT_INITIAL_STATE } from "../../data";
import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { gettSymptomDetailsUrl } from "../../Helper/urls/symptoms";

export const GET_SYMPTOM_DETAILS = "GET_SYMPTOM_DETAILS";
export const GET_SYMPTOM_DETAILS_COMPLETED = "GET_SYMPTOM_DETAILS_COMPLETED";
export const GET_SYMPTOM_DETAILS_FAILED = "GET_SYMPTOM_DETAILS_FAILED";

export const getSymptomDetails = value => {
  let response = {};
  return async dispatch => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: gettSymptomDetailsUrl(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_SYMPTOM_DETAILS_COMPLETED,
          data
        });
      } else {
        dispatch({
          type: GET_SYMPTOM_DETAILS_FAILED,
          message
        });
      }
    } catch (error) {
      console.log("GET_SYMPTOM_DETAILS MODULE catch error -> ", error);
    }
    return response;
  }
};

function symptomReducer(state, data) {
  const { symptoms } = data || {};
  if (symptoms) {
    return {
      ...state,
      ...symptoms,
    };
  } else {
    return {
      ...state,
    };
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case GET_SYMPTOM_DETAILS_COMPLETED:
      return symptomReducer(state, data);

    case GET_SYMPTOM_DETAILS_FAILED:
      return state;
    default:
      return symptomReducer(state, data);
  }
};
