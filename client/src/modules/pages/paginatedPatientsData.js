import { combineReducers } from "redux";
import paginated_all_patients from "./allPatients";
import paginated_watchlist_patients from "./watchlistedPatients";

const paginatedPatientIdsReducer = combineReducers({
  paginated_all_patients,
  paginated_watchlist_patients,
});

export default (state, action) => {
  return paginatedPatientIdsReducer(state, action);
};
