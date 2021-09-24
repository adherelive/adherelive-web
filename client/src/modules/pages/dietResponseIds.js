function dietResponseIdsReducer(state, data) {
  const { diet_response_ids = [] } = data || {};
  if (diet_response_ids.length > 0) {
    return [...state, ...diet_response_ids];
  } else {
    return state;
  }
}

export default (state = [], action = {}) => {
  const { type, data } = action;
  switch (type) {
    default:
      return dietResponseIdsReducer(state, data);
  }
};
