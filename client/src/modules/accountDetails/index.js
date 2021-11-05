import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { getDoctorAccountDetailsUrl } from "../../Helper/urls/doctor";
import {
  accountDetailsUrl,
  updateAccountDetailsUrl,
  accountDetailsForCreatedByProviderUrl,
} from "../../Helper/urls/accounts";

export const GET_DOCTOR_ACCOUNT_DETAILS_START =
  "GET_DOCTOR_ACCOUNT_DETAILS_START";
export const GET_DOCTOR_ACCOUNT_DETAILS_COMPLETED =
  "GET_DOCTOR_ACCOUNT_DETAILS_COMPLETED";
export const GET_DOCTOR_ACCOUNT_DETAILS_FAILED =
  "GET_DOCTOR_ACCOUNT_DETAILS_FAILED";

export const GET_ACCOUNT_DETAILS = "GET_ACCOUNT_DETAILS";
export const GET_ACCOUNT_DETAILS_COMPLETE = "GET_ACCOUNT_DETAILS_COMPLETE";
export const GET_ACCOUNT_DETAILS_FAILED = "GET_ACCOUNT_DETAILS_FAILED";

export const ADD_ACCOUNT_DETAILS = "ADD_ACCOUNT_DETAILS";
export const ADD_ACCOUNT_DETAILS_COMPLETE = "ADD_ACCOUNT_DETAILS_COMPLETE";
export const ADD_ACCOUNT_DETAILS_FAILED = "ADD_ACCOUNT_DETAILS_FAILED";

export const DELETE_ACCOUNT_DETAILS = "DELETE_ACCOUNT_DETAILS";
export const DELETE_ACCOUNT_DETAILS_COMPLETE =
  "DELETE_ACCOUNT_DETAILS_COMPLETE";
export const DELETE_ACCOUNT_DETAILS_FAILED = "DELETE_ACCOUNT_DETAILS_FAILED";

export const UPDATE_ACCOUNT_DETAILS = "UPDATE_ACCOUNT_DETAILS";
export const UPDATE_ACCOUNT_DETAILS_COMPLETE =
  "UPDATE_ACCOUNT_DETAILS_COMPLETE";
export const UPDATE_ACCOUNT_DETAILS_FAILED = "UPDATE_ACCOUNT_DETAILS_FAILED";

export const getDoctorAccountDetails = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_DOCTOR_ACCOUNT_DETAILS_START });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getDoctorAccountDetailsUrl(id),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({
          type: GET_DOCTOR_ACCOUNT_DETAILS_COMPLETED,
          payload: data,
          data,
        });
      } else {
        dispatch({ type: GET_DOCTOR_ACCOUNT_DETAILS_FAILED, payload: error });
      }
    } catch (error) {
      console.log("getDoctorAccountDetails catch error ----> ", error);
      dispatch({ type: GET_DOCTOR_ACCOUNT_DETAILS_FAILED });
    }
    return response;
  };
};

export const getAccountDetails = (provider_id = null) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_ACCOUNT_DETAILS });
      if (!provider_id) {
        response = await doRequest({
          method: REQUEST_TYPE.GET,
          url: accountDetailsUrl(),
        });
      } else {
        response = await doRequest({
          method: REQUEST_TYPE.GET,
          url: accountDetailsForCreatedByProviderUrl(provider_id),
        });
      }

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_ACCOUNT_DETAILS_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_ACCOUNT_DETAILS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET_ACCOUNT_DETAILS ERROR --> ", error);
    }
    return response;
  };
};

export const addAccountDetails = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_ACCOUNT_DETAILS });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: accountDetailsUrl(),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ADD_ACCOUNT_DETAILS_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: ADD_ACCOUNT_DETAILS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("ADD_ACCOUNT_DETAILS ERROR --> ", error);
    }
    return response;
  };
};

export const deleteAccountDetails = (id) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: DELETE_ACCOUNT_DETAILS });
      response = await doRequest({
        method: REQUEST_TYPE.DELETE,
        url: updateAccountDetailsUrl(id),
      });

      const { status, payload: { data, error } = {} } = response || {};

      if (id) {
        data["id"] = id;
      }
      if (status === true) {
        dispatch({
          type: DELETE_ACCOUNT_DETAILS_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: DELETE_ACCOUNT_DETAILS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("DELETE_ACCOUNT_DETAILS ERROR --> ", error);
    }
    return response;
  };
};

export const updateAccountDetails = (id, payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_ACCOUNT_DETAILS });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateAccountDetailsUrl(id),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: UPDATE_ACCOUNT_DETAILS_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: UPDATE_ACCOUNT_DETAILS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("UPDATE_ACCOUNT_DETAILS ERROR --> ", error);
    }
    return response;
  };
};

function accountDetailsReducer(state, data) {
  const { account_details = {} } = data || {};
  if (Object.keys(account_details).length > 0) {
    return {
      ...state,
      ...account_details,
    };
  } else {
    return state;
  }
}

function deleteAccountDetailsComplete(state, data) {
  const { id } = data || {};
  if (id) {
    const { [id.toString()]: detail, ...rest } = state;
    return {
      ...rest,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, payload } = action || {};
  switch (type) {
    case DELETE_ACCOUNT_DETAILS_COMPLETE:
      return deleteAccountDetailsComplete(state, payload);
    default:
      return accountDetailsReducer(state, payload);
  }
};
