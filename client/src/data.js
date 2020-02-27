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
    chats: ["1"],
    condition: "1",
    treatment_id: "1",
    doctor_id: "1",
    provider_id: "1",
    new_symptom: true
  },
  "23": {
    basic_info: {
      name: "test 3",
      age: "35"
    },
    chats: ["2"],
    condition: "1",
    treatment_id: "2",
    doctor_id: "2",
    provider_id: "2",
    new_symptom: false
  }
};

export const TREATMENT_INITIAL_STATE = {
  "1": {
    basic_info: {
      id: "1",
      treatment_type: "Hip Replacement"
    },
    patient_id: "1",
    severity_level: "2",
    start_date: "24 March, 2020"
  },
  "2": {
    basic_info: {
      id: "2",
      treatment_type: "Hip Replacement"
    },
    patient_id: "23",
    severity_level: "4",
    start_date: "20 March, 2020"
  }
};

export const DOCTOR_INITIAL_STATE = {
  "1": {
    basic_info: {
      name: "doctor 1"
    }
  },
  "2": {
    basic_info: {
      name: "doctor 2"
    }
  }
};

export const PROVIDER_INITIAL_STATE = {
  "1": {
    basic_info: {
      name: "provider 1"
    }
  },
  "2": {
    basic_info: {
      name: "provider 2"
    }
  }
};

export const CHAT_INITIAL_STATE = {
  "1": {
    doctor_id: "1",
    patient_id: "1",
    messages: {
      unread: "3",
      content: ["a", "b", "c"]
    }
  },
  "2": {
    doctor_id: "2",
    patient_id: "23",
    messages: {
      unread: "0",
      content: []
    }
  }
};

export const PAGE_INITIAL = {
  PATIENT_IDS: ["1", "23"],
  TREATMENT_IDS: ["1", "2"],
  DOCTOR_IDS: ["1", "2"],
  PROVIDER_IDS: ["1", "2"],
  CHAT_IDS: ["1", "2"]
};

export const USER_INITIAL_STATE = {};
