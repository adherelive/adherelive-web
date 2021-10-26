import {
  MAP_MEDICINE_TO_PUBLIC,
  GET_PUBLIC_MEDICINES_COMPLETED,
  DELETE_MEDICINE_COMPLETED,
} from "../../medicines";

const PUBLIC = "public";

function getPublicAdminMedicinesReducer(state, data) {
  const { offset = 0, medicines, type = "" } = data || {};
  const public_medicines = { ...state, [offset]: medicines };

  if (medicines && type === PUBLIC) {
    return {
      ...public_medicines,
    };
  } else {
    return state;
  }
}

function mapMedicineToPublicReducer(state, data) {
  const { medicine } = data || {};
  if (medicine) {
    const { ["0"]: existing, ...rest } = state;
    const public_medicines = { ["0"]: { ...existing, ...medicine } };
    return {
      ...public_medicines,
    };
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
    case GET_PUBLIC_MEDICINES_COMPLETED:
      return getPublicAdminMedicinesReducer(state, data);
    case MAP_MEDICINE_TO_PUBLIC:
      return mapMedicineToPublicReducer(state, data);
    case DELETE_MEDICINE_COMPLETED:
      return deleteMedicineReducer(state, data);
    default:
      return getPublicAdminMedicinesReducer(state, data);
  }
};
