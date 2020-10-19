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
