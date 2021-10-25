import { combineReducers } from "redux";
import patient_table_search_all_patients from "./searchPatientTableAllPatients";
import patient_table_search_watchlist_patients from "./searchPatientTableWatchlistPatients";

const searchPatientTableReducer = combineReducers({
  patient_table_search_all_patients,
  patient_table_search_watchlist_patients,
});

export default (state, action) => {
  return searchPatientTableReducer(state, action);
};
