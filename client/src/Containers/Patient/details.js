import PatientDetails from "../../Components/Patient/details";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { open, close } from "../../modules/drawer";
import { getMedications } from "../../modules/medications";
import {
  getAppointments,
  getAppointmentsDetails,
} from "../../modules/appointments";
import {
  requestConsent,
  consentVerify,
  getPatientDetailsById,
} from "../../modules/patients";
import { searchMedicine } from "../../modules/medicines";
import { getPatientCarePlanDetails } from "../../modules/carePlans";
import { addCarePlanMedicationsAndAppointments } from "../../modules/carePlans";
import { DRAWER } from "../../constant";
import { openPopUp, closePopUp } from "../../modules/chat";
import { fetchChatAccessToken } from "../../modules/twilio";
import {
  getLastVisitAlerts,
  markAppointmentComplete,
} from "../../modules/scheduleEvents/index";
import { addCareplanForPatient } from "../../modules/patients";
import { storeAppointmentDocuments } from "../../modules/uploadDocuments";
import { getSymptomTimeLine } from "../../modules/symptoms";
import { fetchReports } from "../../modules/reports";
import { getVitalOccurence } from "../../modules/vital_occurence";
import { searchVital } from "../../modules/vital_templates";
import { setUnseenNotificationCount } from "../../modules/pages/NotificationCount";
import { resetNotificationRedirect } from "../../modules/notificationRedirect";
import {
  getAllTemplatesForDoctor,
  getAllTemplatesForDoctorUsingQuery,
} from "../../modules/carePlanTemplates";

const mapStateToProps = (state, ownProps) => {
  const {
    users = {},
    appointments,
    medications,
    medicines = {},
    patients = {},
    care_plans = {},
    doctors = {},
    treatments = {},
    conditions = {},
    template_medications = {},
    template_diets = {},
    template_workouts = {},
    template_appointments = {},
    template_vitals = {},
    care_plan_templates = {},
    severity = {},
    show_template_drawer = {},
    auth: {
      authPermissions = [],
      authenticated_user = 1,
      authenticated_category,
      auth_role,
      notificationToken = "",
      feedId = "",
    } = {},
    chats,
    drawer,
    pages: { care_plan_template_ids = [] } = {},
    twilio = {},
    symptoms = {},
    schedule_events = {},
    features = {},
    features_mappings = {},
    reports = {},
    repeat_intervals = {},
    vital_templates = {},
    user_roles = {},
    providers = {},
    notification_redirect = {},
    diets = {},
    exercise_contents = {},
  } = state;

  // const { id } = ownprops;
  const user_details = users["3"] || {};
  const {
    location: {
      state: {
        // showTemplateDrawer = false,
        currentCarePlanId = 0,
      } = {},
    } = {},
  } = ownProps;
  return {
    auth_role,
    user_details,
    appointments,
    users,
    treatments,
    conditions,
    severity,
    medications,
    medicines,
    patients,
    care_plans,
    doctors,
    care_plan_templates,
    template_appointments,
    template_medications,
    template_diets,
    template_workouts,
    template_vitals,
    show_template_drawer,
    currentCarePlanId,
    authPermissions,
    chats,
    twilio,
    drawer,
    symptoms,
    care_plan_template_ids,
    authenticated_user,
    schedule_events,
    features,
    features_mappings,
    authenticated_category,
    reports,
    repeat_intervals,
    vital_templates,
    user_roles,
    providers,
    notification_redirect,
    notificationToken,
    feedId,
    diets,
    exercise_contents,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openAppointmentDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_APPOINTMENT, payload })),
    openMReminderDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_MEDICATION_REMINDER, payload })),
    openVitalsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_VITALS, payload })),
    openEditVitalsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_VITALS, payload })),
    openSymptomsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.SYMPTOMS, payload })),
    getMedications: (id) => dispatch(getMedications(id)),
    close: () => dispatch(close()),
    getAppointments: (id) => dispatch(getAppointments(id)),
    getAppointmentsDetails: () => dispatch(getAppointmentsDetails()),
    getPatientCarePlanDetails: (patientId) =>
      dispatch(getPatientCarePlanDetails(patientId)),
    getPatientDetailsById: (patientId) =>
      dispatch(getPatientDetailsById(patientId)),
    getLastVisitAlerts: (patientId) => dispatch(getLastVisitAlerts(patientId)),
    searchMedicine: (value) => dispatch(searchMedicine(value)),
    addCarePlanMedicationsAndAppointments: (payload, carePlanId) =>
      dispatch(addCarePlanMedicationsAndAppointments(payload, carePlanId)),
    openEditAppointmentDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_APPOINTMENT, payload })),
    openEditMedicationDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_MEDICATION, payload })),
    openPopUp: () => dispatch(openPopUp()),
    closePopUp: () => dispatch(closePopUp()),
    fetchChatAccessToken: (userId) => dispatch(fetchChatAccessToken(userId)),
    requestConsent: (patientId) => dispatch(requestConsent(patientId)),
    consentVerify: (data) => dispatch(consentVerify(data)),
    markAppointmentComplete: (id) => dispatch(markAppointmentComplete(id)),
    openAddCareplanDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_CAREPLAN, payload })),
    addCareplanForPatient: (patient_id, data) =>
      dispatch(addCareplanForPatient(patient_id, data)),
    openEditPatientDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_PATIENT, payload })),
    storeAppointmentDocuments: (data) =>
      dispatch(storeAppointmentDocuments(data)),
    openAddReportsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_REPORT, payload })),
    getSymptomTimeLine: (patientId) => dispatch(getSymptomTimeLine(patientId)),
    fetchPatientReports: (id) => dispatch(fetchReports(id)),
    getVitalOccurence: () => dispatch(getVitalOccurence()),
    searchVital: (data) => dispatch(searchVital(data)),
    setUnseenNotificationCount: (count) =>
      dispatch(setUnseenNotificationCount(count)),
    openAddDietDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_DIET, payload })),
    openAddWorkoutDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_WORKOUT, payload })),
    resetNotificationRedirect: () => dispatch(resetNotificationRedirect()),
    getAllTemplatesForDoctor: () => dispatch(getAllTemplatesForDoctor()),
    getAllTemplatesForDoctorUsingQuery: (text) =>
      dispatch(getAllTemplatesForDoctorUsingQuery(text)),

    openAddSecondaryDoctorDrawer: (payload) =>
      dispatch(open({ type: DRAWER.ADD_SECONDARY_DOCTOR, payload })),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientDetails)
);
