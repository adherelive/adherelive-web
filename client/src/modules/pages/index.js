import { combineReducers } from "redux";
import patient_ids from "./patients";
import treatment_ids from "./treatments";

const rootReducer = combineReducers({
  patient_ids,
  treatment_ids
});

export default (state, action) => {
  return rootReducer(state, action);
};
