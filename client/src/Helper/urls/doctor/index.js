import doctors from "../../../modules/doctors";

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

export const getdoctorQualificationRegisterDataUrl = (id) => {
  return `/doctors/${id}`;
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

export const getDoctorDetailsUrl = (id) => {
  return `/admin/doctors/${id}`;
};

export const addRazorpayIdUrl = (id) => {
  return `/admin/doctors/${id}/account`;
};

export const getDoctorAccountDetailsUrl = (id) => {
  return `/admin/doctors/${id}/account`;
};

export const getDoctorProfileDetailsUrl = (id) => {
  return `/doctors/${id}`;
};

export const getVerifyDoctorUrl = (id) => {
  return `/admin/doctors/${id}`;
};

export const getUploadURL = () => {
  return `/doctors/upload`;
};

export const updateDoctorURL = (id) => {
  return `/doctors/${id}`;
};

export const addPatientToWatchlistUrl = (patient_id) => {
  return `/doctors/watchlist/${patient_id}`;
};
export const patientWatchlistUrl = (patient_id) => {
  return `/doctors/watchlist/${patient_id}`;
};

export const removePatientFromWatchlistUrl = (patient_id) => {
  return `/doctors/watchlistremove/${patient_id}`;
};

export const getAdminPaymentProductUrl = () => {
  return `/doctors/consultations/default`;
};

export const getDoctorPaymentProductUrl = () => {
  return `/doctors/consultations`;
};

export const addDoctorPaymentPoductUrl = () => {
  return `/doctors/consultations`;
};

export const updatePatientAndCareplanUrl = (careplan_id) => {
  return `/doctors/updatePatient_careplan/${careplan_id}`;
};
export const deactivateDoctorURL = (doctor_id) => {
  return `/doctors/${doctor_id}`;
};

export const activateDoctorURL = (user_id) => {
  return `/doctors/activate/${user_id}`;
};

export const getPatientsPaginatedUrl = ({
  offset,
  watchlist,
  sort_by_name,
  created_at_order,
  name_order,
}) => {
  return `/doctors/patients?offset=${offset}&watchlist=${watchlist}&sort_by_name=${sort_by_name}&created_at_order=${created_at_order}&name_order=${name_order}`;
};

export const searchDoctorEmailUrl = (email) => {
  return `/doctors/search-mail?email=${email}`;
};

export const searchDoctorNameUrl = (name) => {
  return `/doctors/search-name?name=${name}`;
};
