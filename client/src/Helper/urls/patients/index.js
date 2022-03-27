export const getAddPatientUrl = () => {
  return `/doctors/patients`;
};
// AKSHAY NEW CODE IMPLEMENTATIONS
export const getPatientDetailsUrl = (patientId) => {
  return `patients/${patientId}`;
};

export const getPatientVitalsURL = (id) => {
  return `/patients/${id}/vitals`;
};

export const searchPatientFromNumUrl = (value) => {
  return `/patients?value=${value}`;
};

export const getRequestConsentUrl = (id) => {
  return `/patients/${id}/consents/request`;
};

export const getConsentVerifyUrl = () => {
  return `/patients/consents/verify`;
};

export const searchPatientForDoctorUrl = (value) => {
  return `/patients/searchpatient?value=${value}`;
};

export const addCareplanForPatientUrl = (id) => {
  return `/patients/add-careplan-for-patient/${id}`;
};

export const generatePrescriptionUrl = (careplan_id) => {
  return `/api/patients/generate_prescription/${careplan_id}`;
};

export const getPatientsPaginatedUrl = (data) => {
  const { sort_createdAt, sort_name, offset, watchlist } = data || {};
  if (sort_name === null) {
    return `/patients/pagination?sort_createdAt=${sort_createdAt}&offset=${offset}&watchlist=${watchlist}`;
  } else {
    return `/patients/pagination?sort_name=${sort_name}&offset=${offset}&watchlist=${watchlist}`;
  }
};

export const getSearchTreatmentPaginatedPatientsUrl = (data) => {
  const { filter_treatment, offset, watchlist } = data || {};
  return `/patients/pagination?filter_treatment=${filter_treatment}&offset=${offset}&watchlist=${watchlist}`;
};

export const getSearchDiagnosisPaginatedPatientsUrl = (data) => {
  const { filter_diagnosis, offset, watchlist } = data || {};
  return `/patients/pagination?filter_diagnosis=${filter_diagnosis}&offset=${offset}&watchlist=${watchlist}`;
};
