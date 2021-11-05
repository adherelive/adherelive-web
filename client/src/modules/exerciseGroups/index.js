function exerciseGroupsReducer(state, data) {
  const { exercise_groups } = data || {};
  if (exercise_groups) {
    return {
      ...state,
      ...exercise_groups,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return exerciseGroupsReducer(state, data);
  }
};
