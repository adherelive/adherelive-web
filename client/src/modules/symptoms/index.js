import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  getSymptomsDetailsUrl,
  getSymptomTimeLineUrl,
  getHistorySymptomUrl,
} from "../../Helper/urls/symptoms";

export const GET_SYMPTOM = "GET_SYMPTOM";

export const GET_HISTORY_SYMPTOM = "GET_HISTORY_SYMPTOM";

export const GET_SYMPTOM_DETAILS_START = "GET_SYMPTOM_DETAILS_START";
export const GET_SYMPTOM_DETAILS_COMPLETE = "GET_SYMPTOM_DETAILS_COMPLETE";
export const GET_SYMPTOM_DETAILS_FAILED = "GET_SYMPTOM_DETAILS_FAILED";

export const getSymptomDetails = (ids = []) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_SYMPTOM_DETAILS_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getSymptomsDetailsUrl(),
        data: {
          symptom_ids: ids,
        },
      });
      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_SYMPTOM_DETAILS_COMPLETE,
          data: data,
          payload: data,
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
  };
};

export const getSymptomTimeLine = (patientId) => {
  return async (dispatch) => {
    let response = {};
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getSymptomTimeLineUrl(patientId),
      });
      const { payload = {}, status = false } = response || {};
      if (status) {
        const { data = {} } = payload;
        dispatch({ type: GET_SYMPTOM, data: data });
      }
      if (status === false) {
        const { message = "" } = payload;
        return { status: false, error: message };
      }
    } catch (err) {
      return { status: false, error: "" };
    }
    return response;
  };
};

export const getHistorySymptom = (patientId, days) => {
  return async (dispatch) => {
    let response = {};
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getHistorySymptomUrl(patientId, days),
      });
      const { payload = {}, status = false } = response || {};
      if (status) {
        const { data = {} } = payload;
        dispatch({ type: GET_HISTORY_SYMPTOM, data: data });
      }
      if (status === false) {
        const { message = "" } = payload;
        return { status: false, error: message };
      }
    } catch (err) {
      return { status: false, error: "" };
    }
    return response;
  };
};

function symptomsReducer(state, data) {
  const { symptoms } = data || {};
  if (symptoms) {
    return {
      ...state,
      ...symptoms,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return symptomsReducer(state, data);
  }
};
