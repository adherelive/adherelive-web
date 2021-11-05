import { connect } from "react-redux";
import PatientTable from "../../Components/Patient/table";
import { withRouter } from "react-router-dom";
import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import {
  addToWatchlist,
  removePatientFromWatchlist,
} from "../../modules/doctors";

const mapStateToProps = (state) => {
  const {
    patients: temp_patients = {},
    doctors = {},
    providers = {},
    treatments = {},
    conditions = {},
    severity = {},
    pages: { patient_ids = [], chat_ids = [] } = {},
    chats = {},
    users,
    auth: { authPermissions = [], authenticated_user } = {},
    care_plans,
  } = state;

  const { watchlist_patient_ids = [] } = Object.values(doctors)[0] || {};

  const patients = Object.keys(temp_patients)
    .filter((key) => watchlist_patient_ids.includes(parseInt(key)))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: temp_patients[key],
      };
    }, {});

  return {
    patient_ids,
    chat_ids,
    patients,
    doctors,
    providers,
    treatments,
    conditions,
    severity,
    chats,
    users,
    care_plans,
    authPermissions,
    authenticated_user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openPatientDetailsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.PATIENT_DETAILS, payload })),
    addToWatchlist: (patient_id) => dispatch(addToWatchlist(patient_id)),
    removePatientFromWatchlist: (patient_id) =>
      dispatch(removePatientFromWatchlist(patient_id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientTable)
);
