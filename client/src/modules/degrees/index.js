import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchDegrees } from "../../Helper/urls/degrees";

export const SEARCH_DEGREES_START = "SEARCH_DEGREES_START";
export const SEARCH_DEGREES_COMPLETED = "SEARCH_DEGREES_COMPLETED";
export const SEARCH_DEGREES_FAILED = "SEARCH_DEGREES_FAILED";

export const searchDegree = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchDegrees(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_DEGREES_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_DEGREES_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH DEGREE MODULE catch error -> ", error);
    }
    return response;
  };
};

function degreeReducer(state, data) {
  const { degrees = {} } = data || {};
  if (degrees) {
    return {
      ...state,
      ...degrees,
    };
  } else {
    return state;
  }
}

export default (state = {}, payload) => {
  const { type, data } = payload || {};
  switch (type) {
    case SEARCH_DEGREES_COMPLETED:
      return degreeReducer(state, data);
    default:
      return degreeReducer(state, data);
  }
};
