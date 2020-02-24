import { combineReducers } from "redux";

const rootReducer = combineReducers({});

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
