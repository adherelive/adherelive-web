import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  getAddVitalURL,
  getVitalTimelineURL,
  getUpdateVitalURL,
} from "../../Helper/urls/vitals";

import {
  getEditVitalResponseUrl,
  getDeleteVitalResponseUrl,
} from "../../Helper/urls/event";

import { getPatientVitalsURL } from "../../Helper/urls/patients";

export const ADD_VITAL_START = "ADD_VITAL_START";
export const ADD_VITAL_COMPLETED = "ADD_VITAL_COMPLETED";
export const ADD_VITAL_FAILED = "ADD_VITAL_FAILED";

export const GET_VITALS_START = "GET_VITALS_START";
export const GET_VITALS_COMPLETE = "GET_VITALS_COMPLETE";
export const GET_VITALS_FAILED = "GET_VITALS_FAILED";

export const GET_VITALS_TIMELINE_START = "GET_VITALS_TIMELINE_START";
export const GET_VITALS_TIMELINE_COMPLETE = "GET_VITALS_TIMELINE_COMPLETE";
export const GET_VITALS_TIMELINE_FAILED = "GET_VITALS_TIMELINE_FAILED";

export const UPDATE_VITAL_START = "UPDATE_VITAL_START";
export const UPDATE_VITAL_COMPLETED = "UPDATE_VITAL_COMPLETED";
export const UPDATE_VITAL_FAILED = "UPDATE_VITAL_FAILED";

export const EDIT_VITAL_RESPONSE_START = "EDIT_VITAL_RESPONSE_START";
export const EDIT_VITAL_RESPONSE_COMPLETED = "EDIT_VITAL_RESPONSE_COMPLETED";
export const EDIT_VITAL_RESPONSE_FAILED = "EDIT_VITAL_RESPONSE_FAILED";

export const DELETE_VITAL_RESPONSE_START = "DELETE_VITAL_RESPONSE_START";
export const DELETE_VITAL_RESPONSE_COMPLETED =
  "DELETE_VITAL_RESPONSE_COMPLETED";
export const DELETE_VITAL_RESPONSE_FAILED = "DELETE_VITAL_RESPONSE_FAILED";

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
        dispatch({ type: ADD_VITAL_COMPLETED, payload: data, data });
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

export const getVitals = (carePlanId) => {
  return async (dispatch) => {
    let response = {};
    try {
      dispatch({ type: GET_VITALS_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getPatientVitalsURL(carePlanId),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      console.log("3912312789 response -> ", response);
      if (status === true) {
        dispatch({ type: GET_VITALS_COMPLETE, payload: data, data });
      } else {
        dispatch({ type: GET_VITALS_FAILED, payload: error });
      }
    } catch (error) {
      console.log("getVitals error ----> ", error);
      dispatch({ type: GET_VITALS_FAILED });
    }
    return response;
  };
};

export const getVitalTimeline = (vitalId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_VITALS_TIMELINE_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getVitalTimelineURL(vitalId),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({ type: GET_VITALS_TIMELINE_COMPLETE, payload: data, data });
      } else {
        dispatch({ type: GET_VITALS_TIMELINE_FAILED, payload: error });
      }
    } catch (error) {
      console.log("getVitalTimeline error ----> ", error);
      dispatch({ type: GET_VITALS_TIMELINE_FAILED });
    }
    return response;
  };
};

export const updateVital = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      const { id, ...rest } = payload || {};
      dispatch({ type: UPDATE_VITAL_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getUpdateVitalURL(id),
        data: rest,
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({ type: UPDATE_VITAL_COMPLETED, payload: data, data });
      } else {
        dispatch({ type: UPDATE_VITAL_FAILED, payload: error });
      }
    } catch (error) {
      console.log("updateVital error ----> ", error);
      dispatch({ type: UPDATE_VITAL_FAILED });
    }
    return response;
  };
};

/****************  EDIT VITAL RESPONSE  ****************/

export const editVitalResponse = ({ id, index, value }) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: EDIT_VITAL_RESPONSE_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getEditVitalResponseUrl({ id, index }),
        data: { value },
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({ type: EDIT_VITAL_RESPONSE_COMPLETED, payload: data, data });
      } else {
        dispatch({ type: EDIT_VITAL_RESPONSE_FAILED, payload: error });
      }
    } catch (error) {
      console.log("editVitalResponse error ----> ", error);
      dispatch({ type: EDIT_VITAL_RESPONSE_FAILED });
    }
    return response;
  };
};

/****************  DELETE VITAL RESPONSE  ****************/

export const deleteVitalResponse = ({ id, index }) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_VITAL_RESPONSE_START });

      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: getDeleteVitalResponseUrl({ id, index }),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: DELETE_VITAL_RESPONSE_COMPLETED,
          payload: data,
          data,
        });
      } else {
        dispatch({ type: DELETE_VITAL_RESPONSE_FAILED, payload: error });
      }
    } catch (error) {
      console.log("deleteVitalResponse error ----> ", error);
      dispatch({ type: DELETE_VITAL_RESPONSE_FAILED });
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
    return state;
  }
}

function vitalTimelineReducer(state, data) {
  const { vital_timeline = {}, vital_date_ids = [] } = data || {};
  if (vital_date_ids.length > 0) {
    return {
      ...state,
      views: {
        timeline: {
          vital_timeline,
          vital_date_ids,
        },
      },
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, payload } = action || {};
  switch (type) {
    case GET_VITALS_TIMELINE_COMPLETE:
      return vitalTimelineReducer(state, payload);
    default:
      return vitalsReducer(state, payload);
  }
};
