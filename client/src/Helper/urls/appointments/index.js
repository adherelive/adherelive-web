export const addAppointmentUrl = () => {
  return `/appointments`;
};

export const getAppointmentForParticipantUrl = (id) => {
  return `/appointments/${id}`;
};

export const getAppointmentsDetailsUrl = () => {
  return `/appointments/details`;
};

export const updateAppointmentUrl = (id) => {
  return `/appointments/update/${id}`;
};

export const deleteAppointmentUrl = (id) => {
  return `/appointments/${id}`;
};

export const addCarePlanAppointmentUrl = (carePlanId) => {
  return `/appointments/${carePlanId}`;
};

export const getUploadAppointmentDocumentUrl = (appointment_id) => {
  return `/appointments/${appointment_id}/upload-doc`;
};

export const getDeleteAppointmentDocumentUrl = (document_id) => {
  return `/appointments/${document_id}/delete-doc`;
};
