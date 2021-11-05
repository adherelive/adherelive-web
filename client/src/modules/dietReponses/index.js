function dietResponseReducer(state, data) {
  const { diet_responses } = data || {};
  if (diet_responses) {
    return {
      ...state,
      ...diet_responses,
    };
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return dietResponseReducer(state, data);
  }
};
