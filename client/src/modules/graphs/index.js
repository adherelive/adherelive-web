import { GRAPH_INITIAL_STATE } from "../../data";
import * as Graphs from "../../Helper/urls/graphs";
import {
  REQUEST_TYPE,
  USER_CATEGORY,
  PATH,
  ONBOARDING_STATUS,
} from "../../constant";
import { doRequest } from "../../Helper/network";

export const GET_GRAPHS = "GET_GRAPHS";
export const GET_GRAPHS_COMPLETED = "GET_GRAPHS_COMPLETED";
export const GET_GRAPHS_COMPLETED_WITH_ERROR =
  "GET_GRAPHS_COMPLETED_WITH_ERROR";

export const UPDATE_GRAPHS = "UPDATE_GRAPHS";
export const UPDATE_GRAPHS_COMPLETED = "UPDATE_GRAPHS_COMPLETED";
export const UPDATE_GRAPHS_COMPLETED_WITH_ERROR =
  "UPDATE_GRAPHS_COMPLETED_WITH_ERROR";

function graphReducer(state, data) {
  const { charts } = data || {};
  if (charts) {
    return {
      ...state,
      ...charts,
    };
  } else {
    return state;
  }
}

export const getGraphs = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: GET_GRAPHS });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Graphs.getGraphsUrl(),
      });

      const {
        status,
        payload: { error = "", data: { charts = {} } = {} } = {},
      } = response || {};

      if (status === false) {
        dispatch({
          type: GET_GRAPHS_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        dispatch({
          type: GET_GRAPHS_COMPLETED,
          data: { charts },
        });
      }
    } catch (err) {
      console.log("err get patient careplan details", err);
      throw err;
    }

    return response;
  };
};

export const updateGraphs = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_GRAPHS });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Graphs.addGraphsUrl(),
        data: payload,
      });

      const {
        status,
        payload: { error = "", data: { charts = {} } = {} } = {},
      } = response || {};

      if (status === false) {
        dispatch({
          type: UPDATE_GRAPHS_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        dispatch({
          type: UPDATE_GRAPHS_COMPLETED,
          data: { charts },
        });
      }
    } catch (err) {
      console.log("err get patient careplan details", err);
      throw err;
    }

    return response;
  };
};

export default (state = GRAPH_INITIAL_STATE, action) => {
  const { data, type } = action;
  switch (type) {
    default:
      return graphReducer(state, data);
  }
};
