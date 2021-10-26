export const getPatientDetailsUrl = (id) => {
  return `/patients/${id}`;
};

export const getPatientConsultingUrl = (id) => {
  return `/patient-consulting/${id}`;
};

export const getPatientConsultingVideoUrl = (id) => {
  return `/patient/consulting/video/${id}`;
};

export const getPatientLastVisitAlertUrl = (id) => {
  return `/events/${id}`;
};
