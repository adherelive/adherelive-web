function doctorRegistrationReducer(state, data) {
  const { doctor_registrations } = data || {};
  if (doctor_registrations) {
    return {
      ...state,
      ...doctor_registrations,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return doctorRegistrationReducer(state, data);
  }
};
