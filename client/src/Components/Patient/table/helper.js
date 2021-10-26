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
    patients,
    doctors,
    providers,
    treatments = {},
    severity: severities = {},
    conditions = {},
    chats,
    chat_ids,
    users,
    care_plans,
    authenticated_user,
    openEditPatientDrawer,
  } = data || {};

  let doctor_id = null;

  Object.keys(doctors).forEach((id) => {
    const { basic_info: { user_id } = {} } = doctors[id] || {};

    if (user_id === authenticated_user) {
      doctor_id = id;
    }
  });

  let patientData = patients[id] || {};
  let treatment = "";
  let condition = "";
  let severity = "";

  let carePlanData = {};
  for (let carePlan of Object.values(care_plans)) {
    let { basic_info = {} } = carePlan || {};
    let {
      doctor_id: doctorId = 1,
      patient_id,
      id: carePlanId = 1,
    } = basic_info;
    if (`${doctorId}` === doctor_id) {
      if (`${patient_id}` === id) {
        let {
          details: {
            treatment_id: cTreatment = "",
            condition_id: cCondition = "",
            severity_id: cSeverity = "",
          } = {},
        } = carePlan || {};
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
          ...care_plans[carePlanId],
          treatment,
          condition,
          severity,
        };
      }
    }
  }

  patientData = {
    ...patients[id],
    treatment,
    condition,
    severity,
    carePlanData,
  };

  const { basic_info: { name: carePlanName } = {}, activated_on } =
    care_plans["1"] || {}; // todo: constant for now as careplan runs from seeder as design is not finalized

  const {
    basic_info: { user_id },
    treatment_id,
    provider_id,
    chats: patientChatIds = [],
  } = patientData || {};

  const {} = users[user_id] || {};
  let chatData = {};

  chat_ids.forEach((id) => {
    const { doctor_id: chatDoctorId } = chats[id] || {};
    if (doctor_id === chatDoctorId) {
      chatData = { ...chats[id] };
    }
  });

  const treatmentData = treatments[treatment_id] || {};
  const doctorData = doctors[doctor_id] || {};
  const providerData = providers[provider_id] || {};

  return {
    patientData,
    doctorData,
    providerData,
    treatmentData,
    chatData,
    carePlanData,
    openEditPatientDrawer,
  };
};
