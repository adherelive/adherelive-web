import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  getUploadAppointmentDocumentUrl,
  getDeleteAppointmentDocumentUrl,
} from "../../Helper/urls/appointments";

export const STORE_APPOINTMENT_DOCS = "STORE_APPOINTMENT_DOCS";
export const STORE_APPOINTMENT_DOCS_COMPLETE =
  "STORE_APPOINTMENT_DOCS_COMPLETE";
export const STORE_APPOINTMENT_DOCS_FAILED = "STORE_APPOINTMENT_DOCS_FAILED";

export const UPLOAD_APPOINTMENT_DOCUMENT_START =
  "UPLOAD_APPOINTMENT_DOCUMENT_START";
export const UPLOAD_APPOINTMENT_DOCUMENT_COMPLETE =
  "UPLOAD_APPOINTMENT_DOCUMENT_COMPLETE";
export const UPLOAD_APPOINTMENT_DOCUMENT_FAILED =
  "UPLOAD_APPOINTMENT_DOCUMENT_FAILED";

export const DELETE_APPOINTMENT_DOCUMENT_START =
  "DELETE_APPOINTMENT_DOCUMENT_START";
export const DELETE_APPOINTMENT_DOCUMENT_COMPLETE =
  "DELETE_APPOINTMENT_DOCUMENT_COMPLETE";
export const DELETE_APPOINTMENT_DOCUMENT_FAILED =
  "DELETE_APPOINTMENT_DOCUMENT_FAILED";

export const storeAppointmentDocuments = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: STORE_APPOINTMENT_DOCS,
        data: data,
      });

      console.log("STORE_APPOINTMENT_DOCS");
    } catch (err) {
      console.log("New Doctor Error", err);
      throw err;
    }
  };
};

export const uploadAppointmentDocs = (payload, id) => {
  let response = {};
  console.log("123098138239 data --> ", payload);
  return async (dispatch) => {
    try {
      dispatch({ type: UPLOAD_APPOINTMENT_DOCUMENT_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: payload,
        url: getUploadAppointmentDocumentUrl(id),
      });

      const { status, payload: { data } = {} } = response || {};
      if (status === true) {
        dispatch({ type: UPLOAD_APPOINTMENT_DOCUMENT_COMPLETE, data });
      } else {
        dispatch({
          type: UPLOAD_APPOINTMENT_DOCUMENT_FAILED,
        });
      }
    } catch (error) {
      console.log("uploadAppointmentDocs catch error --> ", error);
    }
    return response;
  };
};

export const deleteAppointmentDocs = (doc_id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_APPOINTMENT_DOCUMENT_START });
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: getDeleteAppointmentDocumentUrl(doc_id),
      });

      const { status, payload: { data } = {} } = response || {};
      if (status === true) {
        dispatch({ type: DELETE_APPOINTMENT_DOCUMENT_COMPLETE, data });
      } else {
        dispatch({
          type: DELETE_APPOINTMENT_DOCUMENT_FAILED,
        });
      }
    } catch (error) {
      console.log("deleteAppointmentDocs catch error --> ", error);
    }
    return response;
  };
};

function uploadDocumentReducer(state, data) {
  const { upload_documents } = data || {};
  if (upload_documents) {
    return {
      ...state,
      ...upload_documents,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return uploadDocumentReducer(state, data);
  }
};
