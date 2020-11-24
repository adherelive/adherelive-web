import {doRequest} from "../../Helper/network";
import {REQUEST_TYPE} from "../../constant";
import {getScheduleEventsUrl, getAppointmentCompleteUrl} from "../../Helper/urls/event";


import {getPatientLastVisitAlertUrl} from '../../Helper/url/patients'

export const GET_SCHEDULE_EVENTS_START = "GET_SCHEDULE_EVENTS_START";
export const GET_SCHEDULE_EVENTS_COMPLETED = "GET_SCHEDULE_EVENTS_COMPLETED";
export const GET_SCHEDULE_EVENTS_FAILED = "GET_SCHEDULE_EVENTS_FAILED";


export const GET_LAST_VISIT_ALERTS='GET_LAST_VISIT_ALERTS';
export const GET_LAST_VISIT_ALERTS_COMPLETE='GET_LAST_VISIT_ALERTS_COMPLETE';
export const GET_LAST_VISIT_ALERTS_FAILED='GET_LAST_VISIT_ALERTS_FAILED';

export const APPOINTMENT_STATUS_UPDATE_COMPLETED = "APPOINTMENT_STATUS_UPDATE_COMPLETED";
export const APPOINTMENT_STATUS_UPDATE_FAILED = "APPOINTMENT_STATUS_UPDATE_FAILED";


export const getScheduleEvents = payload => {
    let response = {};
    return async dispatch => {
        try {
            dispatch({type: GET_SCHEDULE_EVENTS_START});

            response = await doRequest({
                method: REQUEST_TYPE.GET,
                url: getScheduleEventsUrl(),
            });

            const {status, payload: {data = {}, error = {}} = {}} = response || {};
            if (status === true) {
                dispatch({
                    type: GET_SCHEDULE_EVENTS_COMPLETED,
                    payload: data
                });
            } else {
                dispatch({
                    type: GET_SCHEDULE_EVENTS_FAILED,
                    payload: error
                });
            }
        } catch (error) {
            console.log("GET SCHEDULE EVENTS error ----> ", error);
        }
        return response;
    };
};

export const getLastVisitAlerts = (id) => {
  let response={};
  return async (dispatch) => {
    try{
      dispatch({
        type:GET_LAST_VISIT_ALERTS
      });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url:getPatientLastVisitAlertUrl(id),
      });
      
    const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        console.log("================================>GET_LAST_VISIT_ALERTS_COMPLETE");
        dispatch({
          type: GET_LAST_VISIT_ALERTS_COMPLETE,
          data: data,
        });
      } else {
        console.log("================================>GET_LAST_VISIT_ALERTS_FAILED");
        dispatch({
          type:GET_LAST_VISIT_ALERTS_FAILED,
          error,
        });
      }
      
    } catch(error) {
      console.log("================================>GET_LAST_VISIT_ALERTS_ERROR");
       console.log("GET LAST VISIT ALERTS ERROR", error);
    }
    return response;
  }
};

export const markAppointmentComplete = (id) => {
    let response = {};
    return async (dispatch) => {
        try {
            response = await doRequest({
                method: REQUEST_TYPE.POST,
                url:getAppointmentCompleteUrl(id),
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
        } catch(error) {
            console.log("markAppointmentComplete 500 error", error);
        }
        return response;
    };
};

function eventReducer(state, data) {
    const {schedule_events = {}} = data || {};
    if (Object.keys(schedule_events).length > 0) {
        return {
            ...state,
            ...schedule_events
        };
    } else {
        return state;
    }
}

export default (state = {}, action = {}) => {
    const {type, data} = action;
    switch (type) {
        default:
            return eventReducer(state, data);
    }
};
