import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  getAddPatientUrl,
  searchPatientFromNumUrl,
  getRequestConsentUrl,
  getConsentVerifyUrl,
  searchPatientForDoctorUrl,
  addCareplanForPatientUrl,
  // AKSHAY NEW CODE IMPLEMENTATIONS
  getPatientDetailsUrl,
} from "../../Helper/urls/patients";
import { getInitialData } from "./../auth/index";

import { getPatientMissedEventsUrl } from "../../Helper/urls/event";

export const ADD_PATIENT = "ADD_PATIENT";
export const ADD_PATIENT_COMPLETED = "ADD_PATIENT_COMPLETED";
export const ADD_PATIENT_COMPLETED_WITH_ERROR =
  "ADD_PATIENT_COMPLETED_WITH_ERROR";

export const SEARCH_PATIENT = "SEARCH_PATIENT";
export const SEARCH_PATIENT_COMPLETE = "SEARCH_PATIENT_COMPLETE";
export const SEARCH_PATIENT_FAILED = "SEARCH_PATIENT_FAILED";

export const REQUEST_CONSENT_OTP_START = "REQUEST_CONSENT_OTP_START";
export const REQUEST_CONSENT_OTP_COMPLETED = "REQUEST_CONSENT_OTP_COMPLETED";
export const REQUEST_CONSENT_OTP_FAILED = "REQUEST_CONSENT_OTP_FAILED";

export const CONSENT_VERIFY_START = "CONSENT_VERIFY_START";
export const CONSENT_VERIFY_COMPLETED = "CONSENT_VERIFY_COMPLETED";
export const CONSENT_VERIFY_FAILED = "CONSENT_VERIFY_FAILED";

export const SEARCH_PATIENT_FOR_DOCTOR = "SEARCH_PATIENT_FOR_DOCTOR";
export const SEARCH_PATIENT_FOR_DOCTOR_COMPLETE =
  "SEARCH_PATIENT_FOR_DOCTOR_COMPLETE";
export const SEARCH_PATIENT_FOR_DOCTOR_FAILED =
  "SEARCH_PATIENT_FOR_DOCTOR_FAILED";

export const ADD_NEW_CAREPLAN = "ADD_NEW_CAREPLAN";
export const ADD_NEW_CAREPLAN_COMPLETE = "ADD_NEW_CAREPLAN_COMPLETE";
export const ADD_NEW_CAREPLAN_FAILED = "ADD_NEW_CAREPLAN_FAILED";

export const GET_PATIENT_MISSED_EVENTS_START =
  "GET_PATIENT_MISSED_EVENTS_START";
export const GET_PATIENT_MISSED_EVENTS_COMPLETED =
  "GET_PATIENT_MISSED_EVENTS_COMPLETED";
export const GET_PATIENT_MISSED_EVENTS_FAILED =
  "GET_PATIENT_MISSED_EVENTS_FAILED";

export const GENERATE_PRESCRIPTION_START = "GENERATE_PRESCRIPTION_START";
export const GENERATE_PRESCRIPTION_COMPLETED =
  "GENERATE_PRESCRIPTION_COMPLETED";
export const GENERATE_PRESCRIPTION_FAILED = "GENERATE_PRESCRIPTION_FAILED";

export const requestConsent = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: REQUEST_CONSENT_OTP_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getRequestConsentUrl(id),
      });

      const { status } = response || {};

      if (status === true) {
        dispatch({
          type: REQUEST_CONSENT_OTP_COMPLETED,
        });
      } else {
        dispatch({
          type: REQUEST_CONSENT_OTP_FAILED,
        });
      }
    } catch (err) {
      console.log("err requestConsent", err);
      throw err;
    }

    return response;
  };
};

export const consentVerify = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: CONSENT_VERIFY_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getConsentVerifyUrl(),
        data: payload,
      });

      const { status, payload: { data } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: CONSENT_VERIFY_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: CONSENT_VERIFY_FAILED,
        });
      }
    } catch (err) {
      console.log("err consentVerify", err);
      throw err;
    }

    return response;
  };
};

export const addPatient = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_PATIENT });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getAddPatientUrl(),
        data: payload,
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: ADD_PATIENT_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        // const { patients = {} } = data;
        dispatch({
          type: ADD_PATIENT_COMPLETED,
          data: data,
        });
        dispatch(getInitialData());
      }
    } catch (err) {
      console.log("err add patient", err);
      throw err;
    }

    return response;
  };
};

export const searchPatientFromNum = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: SEARCH_PATIENT });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchPatientFromNumUrl(value),
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: SEARCH_PATIENT_FAILED,
          payload: { error },
        });
      } else if (status === true) {
        // dispatch({
        //   type:SEARCH_PATIENT_COMPLETE,
        //   data: data,
        // });
      }
    } catch (error) {
      console.log("error search patient", error);
      throw error;
    }

    return response;
  };
};

export const searchPatientForDoctor = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: SEARCH_PATIENT_FOR_DOCTOR });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchPatientForDoctorUrl(value),
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: SEARCH_PATIENT_FOR_DOCTOR_FAILED,
          payload: { error },
        });
      } else if (status === true) {
        dispatch({
          type: SEARCH_PATIENT_FOR_DOCTOR_COMPLETE,
          data: data,
        });
      }
    } catch (error) {
      console.log("error search patient", error);
      throw error;
    }

    return response;
  };
};

export const addCareplanForPatient = (id, payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_NEW_CAREPLAN });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addCareplanForPatientUrl(id),
        data: payload,
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: ADD_NEW_CAREPLAN_FAILED,
          payload: { error },
        });
      } else if (status === true) {
        // const { patients = {} } = data;
        dispatch({
          type: ADD_NEW_CAREPLAN_COMPLETE,
          data: data,
        });
      }
    } catch (err) {
      console.log("err add patient", err);
      throw err;
    }

    return response;
  };
};

export const getPatientMissedEvents = (patient_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_PATIENT_MISSED_EVENTS_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getPatientMissedEventsUrl(patient_id),
      });

      const { status, payload: { data } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: GET_PATIENT_MISSED_EVENTS_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_PATIENT_MISSED_EVENTS_FAILED,
        });
      }
    } catch (err) {
      console.log("GET_PATIENT_MISSED_EVENTS_START err consentVerify", err);
      throw err;
    }

    return response;
  };
};

// AKSHAY NEW CODE IMPLEMENTATIONS

export const getPatientDetailsById = (patientId) => {
  let response = {};
  return async (dispatch) => {
    try {
      // dispatch({ type: ADD_PATIENT });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getPatientDetailsUrl(patientId),
      });

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      console.log("response", response);

      if (status === false) {
        // dispatch({
        //   type: ADD_PATIENT_COMPLETED_WITH_ERROR,
        //   payload: { error },
        // });
      } else if (status === true) {
        // const { patients = {} } = data;
        // dispatch({
        //   type: ADD_PATIENT_COMPLETED,
        //   data: data,
        // });
        // dispatch(getInitialData());
      }
    } catch (err) {
      console.log("err in get patient details", err);
      throw err;
    }

    return response;
  };
};

function patientReducer(state, data) {
  const { patients } = data || {};
  if (patients) {
    return {
      // ...PATIENT_INITIAL_STATE,
      ...state,
      ...patients,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return patientReducer(state, data);
    // return {
    //   ...PATIENT_INITIAL_STATE
    // };
  }
};
