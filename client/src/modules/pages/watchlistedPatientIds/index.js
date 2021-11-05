import { GET_PATIENT_PAGINATED_COMPLETED } from "../paginatedPatients";

function getWatchlistPatientIdsReducer(state, data) {
  const { watchlist, offset, sort_by_name, patient_ids } = data || {};
  const paginated_watchlist_patient_ids = {
    ...state,
    [offset]: { ...patient_ids },
  };

  if (watchlist && offset && watchlist === "1") {
    return {
      ...paginated_watchlist_patient_ids,
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
