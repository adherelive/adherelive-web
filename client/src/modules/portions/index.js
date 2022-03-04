import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { getPortionsUrl } from "../../Helper/urls/portion";

export const GET_PORTIONS_START = "GET_PORTIONS_START";
export const GET_PORTIONS_COMPLETED = "GET_PORTIONS_COMPLETED";
export const GET_PORTIONS_FAILED = "GET_PORTIONS_FAILED";

export const getPortions = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_PORTIONS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getPortionsUrl(),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (status === true) {
        dispatch({
          type: GET_PORTIONS_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: GET_PORTIONS_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("GET PORTIONS MODULE catch error -> ", error);
    }
    return response;
  };
};

function portionsReducer(state, data) {
  const { portions } = data || {};
  if (portions) {
    return {
      ...state,
      ...portions,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case GET_PORTIONS_COMPLETED:
      return portionsReducer(state, data);
    default:
      return state;
  }
};
