import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchColleges } from "../../Helper/urls/colleges";

export const SEARCH_COLLEGE_START = "SEARCH_COLLEGE_START";
export const SEARCH_COLLEGE_COMPLETED = "SEARCH_COLLEGE_COMPLETED";
export const SEARCH_COLLEGE_FAILED = "SEARCH_COLLEGE_FAILED";

export const searchCollege = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchColleges(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_COLLEGE_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_COLLEGE_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH COLLEGE MODULE catch error -> ", error);
    }
    return response;
  };
};

function collegeReducer(state, data) {
  const { colleges = {} } = data || {};
  if (colleges) {
    return {
      ...state,
      ...colleges,
    };
  } else {
    return state;
  }
}

export default (state = {}, payload) => {
  const { type, data } = payload || {};
  switch (type) {
    case SEARCH_COLLEGE_COMPLETED:
      return collegeReducer(state, data);
    default:
      return collegeReducer(state, data);
  }
};
