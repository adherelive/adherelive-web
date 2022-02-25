import { GET_WORKOUT_DETAILS_COMPLETED } from "../workouts";

function getAllWorkoutDetailsReducer(state, data) {
  const { days, repetitions, start_time = {} } = data || {};
  if (days && days.length) {
    return {
      ...state,
      days,
      repetitions,
      start_time,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case GET_WORKOUT_DETAILS_COMPLETED:
      return getAllWorkoutDetailsReducer(state, data);
    default:
      return getAllWorkoutDetailsReducer(state, data);
  }
};
