import { withRouter } from "react-router-dom";
import Dashboard from "../../Components/Dashboard";
import { signOut, getInitialData } from "../../modules/auth";
import { addPatient } from "../../modules/patients";
import { searchMedicine } from "../../modules/medicines";
import { searchTreatment } from "../../modules/treatments";
import { searchCondition } from "../../modules/conditions";
import { searchSeverity } from "../../modules/severity";
import { getGraphs, updateGraphs } from "../../modules/graphs";
import { connect } from "react-redux";
import { closePopUp } from "../../modules/chat";
import { fetchChatAccessToken } from "../../modules/twilio";
import { searchPatientFromNum } from "../../modules/patients";
import {
  addToWatchlist,
  removePatientFromWatchlist
} from "../../modules/doctors";
import { showVerifyModal } from "../../modules/pages/features";
import { getMissedAppointmentsForDoc } from "../../modules/appointments";
import { getMissedVitalsForDoc } from "../../modules/vitals";
import { getMissedMedicationsForDoc } from "../../modules/medications";
import { getAllFeatures } from "../../modules/featuresMappings";

const mapStateToProps = state => {
  const {
    graphs,
    auth: { authPermissions = [], authenticated_user = 1 } = {},
    treatments = {},
    conditions = {},
    pages: { ui_features = {} } = {},
    severity = {},
    chats,
    drawer,
    twilio,
    patients,
    doctors = {},
    features = {},
    features_mappings = {}
  } = state;
  return {
    graphs,
    treatments,
    conditions,
    severity,
    authPermissions,
    chats,
    drawer,
    twilio,
    patients,
    doctors,
    authenticated_user,
    ui_features,
    features,
    features_mappings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut()),
    getGraphs: () => dispatch(getGraphs()),
    updateGraphs: data => dispatch(updateGraphs(data)),
    getInitialData: () => dispatch(getInitialData()),
    searchMedicine: value => dispatch(searchMedicine(value)),
    searchCondition: value => dispatch(searchCondition(value)),
    searchTreatment: value => dispatch(searchTreatment(value)),
    searchSeverity: value => dispatch(searchSeverity(value)),
    addPatient: data => dispatch(addPatient(data)),
    closePopUp: () => dispatch(closePopUp()),
    fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
    searchPatientFromNum: value => dispatch(searchPatientFromNum(value)),
    addToWatchlist: patient_id => dispatch(addToWatchlist(patient_id)),
    removePatientFromWatchlist: patient_id =>
      dispatch(removePatientFromWatchlist(patient_id)),
    showVerifyModal: data => dispatch(showVerifyModal(data)),
    getMissedAppointmentsForDoc: () => dispatch(getMissedAppointmentsForDoc()),
    getMissedVitalsForDoc: () => dispatch(getMissedVitalsForDoc()),
    getMissedMedicationsForDoc: () => dispatch(getMissedMedicationsForDoc()),
    getAllFeatures: () => dispatch(getAllFeatures())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
