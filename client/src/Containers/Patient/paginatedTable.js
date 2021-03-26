import { connect } from "react-redux";
// import PatientTable from "../../Components/Patient/table";
import PatientTable from "../../Components/Patient/temp";
import { withRouter } from "react-router-dom";
import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import {addToWatchlist,removePatientFromWatchlist} from "../../modules/doctors";
import {getPatientsPaginated} from "../../modules/pages/paginatedPatients";

const mapStateToProps = state => {
  const {
    patients = {},
    doctors = {},
    providers = {},
    treatments = {},
    conditions = {},
    severity = {},
    pages: { patient_ids = [], chat_ids = [] , paginated_patient_ids = {} , paginated_patients = {} } = {},
    chats = {},
    users,
    auth: { authPermissions = [], authenticated_user } = {},
    care_plans
  } = state;


  

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
    paginated_patient_ids,
    paginated_patients
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openPatientDetailsDrawer: (payload) => dispatch(open({ type: DRAWER.PATIENT_DETAILS, payload })),
    addToWatchlist:(patient_id) => dispatch(addToWatchlist(patient_id)),
    removePatientFromWatchlist:(patient_id) => dispatch(removePatientFromWatchlist(patient_id)),
    openEditPatientDrawer: (payload) => dispatch(open({ type: DRAWER.EDIT_PATIENT, payload })),
    getPatientsPaginated :({offset,watchlist,sort_by_name,created_at_order,name_order}) => dispatch(getPatientsPaginated({offset,watchlist,sort_by_name,created_at_order,name_order}))

  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientTable)
);
