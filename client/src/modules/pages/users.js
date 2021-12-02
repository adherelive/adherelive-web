function userPageReducer(state, data) {
  const { user_ids } = data || {};
  if (user_ids) {
    return [...user_ids];
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return userPageReducer(state, data);
  }
};
