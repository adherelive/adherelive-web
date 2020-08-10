import { combineReducers } from "redux";
import graphs from "./graphs";
import users from "./user";
import auth from "./auth";
import patients from "./patients";
import doctors from "./doctors";
import providers from "./providers";
import appointment_types from "./appointmentType";
import type_descriptions from "./typeDescription";
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
import static_templates from "./staticTemplates";
import doctor_qualifications from "./doctorQualifications";
import doctor_registrations from "./doctorRegistrations";
import template_appointments from "./templateAppointments";
import template_medications from "./templateMedications";
import care_plan_templates from "./carePlanTemplates";
import upload_documents from "./uploadDocuments";
import show_template_drawer from "./showDrawer";
import colleges from "./colleges";
import degrees from "./degrees";
import councils from "./councils";
import twilio from "./twilio";

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
  upload_documents,
  template_appointments,
  template_medications,
  care_plan_templates,
  show_template_drawer,
  colleges,
  degrees,
  councils,
  static_templates,
  twilio
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
