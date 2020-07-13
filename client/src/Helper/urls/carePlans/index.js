export const getcreateCarePlanMedicationAndAppointmentUrl = (carePlanId) => {
  return `/carePlans/create-medications-and-appointments/${carePlanId}`;
};

export const getPatientCarePlanDetailsUrl = (patientId) => {
  return `/patients/${patientId}/careplan-details`;
};