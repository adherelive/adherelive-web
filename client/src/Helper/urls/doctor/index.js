export const getdoctorProfileRegisterUrl = (userId) => {
    return `/auth/doctor-profile-registration/${userId}`;
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

  export const getAddPatientUrl = (userId) => {
    return `/auth/add-patient/${userId}`;
  };

  export const getPatientCarePlanDetailsUrl = (patientId) => {
    return `/patients/patient-care-plan-details/${patientId}`;
  };

  