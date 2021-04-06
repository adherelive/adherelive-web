import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import * as UserRoleUrls from "../../Helper/urls/userRoles";

export const GET_USER_ROLES_START = "GET_USER_ROLES_START";
export const GET_USER_ROLES_COMPLETED = "GET_USER_ROLES_COMPLETED";
export const GET_USER_ROLES_FAILED = "GET_USER_ROLES_FAILED";

export const getUserRoles = () => {
    return async (dispatch) => {
        try {
            dispatch({type: GET_USER_ROLES_START});
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
        } catch(error) {
            console.log("userRoles module error", error);
        }
    };
};

function userRoleReducer(state, data) {
  const {user_roles} = data || {};
  if(user_roles) {
    return {
      ...state,
      ...user_roles,
    };
  } else {
    return state;
  }
}

export default (state = {}, actions) => {
    const {type, payload} = actions || {};
    switch(type) {
        default:
            return userRoleReducer(state, payload);
    }
};