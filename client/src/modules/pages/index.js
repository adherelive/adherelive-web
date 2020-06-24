import { combineReducers } from "redux";
import patient_ids from "./patients";
import treatment_ids from "./treatments";
import chat_ids from "./chats";
import doctor_ids from "./doctors";
import provider_ids from "./providers";
import user_ids from "./users";

const rootReducer = combineReducers({
  patient_ids,
  treatment_ids,
  doctor_ids,
  provider_ids,
  chat_ids,
  user_ids
});

export default (state, action) => {
  return rootReducer(state, action);
};
