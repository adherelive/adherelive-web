import { combineReducers } from "redux";
import graphs from "./graphs";
import user from "./user";
import auth from "./auth";
import drawer from "./drawer";

const rootReducer = combineReducers({
  auth,
  user,
  graphs,
  drawer
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
