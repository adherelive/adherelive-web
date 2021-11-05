import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";

import {
  uploadReportUrl,
  fetchReportsUrl,
  addReportUrl,
  getAllReportsUrl,
  deleteUploadUrl,
  updateReportUrl,
} from "../../Helper/urls/report";

export const ADD_REPORT_START = "ADD_REPORT_START";
export const ADD_REPORT_COMPLETE = "ADD_REPORT_COMPLETE";
export const ADD_REPORT_FAILED = "ADD_REPORT_FAILED";

export const GET_ALL_REPORTS_START = "GET_ALL_REPORTS_START";
export const GET_ALL_REPORTS_COMPLETE = "GET_ALL_REPORTS_COMPLETE";
export const GET_ALL_REPORTS_FAILED = "GET_ALL_REPORTS_FAILED";

export const DELETE_REPORT_START = "DELETE_REPORT_START";
export const DELETE_REPORT_COMPLETE = "DELETE_REPORT_COMPLETE";
export const DELETE_REPORT_FAILED = "DELETE_REPORT_FAILED";

export const UPDATE_REPORT_START = "UPDATE_REPORT_START";
export const UPDATE_REPORT_COMPLETE = "UPDATE_REPORT_COMPLETE";
export const UPDATE_REPORT_FAILED = "UPDATE_REPORT_FAILED";

export const UPLOAD_REPORT_START = "UPLOAD_REPORT_START";
export const UPLOAD_REPORT_COMPLETE = "UPLOAD_REPORT_COMPLETE";
export const UPLOAD_REPORT_FAILED = "UPLOAD_REPORT_FAILED";

export const FETCH_REPORT_START = "FETCH_REPORT_START";
export const FETCH_REPORT_COMPLETE = "FETCH_REPORT_COMPLETE";
export const FETCH_REPORT_FAILED = "FETCH_REPORT_FAILED";

export const fetchReports = (patientId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: FETCH_REPORT_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: fetchReportsUrl(patientId),
      });
      const { status, payload: { data, error } = {} } = response || {};

      if (status === true) {
        dispatch({ type: FETCH_REPORT_COMPLETE, data });
      } else {
        dispatch({
          type: FETCH_REPORT_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("fetchReports module catch error", error);
    }
    return response;
  };
};

export const uploadReport = (patient_id, payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_REPORT_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: uploadReportUrl(patient_id),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};

      if (status == true) {
        dispatch({ type: UPLOAD_REPORT_COMPLETE, data });
      } else {
        dispatch({
          type: UPLOAD_REPORT_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("UPLOAD_REPORT ERROR --> ", error);
    }
    return response;
  };
};

export const addReport = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_REPORT_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addReportUrl(),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};

      if (status == true) {
        dispatch({ type: ADD_REPORT_COMPLETE, data });
      } else {
        dispatch({
          type: ADD_REPORT_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("ADD_REPORT ERROR --> ", error);
    }
    return response;
  };
};

export const getAllReports = (patient_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_REPORTS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAllReportsUrl(patient_id),
      });

      const { status, payload: { data, error } = {} } = response || {};

      if (status == true) {
        dispatch({ type: GET_ALL_REPORTS_COMPLETE, data });
      } else {
        dispatch({
          type: GET_ALL_REPORTS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET_ALL_REPORTS ERROR --> ", error);
    }
    return response;
  };
};

export const deleteReport = (doc_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_REPORT_START });
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: deleteUploadUrl(doc_id),
      });

      const { status, payload: { data, error } = {} } = response || {};

      if (status == true) {
        dispatch({ type: DELETE_REPORT_COMPLETE, data });
      } else {
        dispatch({
          type: DELETE_REPORT_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("DELETE_REPORT ERROR --> ", error);
    }
    return response;
  };
};

export const updateReport = (report_id, payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_REPORT_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateReportUrl(report_id),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};

      if (status == true) {
        dispatch({ type: UPDATE_REPORT_COMPLETE, data });
      } else {
        dispatch({
          type: UPDATE_REPORT_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("UPDATE_REPORT ERROR --> ", error);
    }
    return response;
  };
};

function reportsReducer(state, data) {
  const { reports } = data || {};
  if (reports) {
    return {
      ...state,
      ...reports,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;

  switch (type) {
    default:
      return reportsReducer(state, data);
  }
};
