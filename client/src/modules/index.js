import { combineReducers } from "redux";
import graphs from "./graphs";
import users from "./user";
import auth from "./auth";
import patients from "./patients";
import doctors from "./doctors";
import providers from "./providers";
import treatments from "./treatments";
import conditions from "./conditions";
import severity from "./severity";
import medications from "./medications";
import chats from "./chat";
import pages from "./pages";
import drawer from "./drawer";
import appointments from "./appointments";
import medicines from "./medicines";
import other_details from "./otherDetails";
import onBoarding from "./onBoarding";
import care_plans from "./carePlans";
import doctor_clinics from "./doctorClinics";
import doctor_qualifications from "./doctorQualifications";
import doctor_registrations from "./doctorRegistrations";
import upload_documents from "./uploadDocuments";

const rootReducer = combineReducers({
  auth,
  users,
  graphs,
  patients,
  doctors,
  providers,
  treatments,
  conditions,
  severity,
  medications,
  pages,
  chats,
  drawer,
  appointments,
  medicines,
  other_details,
  onBoarding,
  care_plans,
  doctor_clinics,
  doctor_qualifications,
  doctor_registrations,
  upload_documents
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
