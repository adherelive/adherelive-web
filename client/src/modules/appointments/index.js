import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  addAppointmentUrl,
  addCarePlanAppointmentUrl,
  getAppointmentForParticipantUrl,
  updateAppointmentUrl,
  deleteAppointmentUrl,
  getAppointmentsDetailsUrl,
} from "../../Helper/urls/appointments";

export const ADD_APPOINTMENT_START = "ADD_APPOINTMENT_START";
export const ADD_APPOINTMENT_COMPLETE = "ADD_APPOINTMENT_COMPLETE";
export const ADD_APPOINTMENT_FAILED = "ADD_APPOINTMENT_FAILED";

export const ADD_CARE_PLAN_APPOINTMENT_START =
  "ADD_CARE_PLAN_APPOINTMENT_START";
export const ADD_CARE_PLAN_APPOINTMENT_COMPLETE =
  "ADD_CARE_PLAN_APPOINTMENT_COMPLETE";
export const ADD_CARE_PLAN_APPOINTMENT_FAILED =
  "ADD_CARE_PLAN_APPOINTMENT_FAILED";

export const UPDATE_APPOINTMENT_START = "UPDATE_APPOINTMENT_START";
export const UPDATE_APPOINTMENT_COMPLETE = "UPDATE_APPOINTMENT_COMPLETE";
export const UPDATE_APPOINTMENT_FAILED = "UPDATE_APPOINTMENT_FAILED";

export const GET_APPOINTMENTS_START = "GET_APPOINTMENTS_START";
export const GET_APPOINTMENTS_COMPLETE = "GET_APPOINTMENTS_COMPLETE";
export const GET_APPOINTMENTS_FAILED = "GET_APPOINTMENTS_FAILED";

export const GET_APPOINTMENTS_DETAILS = "GET_APPOINTMENTS_DETAILS";
export const GET_APPOINTMENTS_DETAILS_COMPLETE =
  "GET_APPOINTMENTS_DETAILS_COMPLETE";
export const GET_APPOINTMENTS_DETAILS_FAILED =
  "GET_APPOINTMENTS_DETAILS_FAILED";

export const DELETE_APPOINTMENTS_START = "DELETE_APPOINTMENTS_START";
export const DELETE_APPOINTMENTS_COMPLETE = "DELETE_APPOINTMENTS_COMPLETE";
export const DELETE_APPOINTMENTS_FAILED = "DELETE_APPOINTMENTS_FAILED";

export const addAppointment = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_APPOINTMENT_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addAppointmentUrl(),
        data: payload,
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: ADD_APPOINTMENT_COMPLETE,
          data,
        });
      } else {
        dispatch({
          type: ADD_APPOINTMENT_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("ADD APPOINTMENT MODULE error ----> ", error);
    }
    return response;
  };
};

export const addCarePlanAppointment = (payload, carePlanId) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_CARE_PLAN_APPOINTMENT_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: addCarePlanAppointmentUrl(carePlanId),
        data: payload,
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: ADD_CARE_PLAN_APPOINTMENT_COMPLETE,
          data,
        });
      } else {
        dispatch({
          type: ADD_CARE_PLAN_APPOINTMENT_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("ADD APPOINTMENT MODULE error ----> ", error);
    }
    return response;
  };
};

export const updateAppointment = (payload) => {
  let response = {};
  const { id, ...rest } = payload || {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_APPOINTMENT_START });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateAppointmentUrl(id),
        data: rest,
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: UPDATE_APPOINTMENT_COMPLETE,
          payload: data,
        });
      } else {
        dispatch({
          type: UPDATE_APPOINTMENT_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("UPDATE APPOINTMENT MODULE error ----> ", error);
    }
    return response;
  };
};

export const getAppointments = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_APPOINTMENTS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAppointmentForParticipantUrl(id),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_APPOINTMENTS_COMPLETE,
          data,
        });
      } else {
        dispatch({
          type: GET_APPOINTMENTS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET APPOINTMENTS FOR PATIENT ERROR", error);
    }
    return response;
  };
};

export const getAppointmentsDetails = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_APPOINTMENTS_DETAILS });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAppointmentsDetailsUrl(),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_APPOINTMENTS_DETAILS_COMPLETE,
          data,
        });
      } else {
        dispatch({
          type: GET_APPOINTMENTS_DETAILS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET APPOINTMENTS FOR PATIENT ERROR", error);
    }
    return response;
  };
};

export const deleteAppointment = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_APPOINTMENTS_START });
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: deleteAppointmentUrl(id),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: DELETE_APPOINTMENTS_COMPLETE,
          data,
        });
      } else {
        dispatch({
          type: DELETE_APPOINTMENTS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("DELETE APPOINTMENTS ERROR", error);
    }
    return response;
  };
};

function appointmentReducer(state, data) {
  const { appointments = {} } = data || {};
  if (Object.keys(appointments).length > 0) {
    return {
      ...state,
      ...appointments,
    };
  } else {
    return state;
  }
}

export default (state = {}, action = {}) => {
  const { type, data } = action;
  switch (type) {
    case GET_APPOINTMENTS_COMPLETE:
      return appointmentReducer(state, data);
    default:
      return appointmentReducer(state, data);
  }
};
