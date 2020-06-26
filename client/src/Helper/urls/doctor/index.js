export const getdoctorProfileRegisterUrl = () => {
  return `/auth/doctor-profile-registration`;
};

export const getdoctorQualificationRegisterUrl = (userId) => {
  return `/auth/doctor-qualification-registration/${userId}`;
};

export const getdoctorClinicRegisterUrl = (userId) => {
  return `/auth/doctor-clinic-registration/${userId}`;
};

export const getdoctorProfileRegisterDataUrl = (userId) => {
  return `/auth/doctor-profile-registration/${userId}`;
};

export const getdoctorQualificationRegisterDataUrl = (userId) => {
  return `/auth/doctor-qualification-registration/${userId}`;
};
export const getRegisterQualificationUrl = (userId) => {
  return `/auth/register-qualification/${userId}`;
};

export const getUploadQualificationDocumentUrl = (userId) => {
  return `/auth/upload-qualification-document/${userId}`;
};

export const getDeleteQualificationDocumentUrl = (qualificationId) => {
  return `/auth/delete-qualification-document/${qualificationId}`;
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
