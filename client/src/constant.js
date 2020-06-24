export const PATH = {
  LANDING_PAGE: "/",
  DASHBOARD: "/dashboard",
  SIGN_IN: "/sign-in",
  VALIDATION_PAGE: "/validation/:link",
  FORGOT_PASSWORD: "/forgot-password",
  IDENTIFY: "/identify/:link",
  SIGN_UP: "/sign-up/:link",
  REGISTER_PROFILE:'/register-profile',
  REGISTER_QUALIFICATIONS:'/register-qualifications',
  REGISTER_CLINICS:'/register-clinics',
  RESET_PASSWORD: "/reset-password/:link",
  PATIENT: {
    PA: "/patients",
    DETAILS: "/patients/:patient_id"
  }
};

export const TEXT_KEY = "text";
export const TIME_KEY = "time";

export const BEFORE_BREAKFAST = "1";
export const AFTER_BREAKFAST = "2";
export const NOON = "3";
export const BEFORE_LUNCH = "4";
export const AFTER_LUNCH = "5";
export const BEFORE_EVENING_SNACK = "6";
export const AFTER_EVENING_SNACK = "7";
export const BEFORE_DINNER = "8";
export const AFTER_DINNER = "9";
export const BEFORE_SLEEP = "10";

export const MEDICATION_TIMING = {
  [BEFORE_BREAKFAST]: {
    [TEXT_KEY]: "Before Breakfast",
        [TIME_KEY]: "8am"
},
    [AFTER_BREAKFAST]:
  {
    [TEXT_KEY]: "After Breakfast",
    [TIME_KEY]: "9am"
  },
  [NOON] : {
    [TEXT_KEY]: "Noon",
    [TIME_KEY]: "12pm"
  },
  [BEFORE_LUNCH]: {
    [TEXT_KEY]: "Before Lunch",
    [TIME_KEY]: "12:30pm"
  },
  [AFTER_LUNCH]: {
    [TEXT_KEY]: "After Lunch",
    [TIME_KEY]: "1:30pm"
  },
  [BEFORE_EVENING_SNACK]: {
    [TEXT_KEY]: "Before Evening Snack",
    [TIME_KEY]: "5:30pm"
  },
  [AFTER_EVENING_SNACK]: {
    [TEXT_KEY]: "After Evening Snack",
    [TIME_KEY]: "6pm"
  },
  [BEFORE_DINNER]: {
    [TEXT_KEY]: "Before Dinner",
    [TIME_KEY]: "7:30pm"
  },
  [AFTER_DINNER]: {
    [TEXT_KEY]: "After Dinner",
    [TIME_KEY]: "8:30pm"
  },
  [BEFORE_SLEEP]: {
    [TEXT_KEY]: "Before Sleeping",
    [TIME_KEY]: "10:30pm"
  }
};

export const ONBOARDING_STATUS = {
  PROFILE_REGISTERED:'profile_registered',
  QUALIFICATION_REGISTERED:'qualification_registered',
  CLINIC_REGISTERED:'CLINIC_registered',
};



export const CRITICAL = "1";
export const HIGH = "2";
export const MEDIUM = "3";
export const LOW = "4";

export const MALE = "m";
export const FEMALE = "f";

export const GENDER = {
  [MALE]: {
    value: "male",
    view: "M"
  },
  [FEMALE]: {
    value: "female",
    view: "F"
  }
};

export const SYMPTOMS = "symptoms";
export const MISSED_MEDICATION = "no_medication";
export const MISSED_APPOINTMENTS = "no_appointment";
export const MISSED_ACTIONS = "no_action";

export const PATIENT_BOX_CONTENT = {
  [SYMPTOMS]: {
    text: "Symptoms",
    background_color: "light-aqua",
    border_color: "dark-aqua"
  },
  [MISSED_MEDICATION]: {
    text: "Missed Medication",
    background_color: "light-purple",
    border_color: "dark-purple"
  },
  [MISSED_APPOINTMENTS]: {
    text: "Missed Appointments",
    background_color: "light-orange",
    border_color: "dark-orange"
  },
  [MISSED_ACTIONS]: {
    text: "Missed Actions",
    background_color: "light-blue",
    border_color: "dark-blue"
  }
};

export const DRAWER = {
  ADD_MEDICATION_REMINDER: "ADD_MEDICATION_REMINDER",
  EDIT_MEDICATION: "EDIT_MEDICATION",
  ADD_APPOINTMENT: "ADD_APPOINTMENT",
  EDIT_APPOINTMENT: "EDIT_APPOINTMENT",
  PATIENT_DETAILS: "PATIENT_DETAILS",
};

