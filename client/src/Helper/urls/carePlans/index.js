export const getcreateCarePlanMedicationAndAppointmentUrl = (carePlanId) => {
  return `/carePlans/${carePlanId}`;
};

export const getPatientCarePlanDetailsUrl = (patientId) => {
  return `/patients/${patientId}/careplan-details`;
};

export const addDoctroRoleIdToCareplanUrl = () => {
  return `/carePlans/profile`;
};
