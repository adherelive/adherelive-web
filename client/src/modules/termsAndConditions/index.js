import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { getTACUrl } from "../../Helper/urls/otherDetails";

export const GET_TAC_START = "GET_TAC_START";
export const GET_TAC_COMPLETE = "GET_TAC_COMPLETE";
export const GET_TAC_FAILED = "GET_TAC_FAILED";

export const getTAC = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_TAC_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getTACUrl(id),
      });
      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_TAC_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_TAC_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET TAC ERROR --> ", error);
    }
    return response;
  };
};

function tacReducer(state, data) {
  const { terms_and_conditions } = data || {};
  if (terms_and_conditions) {
    return {
      ...state,
      ...terms_and_conditions,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      // return tacReducer(state, data);
      return state; // -----
  }
};
