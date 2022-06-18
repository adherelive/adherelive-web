function providerTransactionPageReducer(state, data) {
  const { transaction_ids } = data || {};
  if (transaction_ids) {
    return [...transaction_ids];
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return providerTransactionPageReducer(state, data);
  }
};
