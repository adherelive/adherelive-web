import {
  GET_PRIVATE_MEDICINES_COMPLETED,
  RESET_SEARCH_PRIVATE,
  MAKE_MEDICINE_PUBLIC_COMPLETED,
  DELETE_MEDICINE_COMPLETED,
} from "../../medicines";

const PRIVATE = "private";

function getPrivateSearchMedicinesReducer(state, data) {
  const { offset = 0, medicines, type = "", searchText = "" } = data || {};
  const search_private_medicines = { ...state, [offset]: medicines };

  if (medicines && type === PRIVATE && searchText !== "") {
    return {
      ...search_private_medicines,
    };
  } else {
    return state;
  }
}

function resetPrivateReducer(state, data) {
  return [];
}

function getRemaingSearchedAfterMakingPublic(state, data) {
  const { offset = 0 } = data || {};
  const { medicines = {} } = data;
  if (medicines) {
    const id = Object.keys(medicines)[0] || null;
    const { [id.toString()]: medicine, ...rest } = state[offset] || {};
    const remainingKeyMedicinesLength = Object.keys(rest).length;
    return { ...rest };
  } else {
    return state;
  }
}

function getRemainingPrivateSearchedAfterDelete(state, data) {
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
      return getRemainingPrivateSearchedAfterDelete(state, data);
    case GET_PRIVATE_MEDICINES_COMPLETED:
      return getPrivateSearchMedicinesReducer(state, data);
    case RESET_SEARCH_PRIVATE:
      return resetPrivateReducer(state, data);
    case MAKE_MEDICINE_PUBLIC_COMPLETED:
      return getRemaingSearchedAfterMakingPublic(state, data);
    default:
      return getPrivateSearchMedicinesReducer(state, data);
  }
};
