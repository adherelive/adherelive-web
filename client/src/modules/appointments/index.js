import {doRequest} from "../../Helper/network";
import {REQUEST_TYPE} from "../../constant";
import {addAppointmentUrl, getAppointmentForParticipantUrl} from "../../Helper/urls/appointments";

export const ADD_APPOINTMENT_START = "ADD_APPOINTMENT_START";
export const ADD_APPOINTMENT_COMPLETE = "ADD_APPOINTMENT_COMPLETE";
export const ADD_APPOINTMENT_FAILED = "ADD_APPOINTMENT_FAILED";

export const GET_APPOINTMENTS_START = "GET_APPOINTMENTS_START";
export const GET_APPOINTMENTS_COMPLETE = "GET_APPOINTMENTS_COMPLETE";
export const GET_APPOINTMENTS_FAILED = "GET_APPOINTMENTS_FAILED";

export const addAppointment = payload => {
    let response = {};
    return async dispatch => {
        try {
            dispatch({type: ADD_APPOINTMENT_START});

            response = await doRequest({
                method: REQUEST_TYPE.POST,
                url: addAppointmentUrl(),
                data: payload
            });

            console.log("728136182 response --> ", response);

            const {status, payload: {data = {}, error = {}} = {}} = response || {};
            if (status === true) {
                dispatch({
                    type: ADD_APPOINTMENT_COMPLETE,
                    payload: data
                });
            } else {
                dispatch({
                    type: ADD_APPOINTMENT_FAILED,
                    payload: error
                });
            }
        } catch (error) {
            console.log("ADD APPOINTMENT MODULE error ----> ", error);
        }
        return response;
    };
};

export const getAppointments = id => {
    console.log("129376139263 here id --> ", id);
    let response = {};
    return async dispatch => {
        try {
            dispatch({type: GET_APPOINTMENTS_START});
            response = await doRequest({
                method: REQUEST_TYPE.GET,
                url: getAppointmentForParticipantUrl(id),
            });

            const {status, payload: {data, error} = {}} = response || {};
            if(status === true) {
                dispatch({
                    type: GET_APPOINTMENTS_COMPLETE,
                    payload: data
                });
            } else {
                dispatch({
                    type: GET_APPOINTMENTS_FAILED,
                    error
                });
            }
        } catch(error) {
            console.log("GET APPOINTMENTS FOR PATIENT ERROR", error);
        }
        return response;
    };
};

function appointmentReducer(state, data) {
    const {appointments = {}} = data || {};
    if (Object.keys(appointments).length > 0) {
        return {
            ...state,
            ...appointments
        };
    } else {
        return {
            ...state
        };
    }
}

export default (state = {}, action = {}) => {
    const {type, payload} = action;
    switch (type) {
        case GET_APPOINTMENTS_COMPLETE:
            return appointmentReducer(state, payload);
        default:
            return appointmentReducer(state, payload);
    }
};
