import { doRequest } from "../../Helper/network";
import {getMedicationDetailsUrl} from "../../Helper/urls/otherDetails";
import {REQUEST_TYPE} from "../../constant";

const GET_MEDICATION_DETAILS_START = "GET_MEDICATION_DETAILS_START";
const GET_MEDICATION_DETAILS_COMPLETE = "GET_MEDICATION_DETAILS_COMPLETE";
const GET_MEDICATION_DETAILS_FAILED = "GET_MEDICATION_DETAILS_FAILED";


export const getMedicationDetails = () => {
    return async dispatch => {
        try {
            dispatch({type: GET_MEDICATION_DETAILS_START});
            const response = await doRequest({
                method: REQUEST_TYPE.GET,
                url: getMedicationDetailsUrl(),
            });
            const {status, payload: {data} = {}} = response || {};
            if(status === true) {
                dispatch({
                    type: GET_MEDICATION_DETAILS_COMPLETE,
                    payload: data
                });
            } else {
                dispatch({
                    type: GET_MEDICATION_DETAILS_FAILED,
                });
            }
        } catch(error) {
            console.log("GET MEDICATION DETAILS error ---> ", error);
        }
    };
};

function medicationDetailsReducer(state, data) {
    return {
        ...state,
        medication_details: {
            ...data
        },
    };
}

function otherDetailsReducer(state, data) {
    const {medication_details = {}} = data || {};
    if(Object.keys(medication_details).length > 0) {
        return {
            ...state,
            medication_details
        };
    } else {
        return {
            ...state
        };
    }
}

export default (state = {}, data) => {
    const {type, payload} = data || {};
    switch(type) {
        case GET_MEDICATION_DETAILS_COMPLETE:
            return medicationDetailsReducer(state, payload);
        default:
            return otherDetailsReducer(state, payload);
    }
}