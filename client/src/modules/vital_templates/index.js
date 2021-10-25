import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchVitals } from "../../Helper/urls/vitals";

export const SEARCH_VITAL_START = "SEARCH_VITAL_START";
export const SEARCH_VITAL_COMPLETED = "SEARCH_VITAL_COMPLETED";
export const SEARCH_VITAL_FAILED = "SEARCH_VITAL_FAILED";

export const searchVital = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchVitals(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_VITAL_COMPLETED,
          payload: data,
        });
      } else {
        dispatch({
          type: SEARCH_VITAL_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH VITALS MODULE catch error -> ", error);
    }
    return response;
  };
};

function vitalReducer(state, data) {
  const { vital_templates = {} } = data || {};
  if (vital_templates) {
    return {
      ...state,
      ...vital_templates,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, payload } = action || {};
  switch (type) {
    case SEARCH_VITAL_COMPLETED:
      return vitalReducer(state, payload);
    default:
      return vitalReducer(state, payload);
  }
};
