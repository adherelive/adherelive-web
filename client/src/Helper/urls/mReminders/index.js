export const getAddMedicationReminderURL = (patient_id) => {
  return `/events/medication-reminder/${patient_id}`;
};

export const getAddCarePlanMedicationReminderURL = (id, carePlanId) => {
  return `/medications/treatment/${id}/${carePlanId}`;
};

export const getMedicationForParticipantUrl = (patient_id) => {
  return `/medications/${patient_id}`;
};

export const updateMedicationUrl = (id) => {
  return `/medications/${id}`;
};

export const deleteMedicationUrl = (id) => {
  return `/medications/${id}`;
};

export const getMedicationTimelineURL = (id) => {
  return `/medications/${id}/timeline`;
};
