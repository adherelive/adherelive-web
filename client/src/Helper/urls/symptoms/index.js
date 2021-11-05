export const getSymptomsDetailsUrl = () => {
  return `/symptoms`;
};

export const getSymptomTimeLineUrl = (patient_id) => {
  return `/patients/${patient_id}/symptoms/`;
};

export const getHistorySymptomUrl = (patient_id, days) => {
  return `/patients/${patient_id}/parts/symptoms?duration=${days}`;
};
