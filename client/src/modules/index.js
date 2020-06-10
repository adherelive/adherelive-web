import { combineReducers } from "redux";
import graphs from "./graphs";
import users from "./user";
import auth from "./auth";
import patients from "./patients";
import doctors from "./doctors";
import providers from "./providers";
import treatments from "./treatments";
import medications from "./medications";
import chats from "./chat";
import pages from "./pages";
import drawer from "./drawer";
import appointments from "./appointments";
import medication_reminders from "./medicationReminder";
import onBoarding from "./onBoarding";

const rootReducer = combineReducers({
  auth,
  users,
  graphs,
  patients,
  doctors,
  providers,
  treatments,
  medications,
  pages,
  chats,
  drawer,
  appointments,
  medication_reminders,
  onBoarding
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
