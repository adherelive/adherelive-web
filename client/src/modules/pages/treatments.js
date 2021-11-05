function treatmentPageReducer(state, data) {
  const { treatment_ids } = data || {};
  if (treatment_ids) {
    return [...treatment_ids];
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return treatmentPageReducer(state, data);
  }
};
