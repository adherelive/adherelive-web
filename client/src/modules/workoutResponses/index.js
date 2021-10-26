function workoutResponseReducer(state, data) {
  const { workout_responses } = data || {};

  if (workout_responses) {
    return {
      ...state,
      ...workout_responses,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return workoutResponseReducer(state, data);
  }
};
