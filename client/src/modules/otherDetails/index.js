import { doRequest } from "../../Helper/network";
import {
  getMedicationDetailsUrl,
  getTermsAndPolicyUrl,
  updateTermsAndPolicyUrl,
} from "../../Helper/urls/otherDetails";
import { REQUEST_TYPE } from "../../constant";

const GET_MEDICATION_DETAILS_START = "GET_MEDICATION_DETAILS_START";
const GET_MEDICATION_DETAILS_COMPLETE = "GET_MEDICATION_DETAILS_COMPLETE";
const GET_MEDICATION_DETAILS_FAILED = "GET_MEDICATION_DETAILS_FAILED";

const GET_TERMS_AND_POLICY_START = "GET_TERMS_AND_POLICY_START";
const GET_TERMS_AND_POLICY_COMPLETED = "GET_TERMS_AND_POLICY_COMPLETED";
const GET_TERMS_AND_POLICY_FAILED = "GET_TERMS_AND_POLICY_FAILED";

const UPDATE_TERMS_AND_POLICY_START = "UPDATE_TERMS_AND_POLICY_START";
const UPDATE_TERMS_AND_POLICY_COMPLETED = "UPDATE_TERMS_AND_POLICY_COMPLETED";
const UPDATE_TERMS_AND_POLICY_FAILED = "UPDATE_TERMS_AND_POLICY_FAILED";

export const getMedicationDetails = (patientId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_MEDICATION_DETAILS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getMedicationDetailsUrl(patientId),
      });
      const { status, payload: { data } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_MEDICATION_DETAILS_COMPLETE,
          payload: data,
          data,
        });
      } else {
        dispatch({
          type: GET_MEDICATION_DETAILS_FAILED,
        });
      }
    } catch (error) {
      console.log("GET MEDICATION DETAILS error ---> ", error);
    }
    return response;
  };
};

export const getTermsAndPolicy = (type) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_TERMS_AND_POLICY_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getTermsAndPolicyUrl(type),
      });
      const { status, payload: { data } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_TERMS_AND_POLICY_COMPLETED,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_TERMS_AND_POLICY_FAILED,
        });
      }
    } catch (error) {
      console.log("GET MEDICATION DETAILS error ---> ", error);
    }
    return response;
  };
};

export const updateTermsAndPolicy = (payload) => {
  let response = {};
  console.log("0830929827398721 payload in module", payload);
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_TERMS_AND_POLICY_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateTermsAndPolicyUrl(),
        data: payload,
      });
      console.log("09183013 response ---> ", response);
      const { status, payload: { data } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: UPDATE_TERMS_AND_POLICY_COMPLETED,
          payload: data,
        });
      } else {
        dispatch({
          type: UPDATE_TERMS_AND_POLICY_FAILED,
        });
      }
    } catch (error) {
      console.log("GET MEDICATION DETAILS error ---> ", error);
    }

    return response;
  };
};

function medicationDetailsReducer(state, data) {
  return {
    ...state,
    medication_details: {
      ...data,
    },
  };
}

function otherDetailsReducer(state, data) {
  const { medication_details = {} } = data || {};
  if (Object.keys(medication_details).length > 0) {
    return {
      ...state,
      medication_details,
    };
  } else {
    return state;
  }
}

export default (state = {}, data) => {
  const { type, payload } = data || {};
  switch (type) {
    case GET_MEDICATION_DETAILS_COMPLETE:
      return medicationDetailsReducer(state, payload);
    default:
      return otherDetailsReducer(state, payload);
  }
};
