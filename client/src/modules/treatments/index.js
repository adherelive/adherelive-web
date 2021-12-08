import { TREATMENT_INITIAL_STATE } from "../../data";
import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchTreatments } from "../../Helper/urls/treatments";

export const SEARCH_TREATMENTS_START = "SEARCH_TREATMENTS_START";
export const SEARCH_TREATMENTS_COMPLETED = "SEARCH_TREATMENTS_COMPLETED";
export const SEARCH_TREATMENTS_FAILED = "SEARCH_TREATMENTS_FAILED";

export const searchTreatment = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchTreatments(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_TREATMENTS_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_TREATMENTS_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH TREATMENTS MODULE catch error -> ", error);
    }
    return response;
  };
};

function treatmentReducer(state, data) {
  const { treatments } = data || {};
  if (treatments) {
    return {
      ...state,
      ...treatments,
    };
  } else {
    return state;
  }
}

export default (state = TREATMENT_INITIAL_STATE, action) => {
  const { type, data } = action;
  switch (type) {
    case SEARCH_TREATMENTS_COMPLETED:
      return treatmentReducer(state, data);
    default:
      return treatmentReducer(state, data);
  }
};
