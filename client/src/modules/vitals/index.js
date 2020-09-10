import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  getAddVitalURL,
} from "../../Helper/urls/vitals";

export const ADD_VITAL_START = "ADD_VITAL_START";
export const ADD_VITAL_COMPLETED = "ADD_VITAL_COMPLETED";
export const ADD_VITAL_FAILED = "ADD_VITAL_FAILED";

export const addVital = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_VITAL_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getAddVitalURL(),
        data: payload,
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({ type: ADD_VITAL_COMPLETED, payload: data });
      } else {
        dispatch({ type: ADD_VITAL_FAILED, payload: error });
      }
    } catch (error) {
      console.log("ADD vital error ----> ", error);
      dispatch({ type: ADD_VITAL_FAILED });
    }
    return response;
  };
};


function vitalsReducer(state, payload) {
  const { vitals = {} } = payload || {};
  if (Object.keys(vitals).length > 0) {
    return {
      ...state,
      ...vitals,
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
      return vitalsReducer(state, data);
  }
};


