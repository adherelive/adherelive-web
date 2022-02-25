import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import {
  getScheduleEventsUrl,
  getAppointmentCompleteUrl,
  getAllMissedScheduleEventsUrl,
} from "../../Helper/urls/event";
import {
  getCalenderDataCountForDayUrl,
  getCalenderDataForDayUrl,
  getDoctorsCalenderDataForDayUrl,
} from "../../Helper/urls/provider";
import { getPatientLastVisitAlertUrl } from "../../Helper/url/patients";

export const GET_SCHEDULE_EVENTS_START = "GET_SCHEDULE_EVENTS_START";
export const GET_SCHEDULE_EVENTS_COMPLETED = "GET_SCHEDULE_EVENTS_COMPLETED";
export const GET_SCHEDULE_EVENTS_FAILED = "GET_SCHEDULE_EVENTS_FAILED";

export const GET_LAST_VISIT_ALERTS = "GET_LAST_VISIT_ALERTS";
export const GET_LAST_VISIT_ALERTS_COMPLETE = "GET_LAST_VISIT_ALERTS_COMPLETE";
export const GET_LAST_VISIT_ALERTS_FAILED = "GET_LAST_VISIT_ALERTS_FAILED";

export const APPOINTMENT_STATUS_UPDATE_COMPLETED =
  "APPOINTMENT_STATUS_UPDATE_COMPLETED";
export const APPOINTMENT_STATUS_UPDATE_FAILED =
  "APPOINTMENT_STATUS_UPDATE_FAILED";

export const GET_CALENDER_DATA_COUNT_START = "GET_CALENDER_DATA_COUNT_START";
export const GET_CALENDER_DATA_COUNT_COMPLETED =
  "GET_CALENDER_DATA_COUNT_COMPLETED";
export const GET_CALENDER_DATA_COUNT_FAILED = "GET_CALENDER_DATA_COUNT_FAILED";

export const GET_CALENDER_DATA_FOR_DAY_START =
  "GET_CALENDER_DATA_FOR_DAY_START";
export const GET_CALENDER_DATA_FOR_DAY_COMPLETED =
  "GET_CALENDER_DATA_FOR_DAY_COMPLETED";
export const GET_CALENDER_DATA_FOR_DAY_FAILED =
  "GET_CALENDER_DATA_FOR_DAY_FAILED";

export const GET_ALL_MISSED_SCHEDULE_EVENTS_START =
  "GET_ALL_MISSED_SCHEDULE_EVENTS_START";
export const GET_ALL_MISSED_SCHEDULE_EVENTS_COMPLETED =
  "GET_ALL_MISSED_SCHEDULE_EVENTS_COMPLETED";
export const GET_ALL_MISSED_SCHEDULE_EVENTS_FAILED =
  "GET_ALL_MISSED_SCHEDULE_EVENTS_FAILED";

export const getScheduleEvents = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_SCHEDULE_EVENTS_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getScheduleEventsUrl(),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: GET_SCHEDULE_EVENTS_COMPLETED,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_SCHEDULE_EVENTS_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("GET SCHEDULE EVENTS error ----> ", error);
    }
    return response;
  };
};

export const getCalenderDataCountForDay = (date) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_CALENDER_DATA_COUNT_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getCalenderDataCountForDayUrl(date),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: GET_CALENDER_DATA_COUNT_COMPLETED,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_CALENDER_DATA_COUNT_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("GET_CALENDER_DATA_COUNT error ----> ", error);
    }
    return response;
  };
};

export const getCalenderDataForDay = (date, type) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_CALENDER_DATA_FOR_DAY_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getCalenderDataForDayUrl(date, type),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: GET_CALENDER_DATA_FOR_DAY_COMPLETED,
          payload: data,
          data,
        });
      } else {
        dispatch({
          type: GET_CALENDER_DATA_FOR_DAY_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("GET_CALENDER_DATA_FOR_DAY error ----> ", error);
    }
    return response;
  };
};

// AKSHAY NEW CODE IMPLEMENTATION
export const getDoctorsCalenderDataForDay = (date, type) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_CALENDER_DATA_FOR_DAY_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getDoctorsCalenderDataForDayUrl(date, type),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: GET_CALENDER_DATA_FOR_DAY_COMPLETED,
          payload: data,
          data,
        });
      } else {
        dispatch({
          type: GET_CALENDER_DATA_FOR_DAY_FAILED,
          payload: error,
        });
      }
    } catch (error) {
      console.log("GET_CALENDER_DATA_FOR_DAY error ----> ", error);
    }
    return response;
  };
};

export const getLastVisitAlerts = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_LAST_VISIT_ALERTS,
      });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getPatientLastVisitAlertUrl(id),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_LAST_VISIT_ALERTS_COMPLETE,
          data: data,
        });
      } else {
        dispatch({
          type: GET_LAST_VISIT_ALERTS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET LAST VISIT ALERTS ERROR", error);
    }
    return response;
  };
};

export const markAppointmentComplete = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getAppointmentCompleteUrl(id),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: APPOINTMENT_STATUS_UPDATE_COMPLETED,
          data: data,
        });
      } else {
        dispatch({
          type: APPOINTMENT_STATUS_UPDATE_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("markAppointmentComplete 500 error", error);
    }
    return response;
  };
};

export const getAllMissedScheduleEvents = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_MISSED_SCHEDULE_EVENTS_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAllMissedScheduleEventsUrl(),
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_ALL_MISSED_SCHEDULE_EVENTS_COMPLETED,
          data: data,
        });
      } else {
        dispatch({
          type: GET_ALL_MISSED_SCHEDULE_EVENTS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GetAllMissedScheduleEvents Error --->", error);
    }
    return response;
  };
};

function eventReducer(state, data) {
  const { schedule_events = {} } = data || {};
  if (Object.keys(schedule_events).length > 0) {
    return {
      ...state,
      ...schedule_events,
    };
  } else {
    return state;
  }
}

export default (state = {}, action = {}) => {
  const { type, data } = action;
  switch (type) {
    default:
      return eventReducer(state, data);
  }
};
