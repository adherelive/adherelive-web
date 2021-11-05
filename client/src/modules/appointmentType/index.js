function appointmentsTypeReducer(state, data) {
  const { appointment_type } = data || {};
  if (appointment_type) {
    return {
      ...state,
      ...appointment_type,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return appointmentsTypeReducer(state, data);
  }
};
