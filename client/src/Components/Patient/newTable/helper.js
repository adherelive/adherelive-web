export const TABLE_COLUMN = {
  PID: {
    key: "PID",
    dataIndex: "PID",
    width: 200,
    fixed: "left",
  },
  WATCHLIST: {
    key: "WATCHLIST",
    dataIndex: "WATCHLIST",
  },
  CONDITION: {
    key: "CONDITION",
    dataIndex: "CONDITION",
  },
  TREATMENT: {
    key: "TREATMENT",
    dataIndex: "TREATMENT",
  },
  SEVERITY: {
    key: "SEVERITY",
    dataIndex: "SEVERITY",
  },
  AGE: {
    key: "AGE",
    dataIndex: "AGE",
  },
  START_DATE: {
    key: "START_DATE",
    dataIndex: "START_DATE",
  },
  DOCTOR: {
    key: "DOCTOR",
    dataIndex: "DOCTOR",
  },
  DIAGNOSIS: {
    key: "DIAGNOSIS",
    dataIndex: "DIAGNOSIS",
  },
  CREATED_AT: {
    key: "CREATED_AT",
    dataIndex: "CREATED_AT",
  },
};

export const formatPatientTableData = (data) => {
  let {
    id,
    doctors,
    treatments = {},
    severity: severities = {},
    conditions = {},
    users,
    care_plans,
    authenticated_user,
    openEditPatientDrawer,
    paginatedPatientData,
  } = data || {};

  const { care_plans: data_care_plans = {}, patients = {} } =
    paginatedPatientData || {};

  let doctor_id = null;
  Object.keys(doctors).forEach((id) => {
    const { basic_info: { user_id = null } = {} } = doctors[id] || {};

    if (user_id === authenticated_user) {
      doctor_id = id;
    }
  });

  let treatment = "";
  let condition = "";
  let severity = "";

  let carePlanData = {};

  const {
    details: {
      treatment_id: cTreatment = "",
      condition_id: cCondition = "",
      severity_id: cSeverity = "",
    } = {},
    id: carePlanId = "",
  } = data_care_plans || {};

  let { basic_info: { name: treatmentName = "" } = {} } =
    treatments[cTreatment] || {};

  let { basic_info: { name: severityName = "" } = {} } =
    severities[cSeverity] || {};

  let { basic_info: { name: conditionName = "" } = {} } =
    conditions[cCondition] || {};

  treatment = treatmentName;
  condition = conditionName;
  severity = severityName;

  carePlanData = {
    ...data_care_plans,
    treatment,
    condition,
    severity,
  };

  const patientData = { ...patients };

  // const { basic_info: { name: carePlanName } = {}, activated_on } =
  // care_plans["1"] || {}; // todo: constant for now as careplan runs from seeder as design is not finalized

  const treatmentData = treatments[cTreatment] || {};
  const doctorData = doctors[doctor_id] || {};

  return {
    patientData,
    doctorData,
    treatmentData,
    carePlanData,
    openEditPatientDrawer,
  };
};
