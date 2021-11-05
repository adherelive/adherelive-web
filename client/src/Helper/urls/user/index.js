export const getEditProfileURL = (userId = "") => {
  return "/edit-profile";
};

export const getUserByIdURL = (userId) => {
  return `/user/${userId}`;
};

export const getMyProfileURL = (userId = "") => {
  return "/myprofile";
};

export const getChangeProfilePicURL = () => {
  return "/upload-profile-pic";
};

export const getChangePasswordURL = (userId = "") => {
  return "/change-password";
};

export const getUploadConsentFormURL = () => {
  return "/upload-consent-form";
};

export const getUploadIdProofURL = () => {
  return `/upload-id-proof`;
};

export const getRelatedMembersURL = () => {
  return "/members";
};

export const getRelatedMembersForPlanURL = () => {
  return "/members-plan";
};

export const getProgramsURL = () => {
  return "/programs";
};

export const getProgramDoctorsURL = (programId) => {
  return `/program/${programId}/doctors`;
};

export const getProgramPatientsURL = (programId) => {
  return `/program/${programId}/patients`;
};
// export const getProgramPatientsUrl = programId => {
//   return `/program/${programId}/patients`;
// };

export const getCurrentProgramUrl = (programId) => {
  return `/program/${programId}`;
};

export const getProductsURL = (programId) => {
  return `/products/${programId}`;
};

export const getDoctorHospitalsURL = (doctorId) => {
  return `/doctor/${doctorId}/hospitals`;
};

export const getHospitalsURL = () => {
  return "/hospitals";
};

export const getDischargePatientURL = () => {
  return `/patients/discharge`;
};
export const getReactivatePatientURL = () => {
  return `/patients/reactivate`;
};

export const verifyDocumentURL = (userId) => {
  return `/users/${userId}/documents-verify`;
};

export const fetchCareCoachSurveyURL = (userId) => {
  return `/users/surveys`;
};

export const reUploadIdProofsURL = (userId) => {
  return `/users/${userId}/reupload-idproofs`;
};

export const reUploadConsentDocsURL = (userId) => {
  return `/users/${userId}/reupload-consentdocs`;
};

export const uploadDocsURL = (userId) => {
  return `/users/${userId}/docs`;
};

export const verifyDocsURL = (userId) => {
  return `/users/${userId}/docs/verify`;
};

export const getHistoricalClinicalReadingURL = (userId) => {
  return `/patients/${userId}/clinical-readings`;
};

export const getHistoricalBasicReadingURL = (userId) => {
  return `/patients/${userId}/basic`;
};

export const getHistoricalVitalsReadingURL = (userId) => {
  return `/patients/${userId}/vitals`;
};

export const getHistoricalMedicationDataURL = (userId) => {
  return `/patients/${userId}/medication`;
};

export const getDropPatientURL = () => {
  return `/patients/drop`;
};

export const addHospitalizationURL = () => {
  return `/hospitalization`;
};

export const getMedicationStagesURL = (userId) => {
  return `/users/${userId}/medication-stage`;
};

export const updatePatHospital = (userId) => {
  return `/users/${userId}/hospital`;
};
export const addNewCareCoach = () => {
  return "/invite-carecoach";
};

export const changePhysician = () => {
  return "/change-physician";
};

export const getUploadURL = () => {
  return `/auth/upload`;
};
