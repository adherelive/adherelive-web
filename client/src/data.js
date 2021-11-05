export const AUTH_INITIAL_STATE = {
  authenticated: true,
  authenticated_user: "1",
  // authRedirection:
};

export const GRAPH_INITIAL_STATE = {
  dashboard_report: [
    {
      id: "1",
      data: {
        total: "119",
        critical: "90",
      },
    },
    {
      id: "2",
      data: {
        total: "119",
        critical: "90",
      },
    },
    {
      id: "3",
      data: {
        total: "119",
        critical: "90",
      },
    },
    {
      id: "4",
      data: {
        total: "119",
        critical: "90",
      },
    },
    {
      id: "active_patient",
      data: {
        total: "119",
        critical: "90",
      },
    },
    {
      id: "critical_patient",
      data: {
        total: "119",
        critical: "90",
      },
    },
  ],
};

export const PATIENT_INITIAL_STATE = {
  100: {
    basic_info: {
      first_name: "test",
      last_name: "1",
      age: "25",
      gender: "m",
    },
    chats: ["1"],
    condition: "1",
    treatment_id: "1",
    doctor_id: "1",
    provider_id: "1",
    new_symptom: true,
    medications: ["1", "2"],
    reports: {
      symptoms: {
        total: 2,
        critical: 1,
      },
      no_medication: {
        total: 3,
        critical: 1,
      },
      no_appointment: {
        total: 2,
        critical: 0,
      },
      no_action: {
        total: 2,
        critical: 2,
      },
    },
  },
  101: {
    basic_info: {
      first_name: "test",
      last_name: "3",
      age: "35",
      gender: "f",
    },
    chats: ["2"],
    condition: "1",
    treatment_id: "2",
    doctor_id: "2",
    provider_id: "2",
    new_symptom: false,
    medications: ["1"],
    reports: {
      symptoms: {
        total: 2,
        critical: 1,
      },
      no_medication: {
        total: 3,
        critical: 1,
      },
      no_appointment: {
        total: 2,
        critical: 0,
      },
      no_action: {
        total: 2,
        critical: 2,
      },
    },
  },
};

export const TREATMENT_INITIAL_STATE = {
  1: {
    basic_info: {
      id: "1",
      treatment_type: "Hip Replacement",
    },
    patient_id: "1",
    severity_level: "2",
    start_date: "24 March, 2020",
  },
  2: {
    basic_info: {
      id: "2",
      treatment_type: "Hip Replacement",
    },
    patient_id: "23",
    severity_level: "4",
    start_date: "20 March, 2020",
  },
};

export const DOCTOR_INITIAL_STATE = {
  1: {
    basic_info: {
      name: "doctor 1",
    },
  },
  2: {
    basic_info: {
      name: "doctor 2",
    },
  },
};

export const PROVIDER_INITIAL_STATE = {
  1: {
    basic_info: {
      name: "provider 1",
    },
  },
  2: {
    basic_info: {
      name: "provider 2",
    },
  },
};

export const CHAT_INITIAL_STATE = {
  1: {
    doctor_id: "1",
    patient_id: "1",
    messages: {
      unread: "3",
      content: ["a", "b", "c"],
    },
  },
  2: {
    doctor_id: "2",
    patient_id: "23",
    messages: {
      unread: "0",
      content: [],
    },
  },
};

export const MEDICATION_INITIAL_STATE = {
  1: {
    basic_info: {
      medicine_name: "Amoxill 2mg",
    },
    schedule: {
      repeat_type: "DAILY",
      doses: "ONCE",
    },
    start_date: "3rd February, 2020",
    end_date: "3rd March, 2020",
  },
  2: {
    basic_info: {
      medicine_name: "Crocin 4mg",
    },
    schedule: {
      repeat_type: "CERTAIN_DAYS",
      doses: "SPECIFIC",
      date: [
        {
          day: "Mon",
          time: "10:00 AM", // moment object here
        },
        {
          day: "Wed",
          time: "02:00 PM", // moment object here
        },
      ],
    },
    start_date: "3rd February, 2020", // moment object here
    end_date: "3rd March, 2020", // moment object here
  },
};

export const PAGE_INITIAL = {
  PATIENT_IDS: ["1", "23"],
  TREATMENT_IDS: ["1", "2"],
  DOCTOR_IDS: ["1", "2"],
  PROVIDER_IDS: ["1", "2"],
  CHAT_IDS: ["1", "2"],
};

export const USER_INITIAL_STATE = {};

export const medication = {
  basic_info: {
    medicine_name: "Amoxill 2mg",
    // other data
  },
  repeat_type: "", //twice, weekly, once, monthly, certain days
  repeat_time: [{}, {}], // only for certain days, moment object for specific days
  start_date: "",
  end_date: "",
};
