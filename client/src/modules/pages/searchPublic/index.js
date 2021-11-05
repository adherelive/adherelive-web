import {
  DELETE_MEDICINE_COMPLETED,
  GET_PUBLIC_MEDICINES_COMPLETED,
  RESET_SEARCH_PUBLIC,
} from "../../medicines";

const PUBLIC = "public";

function getPublicSearchMedicinesReducer(state, data) {
  const { offset = 0, medicines, type = "", searchText = "" } = data || {};
  const search_public_medicines = { ...state, [offset]: medicines };

  if (medicines && type === PUBLIC && searchText !== "") {
    return {
      ...search_public_medicines,
    };
  } else {
    return state;
  }
}

function resetPublicReducer(state, data) {
  return [];
}

function getRemainingPublicSearchedAfterDelete(state, data) {
  const { medicine_id, offset = null } = data || {};

  if (medicine_id) {
    const { [medicine_id.toString()]: medicine, ...rest } = state[offset] || {};

    if (medicine) {
      let updatedMed = { ...state };
      updatedMed[offset] = { ...rest };
      return {
        ...updatedMed,
      };
    } else {
      return state;
    }
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    case DELETE_MEDICINE_COMPLETED:
      return getRemainingPublicSearchedAfterDelete(state, data);
    case GET_PUBLIC_MEDICINES_COMPLETED:
      return getPublicSearchMedicinesReducer(state, data);
    case RESET_SEARCH_PUBLIC:
      return resetPublicReducer(state, data);

    default:
      return getPublicSearchMedicinesReducer(state, data);
  }
};
