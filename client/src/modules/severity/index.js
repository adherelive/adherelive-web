// import { TREATMENT_INITIAL_STATE } from "../../data";
import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchSeverities } from "../../Helper/urls/severity";

export const SEARCH_SEVERITY_START = "SEARCH_SEVERITY_START";
export const SEARCH_SEVERITY_COMPLETED = "SEARCH_SEVERITY_COMPLETED";
export const SEARCH_SEVERITY_FAILED = "SEARCH_SEVERITY_FAILED";

export const searchSeverity = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchSeverities(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_SEVERITY_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_SEVERITY_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH SEVERITY MODULE catch error -> ", error);
    }
    return response;
  };
};

function severityReducer(state, data) {
  const { severity } = data || {};
  if (severity) {
    return {
      ...state,
      ...severity,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case SEARCH_SEVERITY_COMPLETED:
      return severityReducer(state, data);
    default:
      return severityReducer(state, data);
  }
};
