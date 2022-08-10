import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { getCdssDiagnosisList } from "../../Helper/urls/cdss";

export const GET_CDSS_DIAGNOSIS_LIST = "GET_CDSS_DIAGNOSIS_LIST";

export const CDSS_INITIAL_STATE = {
  diagnosisList: [],
};

export const getDiagnosisList = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getCdssDiagnosisList(),
        data: payload,
      });

      const { status, payload: { data, message = "" } = {} } = response || {};

      if (response.length > -1) {
        dispatch({
          type: GET_CDSS_DIAGNOSIS_LIST,
          payload: response,
        });
      } else {
      }
    } catch (error) {
      console.log("GET CDSS DIAGNOSIS catch error -> ", error);
    }
    return response;
  };
};

export default (state = CDSS_INITIAL_STATE, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case GET_CDSS_DIAGNOSIS_LIST:
      return {
        diagnosisList: payload,
      };
    default:
      return state;
  }
};
