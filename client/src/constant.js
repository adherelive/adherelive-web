export const PATH = {
  LANDING_PAGE: "/",
  DASHBOARD: "/dashboard",
  SIGN_IN: "/sign-in",
  PROFILE: "/profile",
  VALIDATION_PAGE: "/validation/:link",
  FORGOT_PASSWORD: "/forgot-password",
  IDENTIFY: "/identify/:link",
  SIGN_UP: "/sign-up/:link",
  REGISTER_PROFILE: '/register-profile',
  REGISTER_QUALIFICATIONS: '/register-qualifications',
  REGISTER_CLINICS: '/register-clinics',
  PATIENT_CONSULTING: '/patient-consulting/:patient_id',
  PATIENT_CONSULTING_VIDEO: '/patient-consulting-video/:room_id',
  RESET_PASSWORD: "/reset-password/:link",
  PATIENT: {
    PA: "/patients",
    DETAILS: "/patients/:patient_id"
  },
  ADMIN: {
    DOCTORS: {
      ROOT: "/doctors",
      DETAILS: "/doctors/:id"
    }
  }
};


export const ROOM_ID_TEXT = '-adhere-';

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
    [TIME_KEY]: "8:00am"
  },
  [AFTER_BREAKFAST]:
  {
    [TEXT_KEY]: "After Breakfast",
    [TIME_KEY]: "9:00am"
  },
  [NOON]: {
    [TEXT_KEY]: "Noon",
    [TIME_KEY]: "12:00pm"
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
    [TIME_KEY]: "6:00pm"
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


export const MEDICATION_TIMING_HOURS = {
  [BEFORE_BREAKFAST]: 8,
  [AFTER_BREAKFAST]: 9,
  [NOON]: 12,
  [BEFORE_LUNCH]: 12,
  [AFTER_LUNCH]: 13,
  [BEFORE_EVENING_SNACK]: 17,
  [AFTER_EVENING_SNACK]: 18,
  [BEFORE_DINNER]: 19,
  [AFTER_DINNER]: 20,
  [BEFORE_SLEEP]: 22
};

export const MEDICATION_TIMING_MINUTES = {
  [BEFORE_BREAKFAST]: 0,
  [AFTER_BREAKFAST]: 0,
  [NOON]: 0,
  [BEFORE_LUNCH]: 30,
  [AFTER_LUNCH]: 30,
  [BEFORE_EVENING_SNACK]: 30,
  [AFTER_EVENING_SNACK]: 0,
  [BEFORE_DINNER]: 30,
  [AFTER_DINNER]: 30,
  [BEFORE_SLEEP]: 30
};

export const ONBOARDING_STATUS = {
  PROFILE_REGISTERED: 'profile_registered',
  QUALIFICATION_REGISTERED: 'qualification_registered',
  CLINIC_REGISTERED: 'CLINIC_registered',
};



export const CRITICAL = "1";
export const HIGH = "2";
export const MEDIUM = "3";
export const LOW = "4";

export const MALE = "m";
export const FEMALE = "f";
export const OTHER = "o";

export const GENDER = {
  [MALE]: {
    value: "male",
    view: "M",
    label: "MALE"
  },
  [FEMALE]: {
    value: "female",
    view: "F",
    label: "FEMALE"
  },
  [OTHER]: {
    value: "other",
    view: "O",
    label: "OTHER"
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
  SYMPTOMS: 'SYMPTOMS',
  NOTIFICATIONS: "NOTIFICATIONS",
};

export const USER_CATEGORY = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  PROGRAM_ADMIN: "programAdmin",
  CARE_TAKER: "care_taker",
  CHARITY_ADMIN: "charityAdmin",
  PHARMACY_ADMIN: "pharmacyAdmin",
  ADMIN: "admin",
};

export const ACTIVITY_TYPE = {
  VISIT: "visit",
  CALL: "call",
  CHAT: "chat"
};

export const PERMISSIONS = {
  ADD_PATIENT: "ADD_PATIENT",
  VERIFIED_ACCOUNT: 'VERIFIED_ACCOUNT',
  ADD_APPOINTMENT: "ADD_APPOINTMENT",
  EDIT_APPOINTMENT: "EDIT_APPOINTMENT",
  VIEW_PATIENT: 'VIEW_PATIENT',
  ADD_MEDICATION: "ADD_MEDICATION",
  EDIT_MEDICATION: "EDIT_MEDICATION",
  EDIT_GRAPH: 'EDIT_GRAPH',
  ADD_ACTION: 'ADD_ACTION',
  ADD_CARE_PLAN_TEMPLATE: "ADD_CARE_PLAN_TEMPLATE"
};


const DAY = "1";
const MONTH = "2";
const YEAR = "3";

export const AGE_TYPE = {
  [DAY]: "d",
  [MONTH]: "m",
  [YEAR]: "y"
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

export const DAYS_TEXT = {
  "Mon": "monday",
  "Tue": "tuesday",
  "Wed": "wednesday",
  "Thu": "thursday",
  "Fri": "friday",
  "Sat": "saturday",
  "Sun": "sunday",
};

export const DAYS_NUMBER = {
  "Mon": 1,
  "Tue": 2,
  "Wed": 3,
  "Thu": 4,
  "Fri": 5,
  "Sat": 6,
  "Sun": 7,
};

export const DAYS_TEXT_NUM = {
  "1": "monday",
  "2": "tuesday",
  "3": "wednesday",
  "4": "thursday",
  "5": "friday",
  "6": "saturday",
  "7": "sunday",
}

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


export const NO_ADHERENCE = "1";
export const NO_MEDICATION = "2";
export const NO_APPOINTMENT = "3";
export const NO_ACTION = "4";
export const TEST_ONE = "5";
export const TEST_TWO = "6";

export const CHART_TITLE = {
  [NO_ADHERENCE]: "Adherence",
  [NO_MEDICATION]: "Missed Medication",
  [NO_APPOINTMENT]: "Missed Appointments",
  [NO_ACTION]: "Missed Actions",
  [TEST_ONE]: 'Test One',
  [TEST_TWO]: 'Test Two'

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
  },
  [TEST_ONE]: {
    dark: "#A0522D",
    light: "#F5DEB3",
    className: {
      dark: "bg-dark-brown",
      light: "bg-light-brown"
    }

  },

  [TEST_TWO]: {
    dark: "#00FF7F",
    light: "#90EE90",
    className: {
      dark: "bg-spring-green",
      light: "bg-light-green"
    }
  }
};

export const GRAPH_TYPE = {
  [NO_ADHERENCE]: 'donut',
  [NO_MEDICATION]: 'donut',
  [NO_APPOINTMENT]: 'donut',
  [NO_ACTION]: 'donut',
  [TEST_ONE]: 'donut'
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


export const TABLET = "1";
export const SYRUP = "2";
export const SYRINGE = "3";

export const MEDICINE_FORM_TYPE = {
  [TABLET]: { name: "tablet" },
  [SYRUP]: { name: "syrup" },
  [SYRINGE]: { name: "syringe" }
};

export const MEDICINE_TYPE = {
  TABLET: "tablet",
  INJECTION: "injection",
  SYRUP: 'syrup'
}

export const MEDICINE_UNITS = {
  MG: 'mg',
  ML: 'ml'
}

export const FULL_DAYS = {
  SUN: "Sun",
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
};

export const FULL_DAYS_NUMBER = {
  SUN: "1",
  MON: "2",
  TUE: "3",
  WED: "4",
  THU: "5",
  FRI: "6",
  SAT: "7",
};

export const DAYS_LIST = [
  FULL_DAYS.MON,
  FULL_DAYS.TUE,
  FULL_DAYS.WED,
  FULL_DAYS.THU,
  FULL_DAYS.FRI,
  FULL_DAYS.SAT,
  FULL_DAYS.SUN
];


export const DAYS_KEYS = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN'
];


export const PARTS = {
  HEAD: "HEAD",
  RIGHT_EYE: "RIGHT_EYE",
  LEFT_EYE: "LEFT_EYE",
  RIGHT_EAR: "RIGHT_EAR",
  LEFT_EAR: "LEFT_EAR",
  NOSE: "NOSE",
  MOUTH: "MOUTH",
  NECK: "NECK",
  RIGHT_SHOULDER: "RIGHT_SHOULDER",
  LEFT_SHOULDER: "LEFT_SHOULDER",
  CHEST: "CHEST",
  RIGHT_ARM: "RIGHT_ARM",
  LEFT_ARM: "LEFT_ARM",
  RIGHT_ELBOW: "RIGHT_ELBOW",
  LEFT_ELBOW: "LEFT_ELBOW",
  STOMACH: "STOMACH",
  ABDOMEN: "ABDOMEN",
  RIGHT_FOREARM: "RIGHT_FOREARM",
  LEFT_FOREARM: "LEFT_FOREARM",
  RIGHT_WRIST: "RIGHT_WRIST",
  LEFT_WRIST: "LEFT_WRIST",
  RIGHT_HAND: "RIGHT_HAND",
  LEFT_HAND: "LEFT_HAND",
  RIGHT_HAND_FINGER: "RIGHT_HAND_FINGER",
  LEFT_HAND_FINGER: "LEFT_HAND_FINGER",
  RIGHT_HIP: "RIGHT_HIP",
  LEFT_HIP: "LEFT_HIP",
  RIGHT_THIGH: "RIGHT_THIGH",
  LEFT_THIGH: "LEFT_THIGH",
  RIGHT_KNEE: "RIGHT_KNEE",
  LEFT_KNEE: "LEFT_KNEE",
  RIGHT_SHIN: "RIGHT_SHIN",
  LEFT_SHIN: "LEFT_SHIN",
  RIGHT_ANKLE: "RIGHT_ANKLE",
  LEFT_ANKLE: "LEFT_ANKLE",
  RIGHT_FOOT: "RIGHT_FOOT",
  LEFT_FOOT: "LEFT_FOOT",
  RIGHT_TOE: "RIGHT_TOE",
  LEFT_TOE: "LEFT_TOE",
  RECTUM: "RECTUM",
  URINARY_BLADDER: "URINARY_BLADDER"
};

export const PART_LIST = [
  PARTS.HEAD,
  PARTS.RIGHT_EYE,
  PARTS.LEFT_EYE,
  PARTS.RIGHT_EAR,
  PARTS.LEFT_EAR,
  PARTS.NOSE,
  PARTS.MOUTH,
  PARTS.NECK,
  PARTS.RIGHT_SHOULDER,
  PARTS.LEFT_SHOULDER,
  PARTS.CHEST,
  PARTS.RIGHT_ARM,
  PARTS.LEFT_ARM,
  PARTS.RIGHT_ELBOW,
  PARTS.LEFT_ELBOW,
  PARTS.STOMACH,
  PARTS.ABDOMEN,
  PARTS.RIGHT_FOREARM,
  PARTS.LEFT_FOREARM,
  PARTS.RIGHT_WRIST,
  PARTS.LEFT_WRIST,
  PARTS.RIGHT_HAND,
  PARTS.LEFT_HAND,
  PARTS.RIGHT_HAND_FINGER,
  PARTS.LEFT_HAND_FINGER,
  PARTS.RIGHT_HIP,
  PARTS.LEFT_HIP,
  PARTS.RIGHT_THIGH,
  PARTS.LEFT_THIGH,
  PARTS.RIGHT_KNEE,
  PARTS.LEFT_KNEE,
  PARTS.RIGHT_SHIN,
  PARTS.LEFT_SHIN,
  PARTS.RIGHT_ANKLE,
  PARTS.LEFT_ANKLE,
  PARTS.RIGHT_FOOT,
  PARTS.LEFT_FOOT,
  PARTS.RIGHT_TOE,
  PARTS.LEFT_TOE,
  PARTS.RECTUM,
  PARTS.URINARY_BLADDER
];

export const BODY = {
  [PARTS.HEAD]: {
    key: PARTS.HEAD,
    areaStyle: {
      height: 30,
      width: 68,
      top: 0,
      left: 110
    },
    dotStyle: {
      top: 14,
      left: 28
    }
  },
  [PARTS.RIGHT_EYE]: {
    key: PARTS.RIGHT_EYE,
    areaStyle: {
      top: 30,
      left: 110,
      height: 18,
      width: 35
    },
    dotStyle: {
      top: 6,
      left: 12
    }
  },
  [PARTS.LEFT_EYE]: {
    key: PARTS.LEFT_EYE,
    areaStyle: {
      top: 30,
      left: 145,
      height: 18,
      width: 35
    },
    dotStyle: {
      top: 6,
      left: 10
    }
  },
  [PARTS.RIGHT_EAR]: {
    key: PARTS.RIGHT_EAR,
    areaStyle: {
      top: 48,
      left: 98,
      height: 22,
      width: 30
    },
    dotStyle: {
      top: 4,
      left: 8
    }
  },
  [PARTS.LEFT_EAR]: {
    key: PARTS.LEFT_EAR,
    areaStyle: {
      top: 48,
      left: 160,
      height: 22,
      width: 30
    },
    dotStyle: {
      top: 4,
      left: 8
    }
  },
  [PARTS.NOSE]: {
    key: PARTS.NOSE,
    areaStyle: {
      top: 48,
      left: 128,
      height: 24,
      width: 32
    },
    dotStyle: {
      top: 4,
      left: 10
    }
  },
  [PARTS.MOUTH]: {
    key: PARTS.MOUTH,
    areaStyle: {
      top: 72,
      left: 118,
      height: 24,
      width: 52
    },
    dotStyle: {
      top: 4,
      left: 18
    }
  },
  [PARTS.NECK]: {
    key: PARTS.NECK,
    areaStyle: {
      top: 96,
      left: 120,
      height: 34,
      width: 48
    },
    dotStyle: {
      top: 6,
      left: 18
    }
  },
  [PARTS.RIGHT_SHOULDER]: {
    key: PARTS.RIGHT_SHOULDER,
    areaStyle: {
      top: 130,
      left: 50,
      height: 40,
      width: 40
    },
    dotStyle: {
      top: 8,
      left: 20
    }
    //areaStyle: { top: 144, left: 66 }
  },
  [PARTS.LEFT_SHOULDER]: {
    key: PARTS.LEFT_SHOULDER,
    areaStyle: {
      top: 130,
      left: 198,
      height: 40,
      width: 40
    },
    dotStyle: {
      top: 8,
      right: 20
    }
    //areaStyle: { top: 144, left: 210 }
  },
  [PARTS.CHEST]: {
    key: PARTS.CHEST,
    areaStyle: {
      top: 130,
      left: 90,
      height: 100,
      width: 108
    },
    dotStyle: {
      top: 45,
      left: 46
    }
    //areaStyle: { top: 180, left: 138 }
  },
  [PARTS.RIGHT_ARM]: {
    key: PARTS.RIGHT_ARM,
    areaStyle: {
      top: 170,
      left: 50,
      height: 60,
      width: 40
    },
    dotStyle: {
      top: 30,
      left: 10
    }
    //areaStyle: { top: 200, left: 60 }
  },
  [PARTS.LEFT_ARM]: {
    key: PARTS.LEFT_ARM,
    areaStyle: {
      top: 170,
      left: 200,
      height: 60,
      width: 40
    },
    dotStyle: {
      top: 30,
      right: 10
    }
    //areaStyle: { top: 200, left: 216 }
  },
  [PARTS.RIGHT_ELBOW]: {
    key: PARTS.RIGHT_ELBOW,
    areaStyle: {
      top: 230,
      left: 40,
      height: 50,
      width: 40
    },
    dotStyle: {
      top: 15,
      left: 14
    }
    //areaStyle: { top: 252, left: 54 }
  },
  [PARTS.LEFT_ELBOW]: {
    key: PARTS.LEFT_ELBOW,
    areaStyle: {
      top: 230,
      left: 206,
      height: 50,
      width: 40
    },
    dotStyle: {
      top: 15,
      right: 14
    }
    //areaStyle: { top: 252, left: 220 }
  },
  [PARTS.STOMACH]: {
    key: PARTS.STOMACH,
    areaStyle: {
      top: 230,
      left: 90,
      height: 80,
      width: 108
    },
    dotStyle: {
      top: 45,
      left: 46
    }
    //areaStyle: { top: 275, left: 138 }
  },
  [PARTS.ABDOMEN]: {
    key: PARTS.ABDOMEN,
    areaStyle: {
      top: 310,
      left: 84,
      // backgroundColor: "blue",
      height: 50,
      width: 120
    },
    dotStyle: {
      top: 20,
      left: 52
    }
    //areaStyle: { top: 330, left: 138 }
  },
  [PARTS.RIGHT_FOREARM]: {
    key: PARTS.RIGHT_FOREARM,
    areaStyle: {
      top: 280,
      left: 30,
      height: 70,
      width: 40
    },
    dotStyle: {
      top: 30,
      left: 14
    }
    //areaStyle: { top: 310, left: 44 }
  },
  [PARTS.LEFT_FOREARM]: {
    key: PARTS.LEFT_FOREARM,
    areaStyle: {
      top: 280,
      left: 218,
      height: 70,
      width: 40
    },
    dotStyle: {
      top: 30,
      right: 14
    }
    //areaStyle: { top: 310, left: 230 }
  },
  [PARTS.RIGHT_WRIST]: {
    key: PARTS.RIGHT_WRIST,
    areaStyle: {
      top: 350,
      left: 25,
      height: 28,
      width: 30
    },
    dotStyle: {
      top: 10,
      left: 8
    }
    //areaStyle: { top: 360, left: 32 }
  },
  [PARTS.LEFT_WRIST]: {
    key: PARTS.LEFT_WRIST,
    areaStyle: {
      top: 350,
      left: 232,
      height: 28,
      width: 30
    },
    dotStyle: {
      top: 10,
      right: 8
    }
    //areaStyle: { top: 360, left: 242 }
  },
  [PARTS.RIGHT_HAND]: {
    key: PARTS.RIGHT_HAND,
    areaStyle: {
      top: 378,
      left: 10,
      height: 25,
      width: 40
    },
    dotStyle: {
      top: 4,
      left: 18
    }
    //areaStyle: { top: 384, left: 26 }
  },
  [PARTS.LEFT_HAND]: {
    key: PARTS.LEFT_HAND,
    areaStyle: {
      top: 378,
      left: 238,
      height: 25,
      width: 40
    },
    dotStyle: {
      top: 4,
      right: 18
    }
    //areaStyle: { top: 384, left: 248 }
  },
  [PARTS.RIGHT_HAND_FINGER]: {
    key: PARTS.RIGHT_HAND_FINGER,
    areaStyle: {
      top: 403,
      left: 10,
      height: 40,
      width: 40
    },
    dotStyle: {
      top: 4,
      left: 14
    }
    //areaStyle: { top: 408, left: 24 }
  },
  [PARTS.LEFT_HAND_FINGER]: {
    key: PARTS.LEFT_HAND_FINGER,
    areaStyle: {
      top: 403,
      left: 238,
      height: 40,
      width: 40
    },
    dotStyle: {
      top: 4,
      right: 14
    }
    //areaStyle: { top: 408, left: 250 }
  },
  [PARTS.RIGHT_HIP]: {
    key: PARTS.RIGHT_HIP,
    areaStyle: {
      top: 360,
      // backgroundColor: "red",
      left: 70,
      height: 60,
      width: 50
    },
    dotStyle: {
      top: 20,
      left: 38
    }
    //areaStyle: { top: 390, left: 104 }
  },
  [PARTS.RECTUM]: {
    key: PARTS.RECTUM,
    areaStyle: {
      top: 360,
      left: 120,
      height: 30,
      // backgroundColor: "purple",
      width: 50
    },
    dotStyle: {
      top: 8,
      right: 20
    }
    //areaStyle: { top: 390, left: 172 }
  },
  [PARTS.URINARY_BLADDER]: {
    key: PARTS.URINARY_BLADDER,
    areaStyle: {
      top: 390,
      left: 120,
      height: 30,
      // backgroundColor: "green",
      width: 50
    },
    dotStyle: {
      top: 8,
      right: 20
    }
    //areaStyle: { top: 390, left: 172 }
  },
  [PARTS.LEFT_HIP]: {
    key: PARTS.LEFT_HIP,
    areaStyle: {
      top: 360,
      left: 170,
      height: 60,
      // backgroundColor: "grey",
      width: 50
    },
    dotStyle: {
      top: 20,
      right: 34
    }
    //areaStyle: { top: 390, left: 172 }
  },
  [PARTS.RIGHT_THIGH]: {
    key: PARTS.RIGHT_THIGH,
    areaStyle: {
      top: 420,
      left: 80,
      height: 100,
      width: 60
    },
    dotStyle: {
      top: 50,
      left: 20
    }
    //areaStyle: { top: 470, left: 104 }
  },
  [PARTS.LEFT_THIGH]: {
    key: PARTS.LEFT_THIGH,
    areaStyle: {
      top: 420,
      left: 150,
      height: 100,
      width: 60
    },
    dotStyle: {
      top: 50,
      right: 20
    }
    //areaStyle: { top: 470, left: 172 }
  },
  [PARTS.RIGHT_KNEE]: {
    key: PARTS.RIGHT_KNEE,
    areaStyle: {
      top: 520,
      left: 90,
      height: 60,
      width: 45
    },
    dotStyle: {
      top: 28,
      left: 18
    }
    //areaStyle: { top: 548, left: 104 }
  },
  [PARTS.LEFT_KNEE]: {
    key: PARTS.LEFT_KNEE,
    areaStyle: {
      top: 520,
      left: 154,
      height: 60,
      width: 45
    },
    dotStyle: {
      top: 28,
      right: 18
    }
    //areaStyle: { top: 548, left: 172 }
  },
  [PARTS.RIGHT_SHIN]: {
    key: PARTS.RIGHT_SHIN,
    areaStyle: {
      top: 580,
      left: 90,
      height: 100,
      width: 45
    },
    dotStyle: {
      top: 58,
      left: 18
    }
    //areaStyle: { top: 640, left: 104 }
  },
  [PARTS.LEFT_SHIN]: {
    key: PARTS.LEFT_SHIN,
    areaStyle: {
      top: 580,
      left: 154,
      height: 100,
      width: 45
    },
    dotStyle: {
      top: 58,
      right: 18
    }
    //areaStyle: { top: 640, left: 172 }
  },
  [PARTS.RIGHT_ANKLE]: {
    key: PARTS.RIGHT_ANKLE,
    areaStyle: {
      top: 680,
      left: 102,
      height: 33,
      width: 30
    },
    dotStyle: {
      top: 14,
      left: 8
    }
    //areaStyle: { top: 700, left: 108 }
  },
  [PARTS.LEFT_ANKLE]: {
    key: PARTS.LEFT_ANKLE,
    areaStyle: {
      top: 680,
      left: 156,
      height: 33,
      width: 30
    },
    dotStyle: {
      top: 14,
      right: 8
    }
    //areaStyle: { top: 700, left: 168 }
  },
  [PARTS.RIGHT_FOOT]: {
    key: PARTS.RIGHT_FOOT,
    areaStyle: {
      top: 713,
      left: 94,
      height: 20,
      width: 35
    },
    dotStyle: {
      top: 4,
      left: 12
    }
    //areaStyle: { top: 720, left: 108 }
  },
  [PARTS.LEFT_FOOT]: {
    key: PARTS.LEFT_FOOT,
    areaStyle: {
      top: 713,
      left: 160,
      height: 20,
      width: 35
    },
    dotStyle: {
      top: 4,
      right: 12
    }
    //areaStyle: { top: 720, left: 168 }
  },
  [PARTS.RIGHT_TOE]: {
    key: PARTS.RIGHT_TOE,
    areaStyle: {
      top: 733,
      left: 84,
      height: 20,
      width: 40
    },
    dotStyle: {
      top: 4,
      left: 20
    }
    //areaStyle: { top: 740, left: 108 }
  },
  [PARTS.LEFT_TOE]: {
    key: PARTS.LEFT_TOE,
    areaStyle: {
      top: 733,
      left: 165,
      height: 20,
      width: 40
    },
    dotStyle: {
      top: 4,
      right: 20
    }
    //areaStyle: { top: 740, left: 168 }
  }
};