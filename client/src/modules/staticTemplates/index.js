function staticTemplatesReducer(state, data) {
  const { static_templates } = data || {};
  if (static_templates) {
    return {
      ...state,
      ...static_templates,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return staticTemplatesReducer(state, data);
  }
};
