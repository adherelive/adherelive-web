export const getdoctorProfileRegisterUrl = (userId) => {
    return `/doctor-profile-registration/${userId}`;
  };

  export const getdoctorQualificationRegisterUrl = (userId) => {
    return `/doctor-qualification-registration/${userId}`;
  };

  export const getdoctorClinicRegisterUrl = (userId) => {
    return `/doctor-clinic-registration/${userId}`;
  };

  export const getdoctorProfileRegisterDataUrl = (userId) => {
    return `/doctor-profile-registration/${userId}`;
  };

  export const getdoctorQualificationRegisterDataUrl = (userId) => {
    return `/doctor-qualification-registration/${userId}`;
  };
  export const getRegisterQualificationUrl = (userId) => {
    return `/register-qualification/${userId}`;
  };

  export const getUploadQualificationDocumentUrl = (userId,qualificationId) => {
    return `/upload-qualification-document/${userId}/${qualificationId}`;
  };

  export const getDeleteQualificationDocumentUrl = (qualificationId) => {
    return `/delete-qualification-document/${qualificationId}`;
  };

  