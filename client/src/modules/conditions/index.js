// import { TREATMENT_INITIAL_STATE } from "../../data";

import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchConditions } from "../../Helper/urls/conditions";

export const SEARCH_CONDITION_START = "SEARCH_CONDITION_START";
export const SEARCH_CONDITION_COMPLETED = "SEARCH_CONDITION_COMPLETED";
export const SEARCH_CONDITION_FAILED = "SEARCH_CONDITION_FAILED";

export const searchCondition = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchConditions(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_CONDITION_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_CONDITION_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH CONDITION MODULE catch error -> ", error);
    }
    return response;
  };
};

function conditionReducer(state, data) {
  const { conditions } = data || {};
  if (conditions) {
    return {
      ...state,
      ...conditions,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case SEARCH_CONDITION_COMPLETED:
      return conditionReducer(state, data);
    default:
      return conditionReducer(state, data);
  }
};
