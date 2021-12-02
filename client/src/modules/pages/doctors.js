function doctorPageReducer(state, data) {
  const { doctor_ids } = data || {};
  if (doctor_ids) {
    return [...doctor_ids];
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return doctorPageReducer(state, data);
  }
};
