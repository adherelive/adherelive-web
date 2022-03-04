function typeDescriptionReducer(state, data) {
  const { type_description } = data || {};
  if (type_description) {
    return {
      ...state,
      ...type_description,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return typeDescriptionReducer(state, data);
  }
};
