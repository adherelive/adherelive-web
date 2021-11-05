import { GET_USER_ROLES_COMPLETED } from "../../userRoles";

function userRoleReducer(state, data) {
  const { user_role_ids } = data || {};
  if (user_role_ids) {
    return [...state, ...user_role_ids];
  } else {
    return state;
  }
}

export default (state = [], actions) => {
  const { type, payload } = actions || {};
  switch (type) {
    case GET_USER_ROLES_COMPLETED:
      return userRoleReducer(state, payload);
    default:
      return state;
  }
};
