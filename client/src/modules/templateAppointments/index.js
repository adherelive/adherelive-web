function templateAppointmentsReducer(state, data) {
  const { template_appointments } = data || {};
  if (template_appointments) {
    return {
      ...state,
      ...template_appointments,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return templateAppointmentsReducer(state, data);
  }
};
