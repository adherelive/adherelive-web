import {
  GET_FAVOURITES_COMPLETED,
  MARK_FAVOURITE_COMPLETED,
  REMOVE_FAVOURITE_COMPLETED,
} from "../favouritesData";

function favouriteMedicineIdsReducer(state, data) {
  const { favourite_medicine_ids } = data || {};
  if (favourite_medicine_ids) {
    return [...favourite_medicine_ids];
  } else {
    return state;
  }
}

function addedMedicineIdReducer(state, data) {
  const { id } = data || {};

  if (id) {
    return [...state, id];
  } else {
    return state;
  }
}

function removeFavouriteMedicineId(state, data) {
  const { removed_medicine_id } = data || {};
  if (removed_medicine_id) {
    const allIds = state;
    const index = allIds.indexOf(removed_medicine_id);
    if (index > -1) {
      allIds.splice(index, 1);
      let updated_arr = [];

      for (let each of allIds) {
        updated_arr.push(each);
      }
      return [...updated_arr];
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
    case GET_FAVOURITES_COMPLETED:
      return favouriteMedicineIdsReducer(state, data);
    case MARK_FAVOURITE_COMPLETED:
      return addedMedicineIdReducer(state, data);
    case REMOVE_FAVOURITE_COMPLETED:
      return removeFavouriteMedicineId(state, data);
    default:
      return favouriteMedicineIdsReducer(state, data);
  }
};
