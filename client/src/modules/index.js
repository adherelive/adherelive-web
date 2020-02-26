import { combineReducers } from "redux";

import auth from "./auth";
import users from "./user";

const rootReducer = combineReducers({
    auth,
    users
});

export default (state, action) => {
  if (action.type === "SIGNING_OUT_COMPLETED") {
    Object.keys(state).forEach(keys => {
      if (keys !== "auth" && keys !== "countryCities") {
        state[keys] = {};
      }
    });
  }
  return rootReducer(state, action);
};
