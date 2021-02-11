import { combineReducers } from "redux";
import patient_ids from "./patients";
import treatment_ids from "./treatments";
import condition_ids from "./conditions";
import severity_ids from "./severity";
import chat_ids from "./chats";
import doctor_ids from "./doctors";
import provider_ids from "./providers";
import user_ids from "./users";
import vital_ids from "./vitals";
import ui_features from "./features";
import dashboard from "./dashboard";
import report_ids from "./reports";
import transaction_ids from "./transactions";
import care_plan_template_ids from "./careplanTemplates";

const rootReducer = combineReducers({
  patient_ids,
  treatment_ids,
  condition_ids,
  severity_ids,
  doctor_ids,
  provider_ids,
  chat_ids,
  user_ids,
  vital_ids,
  ui_features,
  dashboard,
  report_ids,
  transaction_ids,
  care_plan_template_ids
});

export default (state, action) => {
  return rootReducer(state, action);
};
