import { GET_ALL_MISSED_SCHEDULE_EVENTS_COMPLETED } from "../scheduleEvents";

function missedEventReducer(state, data) {
  const {
    missed_medications = {},
    missed_appointments = {},
    missed_vitals = {},
    missed_diets = {},
    missed_workouts = {},
  } = data || {};
  if (
    Object.keys(missed_medications).length > 0 ||
    Object.keys(missed_appointments).length > 0 ||
    Object.keys(missed_vitals).length > 0 ||
    Object.keys(missed_diets).length > 0 ||
    Object.keys(missed_workouts).length > 0
  ) {
    return {
      ...state,
      ...data,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case GET_ALL_MISSED_SCHEDULE_EVENTS_COMPLETED:
      return missedEventReducer(state, data);
    default:
      return state;
  }
};
