import { GET_PATIENT_PAGINATED_COMPLETED } from "../paginatedPatients";

function getAllPatientIdsReducer(state, data) {
  const { watchlist, offset, rowData } = data || {};
  const paginated_all_patients = { ...state, [offset]: rowData };

  if (watchlist && offset && watchlist === "0") {
    return {
      ...paginated_all_patients,
    };
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;

  switch (type) {
    case GET_PATIENT_PAGINATED_COMPLETED:
      return getAllPatientIdsReducer(state, data);
    default:
      return state;
  }
};
