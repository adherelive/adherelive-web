import { ADD_VITAL_COMPLETED } from "../vitals";

function newVitalReducer(state, data) {
  const { vital_id = "" } = data || {};
  if (vital_id) {
    return [...state, vital_id];
  } else {
    return state;
  }
}

function vitalPageReducer(state, data) {
  const { vital_ids = [] } = data || {};
  if (vital_ids.length > 0) {
    return [...state, ...vital_ids];
  } else {
    return state;
  }
}

export default (state = [], action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_VITAL_COMPLETED:
      return newVitalReducer(state, payload);
    default:
      return vitalPageReducer(state, payload);
  }
};
