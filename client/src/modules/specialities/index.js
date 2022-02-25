import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { searchSpecialities } from "../../Helper/urls/speciality";

export const SEARCH_SPECIALITIES_START = "SEARCH_SPECIALITIES_START";
export const SEARCH_SPECIALITIES_COMPLETED = "SEARCH_SPECIALITIES_COMPLETED";
export const SEARCH_SPECIALITIES_FAILED = "SEARCH_SPECIALITIES_FAILED";

export const searchSpecialties = (value) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: SEARCH_SPECIALITIES_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: searchSpecialities(value),
      });

      const { status, payload: { data, message = "" } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SEARCH_SPECIALITIES_COMPLETED,
          data,
        });
      } else {
        dispatch({
          type: SEARCH_SPECIALITIES_FAILED,
          message,
        });
      }
    } catch (error) {
      console.log("SEARCH SPECIALITIES MODULE catch error -> ", error);
    }
    return response;
  };
};

function specialityReducer(state, data) {
  const { specialities } = data || {};
  if (specialities) {
    return {
      ...state,
      ...specialities,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return specialityReducer(state, data);
  }
};