export const USER_CATEGORY = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  PROGRAM_ADMIN: "programAdmin",
  CARE_TAKER: "care_taker",
  CHARITY_ADMIN: "charityAdmin",
  PHARMACY_ADMIN: "pharmacyAdmin"
};

export const ACTIVITY_TYPE = {
  VISIT: "visit",
  CALL: "call",
  CHAT: "chat"
};

export const APPOINTMENT_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication",
  MATERIAL_DELIVERY: "material_delivery"
};

export const USER_STATUS = {
  ENROLLED: "ENROLLED",
  DISCHARGED: "DISCHARGED",
  INACTIVE: "INACTIVE",
  DROPPED: "DROPPED"
};

export const REPEAT_TYPE = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly"
};

export const REPEAT_OPTION = [
  { label: "Does not repeat", key: REPEAT_TYPE.NONE },
  { label: "Repeats Daily", key: REPEAT_TYPE.DAILY },
  { label: "Repeats Weekly", key: REPEAT_TYPE.WEEKLY },
  { label: "Repeats Monthly", key: REPEAT_TYPE.MONTHLY },
  { label: "Repeats Yearly", key: REPEAT_TYPE.YEARLY }
];

export const EVENT_ACTION = {
  EDIT_NOTES: "EDIT_NOTES",
  RESCHEDULE: "RESCHEDULE",
  EDIT_REMINDER: "EDIT_REMINDER",
  ADD_NOTES: "ADD_NOTES",
  DELETE_REMINDER: "DELETE_REMINDER",
  ADD_PRODUCT: "ADD_PRODUCT",
  EDIT_PRODUCT: "EDIT_PRODUCT"
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const HOST = "/api";

export const EVENT_TYPE = {
  INVITATION: "invitation",
  APPOINTMENT: "appointment",
  FORGOT_PASSWORD: "forgotPassword",
  REMINDER: "reminder",
  ADVERSE_EVENT: "adverse",
  SURVEY: "survey",
  ARTICLE: "article",
  MEDICATION_REMINDER: "medication-reminder",
  BENEFIT_DOCS_VERIFIED: "BENEFIT_DOCS_VERIFIED",
  CHARITY_APPROVAL: "CHARITY_APPROVAL",
  MRL_GENERATION: "MRL_GENERATION",
  CHARITY_APPLIED: "CHARITY_APPLIED"
};

//request type
export const REQUEST_TYPE = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete"
};

export const SEVERITY_STATUS = {
  [CRITICAL]: {
    text: "Critical",
    color: "red"
  },
  [LOW]: {
    text: "Low",
    color: "green"
  },
  [HIGH]: {
    text: "High",
    color: "red"
  },
  [MEDIUM]: {
    text: "Medium",
    color: "black"
  }
};

export const NO_ADHERENCE = "no_adherence";
export const NO_MEDICATION = "no_medication";
export const NO_APPOINTMENT = "no_appointment";
export const NO_ACTION = "no_action";

export const CHART_TITLE = {
  [NO_ADHERENCE]: "Adherence",
  [NO_MEDICATION]: "Missed Medication",
  [NO_APPOINTMENT]: "Missed Appointments",
  [NO_ACTION]: "Missed Actions"
};

export const GRAPH_COLORS = {
  [NO_ADHERENCE]: {
    dark: "#13c2c2",
    light: "#b5f5ec",
    className: {
      dark: "bg-dark-aqua",
      light: "bg-light-aqua"
    }
  },
  [NO_MEDICATION]: {
    dark: "#722ed1",
    light: "#d3adf7",
    className: {
      dark: "bg-dark-purple",
      light: "bg-light-purple"
    }
  },
  [NO_APPOINTMENT]: {
    dark: "#fa8c16",
    light: "#ffd591",
    className: {
      dark: "bg-dark-orange",
      light: "bg-light-orange"
    }
  },
  [NO_ACTION]: {
    dark: "#597ef7",
    light: "#adc6ff",
    className: {
      dark: "bg-dark-blue",
      light: "bg-light-blue"
    }
  }
};

export const SYMPTOM = {
  NEW: "Yes",
  OLD: "--"
};

export const TRAUMA = "1";

export const CONDITIONS = {
  [TRAUMA]: {
    value: "Trauma"
  }
};

export const TABLE_DEFAULT_BLANK_FIELD = "--";

export const MEDICINE_TYPE = {
  TABLET: "tablet",
  INJECTION: "injection"
}