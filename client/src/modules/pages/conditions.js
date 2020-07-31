function conditionPageReducer(state, data) {
  console.log("192371937812 data --> ", data);
  const {condition_ids} = data || {};
  if(condition_ids) {
    return [
      ...condition_ids
    ];
  } else {
    return [
      ...state
    ];
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return conditionPageReducer(state,data);
  }
};
