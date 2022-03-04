function templateVitalsReducer(state, data) {
  const { template_vitals } = data || {};
  if (template_vitals) {
    return {
      ...state,
      ...template_vitals,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return templateVitalsReducer(state, data);
  }
};
