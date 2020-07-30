

function providersReducer(state, data) {
  const { providers } = data || {};
  if (providers) {
      return {
          ...state,
          ...providers,
      };
  } else {
      return {
          ...state,
      };
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
      default:
          return providersReducer(state, data)
  }
};
