function doctorQualificationReducer(state, data) {
  const { doctor_qualifications } = data || {};
  if (doctor_qualifications) {
    return {
      ...state,
      ...doctor_qualifications,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return doctorQualificationReducer(state, data);
  }
};
