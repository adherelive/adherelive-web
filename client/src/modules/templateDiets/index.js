function templateDietsReducer(state, data) {
  const { template_diets } = data || {};
  if (template_diets) {
    return {
      ...state,
      ...template_diets,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return templateDietsReducer(state, data);
  }
};
