import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import * as UserRoleUrls from "../../Helper/urls/userRoles";

export const GET_USER_ROLES_START = "GET_USER_ROLES_START";
export const GET_USER_ROLES_COMPLETED = "GET_USER_ROLES_COMPLETED";
export const GET_USER_ROLES_FAILED = "GET_USER_ROLES_FAILED";

export const SWITCH_USER_ROLE_START = "SWITCH_USER_ROLE_START";
export const SWITCH_USER_ROLE_COMPLETED = "SWITCH_USER_ROLE_COMPLETED";
export const SWITCH_USER_ROLE_FAILED = "SWITCH_USER_ROLE_FAILED";

export const getUserRoles = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_USER_ROLES_START });
      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: UserRoleUrls.getUserRoles(),
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({ type: GET_USER_ROLES_COMPLETED, payload: data, data });
      } else {
        dispatch({ type: GET_USER_ROLES_FAILED, payload: error });
      }
    } catch (error) {
      console.log("userRoles module error", error);
    }
  };
};

export const switchUserRole = (payload) => {
  return async (dispatch) => {
    try {
      dispatch({ type: SWITCH_USER_ROLE_START });
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: UserRoleUrls.switchUserRoles(),
        data: payload,
      });

      const { status, payload: { data = {}, error = {} } = {} } =
        response || {};
      if (status === true) {
        dispatch({ type: SWITCH_USER_ROLE_COMPLETED, payload: data, data });
      } else {
        dispatch({ type: SWITCH_USER_ROLE_FAILED, payload: error });
      }
    } catch (error) {
      console.log("switchUserRole module error", error);
    }
  };
};

function userRoleReducer(state, data) {
  const { user_roles } = data || {};
  if (user_roles) {
    return {
      ...state,
      ...user_roles,
    };
  } else {
    return state;
  }
}

export default (state = {}, actions) => {
  const { type, payload } = actions || {};
  switch (type) {
    default:
      return userRoleReducer(state, payload);
  }
};
