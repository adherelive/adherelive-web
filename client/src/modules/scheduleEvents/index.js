import {doRequest} from "../../Helper/network";
import {REQUEST_TYPE} from "../../constant";
import {getScheduleEventsUrl} from "../../Helper/urls/event";

export const GET_SCHEDULE_EVENTS_START = "GET_SCHEDULE_EVENTS_START";
export const GET_SCHEDULE_EVENTS_COMPLETED = "GET_SCHEDULE_EVENTS_COMPLETED";
export const GET_SCHEDULE_EVENTS_FAILED = "GET_SCHEDULE_EVENTS_FAILED";

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

function eventReducer(state, data) {
    const {schedule_events = {}} = data = {};
    if (Object.keys(schedule_events).length > 0) {
        return {
            ...state,
            ...schedule_events
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
        default:
            return eventReducer(state, payload);
    }
};
