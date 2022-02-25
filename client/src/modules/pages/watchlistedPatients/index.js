import { GET_PATIENT_PAGINATED_COMPLETED } from "../paginatedPatients";

function getWatchlistPatientIdsReducer(state, data) {
  const { watchlist, offset, rowData } = data || {};
  const paginated_watchlist_patients = { ...state, [offset]: rowData };

  if (watchlist && offset && watchlist === "1") {
    return {
      ...paginated_watchlist_patients,
    };
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;

  switch (type) {
    case GET_PATIENT_PAGINATED_COMPLETED:
      return getWatchlistPatientIdsReducer(state, data);
    default:
      return getWatchlistPatientIdsReducer(state, data);
  }
};
