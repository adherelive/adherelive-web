import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { getVitalOccurenceUrl } from "../../Helper/urls/vitals";

export const GET_VITAL_OCCURENCE_START = "GET_VITAL_OCCURENCE_START";
export const GET_VITAL_OCCURENCE_COMPLETED = "GET_VITAL_OCCURENCE_COMPLETED";
export const GET_VITAL_OCCURENCE_FAILED = "GET_VITAL_OCCURENCE_FAILED";

export const getVitalOccurence = () => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getVitalOccurenceUrl(),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_VITAL_OCCURENCE_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_VITAL_OCCURENCE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET VITALS MODULE catch error -> ", error);
    }
    return response;
  };
};

function vitalOccurenceReducer(state, data) {
  const { repeat_intervals = {} } = data || {};
  if (repeat_intervals) {
    return {
      ...state,
      ...repeat_intervals,
    };
  } else {
    return {
      ...state,
    };
  }
}

export default (state = {}, payload) => {
  const { type, data } = payload || {};
  switch (type) {
    case GET_VITAL_OCCURENCE_COMPLETED:
      return vitalOccurenceReducer(state, data);
    default:
      return vitalOccurenceReducer(state, data);
  }
};
