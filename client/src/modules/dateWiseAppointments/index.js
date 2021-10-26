function dateWiseAppointmentsReducer(state, data) {
  const { date_wise_appointments } = data || {};

  if (date_wise_appointments) {
    return {
      ...date_wise_appointments,
    };
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return dateWiseAppointmentsReducer(state, data);
  }
};
