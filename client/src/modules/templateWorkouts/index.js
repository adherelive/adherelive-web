function templateWorkoutsReducer(state, data) {
  const { template_workouts } = data || {};
  if (template_workouts) {
    return {
      ...state,
      ...template_workouts,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return templateWorkoutsReducer(state, data);
  }
};
