
import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { getSymptomsDetailsUrl } from "../../Helper/urls/symptoms";


export const GET_SYMPTOM_DETAILS_START = "GET_SYMPTOM_DETAILS_START";
export const GET_SYMPTOM_DETAILS_COMPLETE = "GET_SYMPTOM_DETAILS_COMPLETE";
export const GET_SYMPTOM_DETAILS_FAILED = "GET_SYMPTOM_DETAILS_FAILED";


export const getSymptomDetails = (ids=[]) => {
  let response = {};
  return async dispatch => {
    try {
      dispatch({ type: GET_SYMPTOM_DETAILS_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getSymptomsDetailsUrl(),
        data: {
            symptom_ids:ids
        }
      });
      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_SYMPTOM_DETAILS_COMPLETE,
          data: data,
          payload: data
        });
      } else {
        dispatch({
          type: GET_SYMPTOM_DETAILS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET SYMPTOM DETAILS ERROR --> ", error);
    }
    return response;
  }
};

function symptomsReducer(state, data) {
  const { symptoms } = data || {};
  if (symptoms) {
    return {
      ...state,
      ...symptoms
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
    default:
      return symptomsReducer(state, data);
  }
};
