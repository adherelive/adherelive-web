import { doRequest } from "../../Helper/network";
import {REQUEST_TYPE} from "../../constant";
import {searchMedicines,addMedicineUrl} from "../../Helper/urls/medicines";

export const SEARCH_MEDICINE_START = "SEARCH_MEDICINE_START";
export const SEARCH_MEDICINE_COMPLETED = "SEARCH_MEDICINE_COMPLETED";
export const SEARCH_MEDICINE_FAILED = "SEARCH_MEDICINE_FAILED";

export const ADD_MEDICINE_START = "ADD_MEDICINE_START";
export const ADD_MEDICINE_COMPLETED = "ADD_MEDICINE_COMPLETED";
export const ADD_MEDICINE_FAILED = "ADD_MEDICINE_FAILED";

export const searchMedicine = value => {
    let response = {};
    return async dispatch => {
        try {
            response = await doRequest({
                method: REQUEST_TYPE.GET,
                url: searchMedicines(value),
            });

            const {status, payload: {data, message = ""} = {}} = response || {};
            if(status === true) {
                dispatch({
                    type: SEARCH_MEDICINE_COMPLETED,
                    data
                });
            } else {
                dispatch({
                    type: SEARCH_MEDICINE_FAILED,
                    message
                });
            }
        } catch(error) {
            console.log("SEARCH MEDICINE MODULE catch error -> ", error);
        }
        return response;
    }
};

export const addMedicine = payload => {
    let response = {};
    return async dispatch => {
        try {
            response = await doRequest({
                method: REQUEST_TYPE.POST,
                url: addMedicineUrl(),
                data:payload
            });

            const {status, payload: {data, message = ""} = {}} = response || {};
            if(status === true) {
                dispatch({
                    type: ADD_MEDICINE_COMPLETED,
                    data,
                    payload:data
                });
            } else {
                dispatch({
                    type: ADD_MEDICINE_FAILED,
                    message
                });
            }
        } catch(error) {
            console.log("ADD MEDICINE MODULE catch error -> ", error);
        }
        return response;
    }
};

function medicineReducer(state, data) {
    const {medicines = {}} = data || {};
    if(medicines) {
        return {
            ...state,
            ...medicines
        };
    } else {
        return state;
    }
}

export default (state = {}, payload) => {
  const { type, data } = payload || {};
  switch (type) {
    case SEARCH_MEDICINE_COMPLETED:
      return medicineReducer(state, data);
    default:
      return medicineReducer(state, data);
  }
};
