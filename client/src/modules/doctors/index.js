import { DOCTOR_INITIAL_STATE } from "../../data";

import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { getDoctorDetailsUrl, getAllDoctorsUrl, getVerifyDoctorUrl } from "../../Helper/urls/doctor";

import * as Doctor from "../../Helper/urls/doctor";

export const GET_DOCTOR_DETAILS_START = "GET_DOCTOR_DETAILS_START";
export const GET_DOCTOR_DETAILS_COMPLETE = "GET_DOCTOR_DETAILS_COMPLETE";
export const GET_DOCTOR_DETAILS_FAILED = "GET_DOCTOR_DETAILS_FAILED";

export const GET_ALL_DOCTORS_START = "GET_ALL_DOCTORS_START";
export const GET_ALL_DOCTORS_COMPLETE = "GET_ALL_DOCTORS_COMPLETE";
export const GET_ALL_DOCTORS_FAILED = "GET_ALL_DOCTORS_FAILED";

export const VERIFY_DOCTOR_START = "VERIFY_DOCTOR_START";
export const VERIFY_DOCTOR_COMPLETE = "VERIFY_DOCTOR_COMPLETE";
export const VERIFY_DOCTOR_FAILED = "VERIFY_DOCTOR_FAILED";


export const verifyDoctor = id => {
  let response = {};
  return async dispatch => {
    try {
      dispatch({ type: VERIFY_DOCTOR_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getVerifyDoctorUrl(id),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: VERIFY_DOCTOR_COMPLETE,
          data: data,
        });
      } else {
        dispatch({
          type: VERIFY_DOCTOR_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET ALL DOCTORS ERROR --> ", error);
    }
    return response;
  }
};

export const getAllDoctors = () => {
  let response = {};
  return async dispatch => {
    try {
      dispatch({ type: GET_ALL_DOCTORS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAllDoctorsUrl(),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_ALL_DOCTORS_COMPLETE,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_ALL_DOCTORS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET ALL DOCTORS ERROR --> ", error);
    }
    return response;
  }
};

export const getDoctorDetails = (id) => {
  let response = {};
  return async dispatch => {
    try {
      dispatch({ type: GET_DOCTOR_DETAILS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getDoctorDetailsUrl(id),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_DOCTOR_DETAILS_COMPLETE,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_DOCTOR_DETAILS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET DOCTOR DETAILS ERROR --> ", error);
    }
    return response;
  }
};

function doctorReducer(state, data) {
  const { doctors } = data || {};
  if (doctors) {
    return {
      ...state,
      ...doctors,
    };
  } else {
    return {
      ...state,
    };
  }
}

export default (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    default:
      console.log("92832738492 data 1--> ", payload);
      return doctorReducer(state, payload);
  }
};
