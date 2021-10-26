import {
  GET_PRIVATE_MEDICINES_COMPLETED,
  MAKE_MEDICINE_PUBLIC_COMPLETED,
  DELETE_MEDICINE_COMPLETED,
} from "../../medicines";

const PRIVATE = "private";

function getPrivateAdminMedicinesReducer(state, data) {
  const { offset = 0, medicines, type = "" } = data || {};
  const private_medicines = { ...state, [offset]: medicines };
  if (medicines && type === PRIVATE) {
    return {
      ...private_medicines,
    };
  } else {
    return state;
  }
}

function getMakeMedicinesPublicReducer(state, data) {
  const { offset = 0 } = data || {};
  const { medicines = {} } = data;
  const id = Object.keys(medicines)[0] || null;
  const { [id.toString()]: medicine, ...rest } = state[offset] || {};
  const remainingKeyMedicinesLength = Object.keys(rest).length;

  if (remainingKeyMedicinesLength === 0) {
    // to remove last medicine from private page after making public
    return rest;
  } else {
    return state;
  }
}

function deleteMedicineReducer(state, data) {
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
    case GET_PRIVATE_MEDICINES_COMPLETED:
      return getPrivateAdminMedicinesReducer(state, data);
    case MAKE_MEDICINE_PUBLIC_COMPLETED:
      return getMakeMedicinesPublicReducer(state, data);
    case DELETE_MEDICINE_COMPLETED:
      return deleteMedicineReducer(state, data);
    default:
      return getPrivateAdminMedicinesReducer(state, data);
  }
};
