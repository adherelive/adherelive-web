export const getcreateCarePlanMedicationAndAppointmentUrl = (carePlanId) => {
  return `/carePlans/create-medications-and-appointments/${carePlanId}`;
};

export const getPatientCarePlanDetailsUrl = (patientId) => {
  return `/carePlans/patient-care-plan-details/${patientId}`;
};