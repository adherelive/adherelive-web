import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchCouncils } from "../../Helper/urls/councils";

export const SEARCH_COUNCIL_START = "SEARCH_COUNCIL_START";
export const SEARCH_COUNCIL_COMPLETED = "SEARCH_COUNCIL_COMPLETED";
export const SEARCH_COUNCIL_FAILED = "SEARCH_COUNCIL_FAILED";

export const searchCouncil = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchCouncils(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_COUNCIL_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_COUNCIL_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH COUNCIL MODULE catch error -> ", error);
    }
    return response;
  };
};

function councilReducer(state, data) {
  const { registration_councils = {} } = data || {};
  if (registration_councils) {
    return {
      ...state,
      ...registration_councils,
    };
  } else {
    return state;
  }
}

export default (state = {}, payload) => {
  const { type, data } = payload || {};
  switch (type) {
    case SEARCH_COUNCIL_COMPLETED:
      return councilReducer(state, data);
    default:
      return councilReducer(state, data);
  }
};
