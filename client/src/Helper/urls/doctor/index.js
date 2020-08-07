export const getdoctorProfileRegisterUrl = () => {
  return `/doctors/`;
};

export const getdoctorQualificationRegisterUrl = () => {
  return `/doctors/details/`;
};

export const getdoctorClinicRegisterUrl = () => {
  return `/doctors/clinics`;
};

export const getdoctorProfileRegisterDataUrl = (userId) => {
  return `/auth/doctor-profile-registration/${userId}`;
};

export const getdoctorQualificationRegisterDataUrl = () => {
  return `/doctors/`;
};
export const getRegisterQualificationUrl = () => {
  return `/doctors/qualifications`;
};

export const getRegisterRegistrationUrl = () => {
  return `/doctors/registrations`;
};


export const getUploadQualificationDocumentUrl = () => {
  return `/doctors/qualifications/docs`;
};


export const getUploadRegistrationDocumentUrl = () => {
  return `/doctors/registrations/docs`;
};

export const getDeleteQualificationDocumentUrl = (qualificationId) => {
  return `/doctors/qualification-documents/${qualificationId}`;
};


export const getDeleteRegistrationDocumentUrl = (registrationId) => {
  return `/doctors/registration-documents/${registrationId}`;
};

export const getAllDoctorsUrl = () => {
  return `/admin/doctors`;
};

export const getDoctorDetailsUrl = id => {
  return `/admin/doctors/${id}`;
};

export const getVerifyDoctorUrl = id => {
  return `/admin/doctors/${id}`;
};
