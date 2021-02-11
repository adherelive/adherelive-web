export const getAddPatientUrl = () => {
    return `/doctors/patients`;
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
  return `/patients/addCareplanForPatient/${id}`;
}

export const generatePrescriptionUrl = (careplian_id) => {
  return `/api/patients/generate_prescription/${careplian_id}`
}