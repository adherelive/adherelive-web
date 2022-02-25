function exerciseContentsReducer(state, data) {
  const { exercise_contents } = data || {};
  if (exercise_contents) {
    return {
      ...state,
      ...exercise_contents,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return exerciseContentsReducer(state, data);
  }
};
