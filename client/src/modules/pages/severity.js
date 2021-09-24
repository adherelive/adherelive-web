function severityPageReducer(state, data) {
  const { severity_ids } = data || {};
  if (severity_ids) {
    return [...severity_ids];
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return severityPageReducer(state, data);
  }
};
