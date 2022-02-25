import { connect } from "react-redux";
// import PatientTable from "../../Components/Patient/table";
import PatientTable from "../../Components/Patient/newTable";
import { withRouter } from "react-router-dom";
import { open } from "../../modules/drawer";
import { DRAWER } from "../../constant";
import {
  addToWatchlist,
  removePatientFromWatchlist,
} from "../../modules/doctors";
import {
  getPatientsPaginated,
  searchTreatmentPaginatedPatients,
  searchDiagnosisPaginatedPatients,
} from "../../modules/pages/paginatedPatients";

const mapStateToProps = (state) => {
  const {
    patients = {},
    doctors = {},
    providers = {},
    treatments = {},
    conditions = {},
    severity = {},
    pages: {
      patient_ids = [],
      chat_ids = [],
      paginated_patient_data: { paginated_all_patients = {} } = {},
      search_patient_table: { patient_table_search_all_patients = {} } = {},
    } = {},
    chats = {},
    users,
    auth: { authPermissions = [], authenticated_user, auth_role } = {},
    care_plans,
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
    paginated_patients: paginated_all_patients,
    search_treatments_patients: patient_table_search_all_patients,
    search_diagnosis_patients: patient_table_search_all_patients,
    auth_role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openPatientDetailsDrawer: (payload) =>
      dispatch(open({ type: DRAWER.PATIENT_DETAILS, payload })),
    addToWatchlist: (patient_id) => dispatch(addToWatchlist(patient_id)),
    removePatientFromWatchlist: (patient_id) =>
      dispatch(removePatientFromWatchlist(patient_id)),
    openEditPatientDrawer: (payload) =>
      dispatch(open({ type: DRAWER.EDIT_PATIENT, payload })),
    getPatientsPaginated: ({
      sort_createdAt,
      sort_name,
      filter_diagnosis,
      filter_treatment,
      offset,
      watchlist = 0,
    }) =>
      dispatch(
        getPatientsPaginated({
          sort_createdAt,
          sort_name,
          filter_diagnosis,
          filter_treatment,
          offset,
          watchlist,
        })
      ),
    searchTreatmentPaginatedPatients: ({
      filter_treatment,
      offset,
      watchlist = 0,
    }) =>
      dispatch(
        searchTreatmentPaginatedPatients({
          filter_treatment,
          offset,
          watchlist,
        })
      ),
    searchDiagnosisPaginatedPatients: ({
      filter_diagnosis,
      offset,
      watchlist = 0,
    }) =>
      dispatch(
        searchDiagnosisPaginatedPatients({
          filter_diagnosis,
          offset,
          watchlist,
        })
      ),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PatientTable)
);
