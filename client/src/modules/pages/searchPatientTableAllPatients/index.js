import {
  GET_SEARCH_TREATMENT_PATIENTS_COMPLETED,
  GET_SEARCH_DIAGNOSIS_PATIENTS_COMPLETED,
} from "../paginatedPatients";

function getSearchAllPatientIdsReducer(state, data) {
  const { watchlist, offset, rowData, patient_table_search } = data || {};

  const patient_table_search_all_patients = { ...state, [offset]: rowData };

  if (watchlist && offset && watchlist === "0" && patient_table_search) {
    return {
      ...patient_table_search_all_patients,
    };
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;

  switch (type) {
    case GET_SEARCH_TREATMENT_PATIENTS_COMPLETED:
      return getSearchAllPatientIdsReducer(state, data);
    case GET_SEARCH_DIAGNOSIS_PATIENTS_COMPLETED:
      return getSearchAllPatientIdsReducer(state, data);
    default:
      return state;
  }
};
