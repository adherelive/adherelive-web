// import { TREATMENT_INITIAL_STATE } from "../../data";

import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchConditions } from "../../Helper/urls/conditions";

export const SEARCH_SEVERITY_START = "SEARCH_SEVERITY_START";
export const SEARCH_SEVERITY_COMPLETED = "SEARCH_SEVERITY_COMPLETED";
export const SEARCH_SEVERITY_FAILED = "SEARCH_SEVERITY_FAILED";

export const searchCondition = value => {
  let response = {};
  return async dispatch => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchConditions(value),
      });

      const { status, payload: { data, error = {}, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_SEVERITY_COMPLETED,
          data
        });
      } else {
        dispatch({
          type: SEARCH_SEVERITY_FAILED,
          message
        });
      }
    } catch (error) {
      console.log("SEARCH SEVERITY MODULE catch error -> ", error);
    }
    return response;
  }
};


function conditionReducer(state, data) {
  const { conditions } = data || {};
  if (conditions) {
    return {
      ...state,
      ...conditions,
    };
  } else {
    return {
      ...state,
    };
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return conditionReducer(state, data)
  }
};
