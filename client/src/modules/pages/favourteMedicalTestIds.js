import {
  GET_FAVOURITES_COMPLETED,
  MARK_FAVOURITE_COMPLETED,
  REMOVE_FAVOURITE_COMPLETED,
} from "../favouritesData";

function favouriteMedicalTestIdsReducer(state, data) {
  const { favourite_medical_test_ids } = data || {};
  if (favourite_medical_test_ids) {
    return [...favourite_medical_test_ids];
  } else {
    return state;
  }
}

function addedMedicalTestIdReducer(state, data) {
  const { id } = data || {};

  if (id) {
    return [...state, id];
  } else {
    return state;
  }
}

function removeFavouriteMedicalTestId(state, data) {
  const { removed_medical_test_id } = data || {};
  if (removed_medical_test_id) {
    const allIds = state;
    const index = allIds.indexOf(removed_medical_test_id);
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
      return favouriteMedicalTestIdsReducer(state, data);
    case MARK_FAVOURITE_COMPLETED:
      return addedMedicalTestIdReducer(state, data);
    case REMOVE_FAVOURITE_COMPLETED:
      return removeFavouriteMedicalTestId(state, data);
    default:
      return favouriteMedicalTestIdsReducer(state, data);
  }
};
