function workoutResponseIdsReducer(state, data) {
  const { workout_response_ids = [] } = data || {};
  if (workout_response_ids.length > 0) {
    return [...state, ...workout_response_ids];
  } else {
    return state;
  }
}

export default (state = [], action = {}) => {
  const { type, data } = action;
  switch (type) {
    default:
      return workoutResponseIdsReducer(state, data);
  }
};
