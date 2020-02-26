export const TABLE_COLUMN = {
  PID: {
    key: "PID",
    dataIndex: "PID",
    width: 200,
    fixed: "left"
  },
  CONDITION: {
    key: "CONDITION",
    dataIndex: "CONDITION"
  },
  TREATMENT: {
    key: "TREATMENT",
    dataIndex: "TREATMENT"
  },
  SEVERITY: {
    key: "SEVERITY",
    dataIndex: "SEVERITY"
  },
  AGE: {
    key: "AGE",
    dataIndex: "AGE"
  },
  START_DATE: {
    key: "START_DATE",
    dataIndex: "START_DATE"
  },
  DOCTOR: {
    key: "DOCTOR",
    dataIndex: "DOCTOR"
  },
  PROVIDER: {
    key: "PROVIDER",
    dataIndex: "PROVIDER"
  },
  NEW_SYMPTOMS: {
    key: "NEW_SYMPTOMS",
    dataIndex: "NEW_SYMPTOMS"
  }
};

export const formatPatientTableData = data => {
  const { id, patients, doctors, providers, treatments } = data || {};

  const patientData = patients[id] || {};

  console.log("18723 patientData --> ", patientData, patients);
  const {
    treatment: { treatment_id },
    doctor_id,
    provider_id
  } = patientData || {};

  const treatmentData = treatments[treatment_id] || {};
  const doctorData = doctors[doctor_id] || {};
  const providerData = providers[provider_id] || {};
  return {
    patientData,
    doctorData,
    providerData,
    treatmentData
  };
};
