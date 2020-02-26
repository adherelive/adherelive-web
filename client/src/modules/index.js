import { combineReducers } from "redux";
import graphs from "./graphs";
import user from "./user";
import auth from "./auth";

<<<<<<< HEAD
import auth from "./auth";
import users from "./user";

const rootReducer = combineReducers({
    auth,
    users
=======
const rootReducer = combineReducers({
  auth,
  user,
  graphs
>>>>>>> 137ad1c8b06e0c64e5950edd45fc6f1de2e85eb9
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
