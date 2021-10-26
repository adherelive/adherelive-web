function templateMedicationsReducer(state, data) {
  const { template_medications } = data || {};
  if (template_medications) {
    return {
      ...state,
      ...template_medications,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return templateMedicationsReducer(state, data);
  }
};
