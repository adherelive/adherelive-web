import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";

import {
  getAllProvidersUrl,
  updateProviderUrl,
} from "../../Helper/urls/provider";

import { getAllTransactionsUrl } from "../../Helper/urls/transactions";

export const GET_ALL_TRANSACTIONS_START = "GET_ALL_TRANSACTIONS_START";
export const GET_ALL_TRANSACTIONS_COMPLETE = "GET_ALL_TRANSACTIONS_COMPLETE";
export const GET_ALL_TRANSACTIONS_FAILED = "GET_ALL_TRANSACTIONS_FAILED";

export const GET_ALL_PROVIDERS_START = "GET_ALL_PROVIDERS_START";
export const GET_ALL_PROVIDERS_COMPLETE = "GET_ALL_PROVIDERS_COMPLETE";
export const GET_ALL_PROVIDERS_FAILED = "GET_ALL_PROVIDERS_FAILED";

export const ADD_PROVIDER_START = "ADD_PROVIDER_START";
export const ADD_PROVIDER_COMPLETE = "ADD_PROVIDER_COMPLETE";
export const ADD_PROVIDER_FAILED = "ADD_PROVIDER_FAILED";

export const UPDATE_PROVIDER_START = "UPDATE_PROVIDER_START";
export const UPDATE_PROVIDER_COMPLETE = "UPDATE_PROVIDER_COMPLETE";
export const UPDATE_PROVIDER_FAILED = "UPDATE_PROVIDER_FAILED";

export const getAllProviders = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_PROVIDERS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAllProvidersUrl(),
      });

      // console.log("78654546576877653546576654565768 --------->",response);

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_ALL_PROVIDERS_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_ALL_PROVIDERS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET_ALL_PROVIDERS ERROR --> ", error);
    }
    return response;
  };
};

export const getAllTransactions = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_ALL_TRANSACTIONS_START });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: getAllTransactionsUrl(),
      });

      // console.log("78654546576877653546576654565768 --------->",response);

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: GET_ALL_TRANSACTIONS_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: GET_ALL_TRANSACTIONS_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("GET_ALL_TRANSACTIONS ERROR --> ", error);
    }
    return response;
  };
};

export const addProvider = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: ADD_PROVIDER_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: getAllProvidersUrl(),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: ADD_PROVIDER_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: ADD_PROVIDER_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("ADD_PROVIDER_FAILED ERROR --> ", error);
    }
    return response;
  };
};

export const updateProvider = (id, payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_PROVIDER_START });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: updateProviderUrl(id),
        data: payload,
      });

      const { status, payload: { data, error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: UPDATE_PROVIDER_COMPLETE,
          data: data,
          payload: data,
        });
      } else {
        dispatch({
          type: UPDATE_PROVIDER_FAILED,
          error,
        });
      }
    } catch (error) {
      console.log("UPDATE_PROVIDER_FAILED ERROR --> ", error);
    }
    return response;
  };
};

function providersReducer(state, data) {
  const { providers } = data || {};
  if (providers) {
    return {
      ...state,
      ...providers,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return providersReducer(state, data);
  }
};
