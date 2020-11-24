export const addAppointmentUrl = () => {
  return `/appointments`;
};

export const getAppointmentForParticipantUrl = (id) => {
  return `/appointments/${id}`;
};

export const getMissedAppointmentsForDoctorUrl = () => {
  return `/appointments/missed`;
}

export const getAppointmentsDetailsUrl = () => {
  return `/appointments/details`;
};

export const updateAppointmentUrl = (id) => {
  return `/appointments/update/${id}`;
};

export const deleteAppointmentUrl = (id) => {
  return `/appointments/${id}`;
};

export const addCarePlanAppointmentUrl = (carePlanId)=>{
  return `/appointments/${carePlanId}`
}