export const uploadReportUrl = (patient_id) => {
  return `/reports/upload/${patient_id}`;
};

export const fetchReportsUrl = (patientId) => `/patients/${patientId}/reports`;

export const addReportUrl = () => {
  return `/reports`;
};

export const getAllReportsUrl = (patient_id) => {
  return `/patients/${patient_id}/reports`;
};

export const deleteUploadUrl = (doc_id) => {
  return `/reports/${doc_id}`;
};

export const updateReportUrl = (report_id) => {
  return `/reports/${report_id}`;
};
