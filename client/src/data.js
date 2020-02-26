export const AUTH_INITIAL_STATE = {
  authenticated: true,
  authenticated_user: "1"
  // authRedirection:
};

export const GRAPH_INITIAL_STATE = {
  missed_report: [
    {
      id: "no_adherence",
      data: {
        total: "119",
        critical: "90"
      }
    },
    {
      id: "no_medication",
      data: {
        total: "119",
        critical: "90"
      }
    },
    {
      id: "no_appointment",
      data: {
        total: "119",
        critical: "90"
      }
    },
    {
      id: "no_action",
      data: {
        total: "119",
        critical: "90"
      }
    }
  ]
};

export const PATIENT_INITIAL_STATE = {
  "1": {
    basic_info: {
      name: "test 1",
      age: "25"
    },
    condition: "1",
    treatment: {
      treatment_id: "1",
      treatment_start_date: "24 March, 2020"
    },
    doctor_id: "1",
    provider_id: "1"
  },
  "23": {
    basic_info: {
      name: "test 3",
      age: "35"
    },
    condition: "1",
    treatment: {
      treatment_id: "2",
      treatment_start_date: "24 March, 2020"
    },
    doctor_id: "1",
    provider_id: "2"
  }
};

export const TREATMENT_INITIAL_STATE = {
  "1": {
    basic_info: {
      id: "1",
      treatment_type: "Hip Replacement"
    },
    severity_level: "2",
    start_date: "24 March, 2020"
  },
  "2": {
    basic_info: {
      id: "2",
      treatment_type: "Hip Replacement"
    },
    severity_level: "1",
    start_date: "20 March, 2020"
  }
};

export const PAGE_INITIAL = {
  PATIENT_IDS: ["1", "23"],
  TREATMENT_IDS: ["1", "2"]
};

export const USER_INITIAL_STATE = {};
