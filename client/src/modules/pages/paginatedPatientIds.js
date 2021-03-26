import { combineReducers } from "redux";
import paginated_all_patient_ids from "./allPatientIds";
import paginated_watchlist_patient_ids from "./watchlistedPatientIds";

const paginatedPatientIdsReducer = combineReducers({
    paginated_all_patient_ids,
    paginated_watchlist_patient_ids
});

export default (state, action) => {
    return paginatedPatientIdsReducer(state, action);
};

