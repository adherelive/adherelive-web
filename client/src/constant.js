export const PATH = {
  LANDING_PAGE: "/",
  DASHBOARD: "/dashboard",
  SIGN_IN: "/sign-in",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  CONSULTATION_FEE: "/consultation-fee",
  BILLING: "/billing",
  PAYMENT_DETAILS: "/payment-details",
  VALIDATION_PAGE: "/validation/:link",
  FORGOT_PASSWORD: "/forgot-password",
  IDENTIFY: "/identify/:link",
  SIGN_UP: "/sign-up/:link",
  REGISTER_PROFILE: "/register-profile",
  PROVIDER_REGISTER_PROFILE: "/register-profile/:id",
  REGISTER_QUALIFICATIONS: "/register-qualifications",
  PROVIDER_REGISTER_QUALIFICATIONS: "/register-qualifications/:doctor_id",
  REGISTER_CLINICS: "/register-clinics",
  PROVIDER_REGISTER_CLINICS: "/register-clinics/:doctor_id",
  PATIENT_CONSULTING: "/patient-consulting/:patient_id",
  TEST_PATIENT_CONSULTING_VIDEO: "/test/patient/consulting/video/:room_id",
  PATIENT_CONSULTING_VIDEO: "/patient/consulting/video/:room_id",
  RESET_PASSWORD: "/reset-password/:link",
  REGISTER_FROM_PROFILE: "/register-from-profile",
  REGISTER_FROM_MY_PROFILE: "/register-from-my-profile",
  TERMS_OF_PAYMENT: "/terms-of-payment/:id",
  PATIENT: {
    PA: "/patients",
    DETAILS: "/patients/:patient_id",
  },
  ADMIN: {
    DOCTORS: {
      ROOT: "/doctors",
      DETAILS: "/doctors/:id",
    },
    TOS_PP_EDITOR: "/details",
    ALL_PROVIDERS: "/providers",
    ALL_MEDICINES: "/medicines",
  },
  PROVIDER: {
    ROOT: "/provider",
    DOCTORS: {
      DETAILS: "/doctors/:id",
      PAYMENT_PRODUCTS: "/doctors/:id/payment-products",
    },
    CALENDER: "/calender",
    TRANSACTION_DETAILS: "/transaction-details",
    PAYMENT_DETAILS: "/payment-details",
  },
  DOCTOR: {
    TRANSACTION_DETAILS: "/transaction-details",
  },
  TERMS_OF_SERVICE: "/terms-of-service",
  PRIVACY_POLICY: "/privacy-policy",
  TEMPLATES: "/templates",
  CONSENT: "/consent",
};

export const AGORA_CALL_NOTIFICATION_TYPES = {
  START_CALL: "START_CALL",
  MISSED_CALL: "MISSED_CALL",
};

export const NOTIFICATION_STAGES = {
  CREATE: "Create",
  START: "Start",
  RESCHEDULED: "Rescheduled",
  UPDATE: "Update",
  PRIOR: "Prior",
  DELETE: "Delete",
  SHARE: "Share",
  EDIT_NOTES: "Edit_Notes",
  APPROVED: "Approve",
  RESPONSE_ADDED: "Response_added",
};

export const HTTP_CODE_SERVER_ERROR = 500;

export const CHAT_MESSAGE_DETAILS = {
  SYMPTOMS: "symptoms",
};
export const USER_ADHERE_BOT = "adhere_bot";
export const CHAT_MESSAGE_TYPE = {
  SYMPTOM: "symptoms",
  VITAL: "vitals",
  CONSULTATION: "consultation_fees",
};

export const TEXT_KEY = "text";
export const TIME_KEY = "time";

export const AFTER_WAKEUP = "1";
export const BEFORE_BREAKFAST = "2";
export const AFTER_BREAKFAST = "3";
export const BEFORE_LUNCH = "4";
export const WITH_LUNCH = "5";
export const AFTER_LUNCH = "6";
export const BEFORE_EVENING_SNACK = "7";
export const AFTER_EVENING_SNACK = "8";
export const BEFORE_DINNER = "9";
export const WITH_DINNER = "10";
export const AFTER_DINNER = "11";
export const BEFORE_SLEEP = "12";

export const NOON = "13";

export const MEDICATION_TIMING = {
  [AFTER_WAKEUP]: {
    [TEXT_KEY]: "After Wake Up",
    [TIME_KEY]: "8:00am",
  },
  [BEFORE_BREAKFAST]: {
    [TEXT_KEY]: "Before Breakfast",
    [TIME_KEY]: "8:30am",
  },
  [AFTER_BREAKFAST]: {
    [TEXT_KEY]: "After Breakfast",
    [TIME_KEY]: "9:30am",
  },
  [BEFORE_LUNCH]: {
    [TEXT_KEY]: "Before Lunch",
    [TIME_KEY]: "12:30pm",
  },
  [WITH_LUNCH]: {
    [TEXT_KEY]: "With Lunch",
    [TIME_KEY]: "1:00pm",
  },
  [AFTER_LUNCH]: {
    [TEXT_KEY]: "After Lunch",
    [TIME_KEY]: "1:30pm",
  },
  [BEFORE_EVENING_SNACK]: {
    [TEXT_KEY]: "Before Evening Snacks",
    [TIME_KEY]: "3:30pm",
  },
  [AFTER_EVENING_SNACK]: {
    [TEXT_KEY]: "After Evening Snacks",
    [TIME_KEY]: "4:30pm",
  },
  [BEFORE_DINNER]: {
    [TEXT_KEY]: "Before Dinner",
    [TIME_KEY]: "7:30pm",
  },
  [WITH_DINNER]: {
    [TEXT_KEY]: "With Dinner",
    [TIME_KEY]: "8:00pm",
  },
  [AFTER_DINNER]: {
    [TEXT_KEY]: "After Dinner",
    [TIME_KEY]: "8:30pm",
  },
  [BEFORE_SLEEP]: {
    [TEXT_KEY]: "Before Sleeping",
    [TIME_KEY]: "11:00pm",
  },
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
  [BEFORE_SLEEP]: 22,
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
  [BEFORE_SLEEP]: 30,
};

export const ONBOARDING_STATUS = {
  PROFILE_REGISTERED: "profile_registered",
  QUALIFICATION_REGISTERED: "qualification_registered",
  CLINIC_REGISTERED: "CLINIC_registered",
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
    label: "MALE",
  },
  [FEMALE]: {
    value: "female",
    view: "F",
    label: "FEMALE",
  },
  [OTHER]: {
    value: "other",
    view: "O",
    label: "OTHER",
  },
};

export const SYMPTOMS = "symptoms";
export const MISSED_MEDICATION = "no_medication";
export const MISSED_APPOINTMENTS = "no_appointment";
export const MISSED_ACTIONS = "no_action";
export const MISSED_DIET = "no_diet";
export const MISSED_WORKOUT = "no_workout";

export const MISSED_MEDICATION_TEXT = "Missed Medication";
export const MISSED_ACTION_TEXT = "Missed Actions";
export const MISSED_APPOINTMENT_TEXT = "Missed Appointments";
export const MISSED_SYMPTOM_TEXT = "Symptoms";

export const PATIENT_BOX_CONTENT = {
  [SYMPTOMS]: {
    text: "Symptoms",
    background_color: "light-aqua",
    border_color: "dark-aqua",
  },
  [MISSED_MEDICATION]: {
    text: "Missed Medication",
    background_color: "light-purple",
    border_color: "dark-purple",
  },
  [MISSED_APPOINTMENTS]: {
    text: "Missed Appointments",
    background_color: "light-orange",
    border_color: "dark-orange",
  },
  [MISSED_ACTIONS]: {
    text: "Missed Actions",
    background_color: "light-blue",
    border_color: "dark-blue",
  },
};

export const DRAWER = {
  ADD_MEDICATION_REMINDER: "ADD_MEDICATION_REMINDER",
  ADD_VITALS: "ADD_VITALS",
  EDIT_MEDICATION: "EDIT_MEDICATION",
  ADD_APPOINTMENT: "ADD_APPOINTMENT",
  EDIT_APPOINTMENT: "EDIT_APPOINTMENT",
  PATIENT_DETAILS: "PATIENT_DETAILS",
  SYMPTOMS: "SYMPTOMS",
  NOTIFICATIONS: "NOTIFICATIONS",
  EDIT_VITALS: "EDIT_VITALS",
  VITAL_RESPONSE_TIMELINE: "VITAL_RESPONSE_TIMELINE",
  ADD_CARE_PLAN: "ADD_CARE_PLAN",
  MEDICATION_RESPONSE_TIMELINE: "MEDICATION_RESPONSE_TIMELINE",
  ADD_CONSULTATION_FEE: "ADD_CONSULTATION_FEE",
  ADD_RAZORPAY_ACCOUNT_DETAILS: "ADD_RAZORPAY_ACCOUNT_DETAILS",
  EDIT_RAZORPAY_ACCOUNT_DETAILS: "EDIT_RAZORPAY_ACCOUNT_DETAILS",
  EDIT_PATIENT: "EDIT_PATIENT",
  ADD_PROVIDER: "ADD_PROVIDER",
  EDIT_PROVIDER: "EDIT_PROVIDER",
  ADD_REPORT: "ADD_REPORT",
  EDIT_REPORT: "EDIT_REPORT",
  MISSED_MEDICATION: "MISSED_MEDICATION",
  MISSED_APPOINTMENT: "MISSED_APPOINTMENT",
  MISSED_VITAL: "MISSED_VITAL",
  CREATE_CAREPLAN_TEMPLATE: "CREATE_CAREPLAN_TEMPLATE",
  EDIT_CAREPLAN_TEMPLATE: "EDIT_CAREPLAN_TEMPLATE",
  ADD_MEDICINES: "ADD_MEDICINES",
  ADD_FOOD_ITEM: "ADD_FOOD_ITEM",
  ADD_DIET: "ADD_DIET",
  EDIT_DIET: "EDIT_DIET",
  DIET_RESPONSE: "DIET_RESPONSE",
  ADD_WORKOUT: "ADD_WORKOUT",
  EDIT_WORKOUT: "EDIT_WORKOUT",
  WORKOUT_RESPONSE: "WORKOUT_RESPONSE",
  WORKOUT_RESPONSE_DETALS: "WORKOUT_RESPONSE_DETALS",
  MISSED_DIET: "MISSED_DIET",
  MISSED_WORKOUT: "MISSED_WORKOUT",
  ADD_SECONDARY_DOCTOR: "ADD_SECONDARY_DOCTOR",
};

export const USER_CATEGORY = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  PROGRAM_ADMIN: "programAdmin",
  CARE_TAKER: "care_taker",
  CHARITY_ADMIN: "charityAdmin",
  PHARMACY_ADMIN: "pharmacyAdmin",
  ADMIN: "admin",
  PROVIDER: "provider",
  HSP: "hsp",
};

export const ACTIVITY_TYPE = {
  VISIT: "visit",
  CALL: "call",
  CHAT: "chat",
};

export const PERMISSIONS = {
  ADD_PATIENT: "ADD_PATIENT",
  ADD_DOCTOR: "ADD_DOCTOR",
  VERIFIED_ACCOUNT: "VERIFIED_ACCOUNT",
  ADD_APPOINTMENT: "ADD_APPOINTMENT",
  EDIT_APPOINTMENT: "EDIT_APPOINTMENT",
  VIEW_PATIENT: "VIEW_PATIENT",
  ADD_MEDICATION: "ADD_MEDICATION",
  EDIT_MEDICATION: "EDIT_MEDICATION",
  EDIT_GRAPH: "EDIT_GRAPH",
  ADD_ACTION: "ADD_ACTION",
  ADD_CARE_PLAN_TEMPLATE: "ADD_CARE_PLAN_TEMPLATE",
  ADD_CARE_PLAN: "ADD_CARE_PLAN",
};

export const USER_PERMISSIONS = {
  /* [A] */

  APPOINTMENTS: {
    ADD: "ADD_APPOINTMENT",
    UPDATE: "UPDATE_APPOINTMENT",
    VIEW: "VIEW_APPOINTMENT",
    DELETE: "DELETE_APPOINTMENT",
    TEMPLATE: "TEMPLATE_APPOINTMENT",
  },

  ACCOUNT: {
    VERIFIED: "VERIFIED_ACCOUNT",
  },

  /* [C] */

  CARE_PLAN: {
    ADD: "ADD_CARE_PLAN",
    UPDATE: "UPDATE_CARE_PLAN",
    VIEW: "VIEW_CARE_PLAN",
  },

  CARE_PLAN_TEMPLATE: {
    ADD: "ADD_CARE_PLAN_TEMPLATE",
    UPDATE: "UPDATE_CARE_PLAN_TEMPLATE",
    VIEW: "VIEW_CARE_PLAN_TEMPLATE",
    DUPLICATE: "DUPLICATE_CARE_PLAN_TEMPLATE",
    DELETE: "DELETE_CARE_PLAN_TEMPLATE",
  },

  CALENDER: {
    VIEW: "VIEW_CALENDER",
  },

  /* [D] */

  DIETS: {
    ADD: "ADD_DIET",
    UPDATE: "UPDATE_DIET",
    VIEW: "VIEW_DIET",
    DELETE: "DELETE_DIET",
    TEMPLATE: "TEMPLATE_DIET",
  },

  DOCTORS: {
    ADD: "ADD_DOCTOR",
    UPDATE: "UPDATE_DOCTOR",
    VIEW: "VIEW_DOCTOR",
  },

  /* [G] */

  GRAPHS: {
    ADD: "ADD_GRAPH",
    UPDATE: "UPDATE_GRAPH",
  },

  /* [M] */

  MEDICATIONS: {
    ADD: "ADD_MEDICATION",
    UPDATE: "UPDATE_MEDICATION",
    VIEW: "VIEW_MEDICATION",
    VIEW_TIMELINE: "VIEW_TIMELINE_MEDICATION",
    DELETE: "DELETE_MEDICATION",
    TEMPLATE: "TEMPLATE_MEDICATION",
  },

  /* [P] */

  PATIENTS: {
    ADD: "ADD_PATIENT",
    UPDATE: "UPDATE_PATIENT",
    VIEW: "VIEW_PATIENT",
  },

  PAYMENT_PRODUCT: {
    ADD: "ADD_PAYMENT_PRODUCT",
    VIEW: "VIEW_PAYMENT_PRODUCT",
  },

  /* [R] */

  REPORTS: {
    ADD: "ADD_REPORT",
    UPDATE: "UPDATE_REPORT",
    VIEW: "VIEW_REPORT",
    DELETE: "DELETE_REPORT",
  },

  /* [V] */

  VITALS: {
    ADD: "ADD_VITAL",
    UPDATE: "UPDATE_VITAL",
    VIEW: "VIEW_VITAL",
    DELETE: "DELETE_VITAL",
    TEMPLATE: "TEMPLATE_VITAL",
  },

  /* [W] */

  WORKOUTS: {
    ADD: "ADD_WORKOUT",
    UPDATE: "UPDATE_WORKOUT",
    VIEW: "VIEW_WORKOUT",
    DELETE: "DELETE_WORKOUT",
    TEMPLATE: "TEMPLATE_WORKOUT",
  },
};

const DAY = "1";
const MONTH = "2";
const YEAR = "3";

export const AGE_TYPE = {
  [DAY]: "d",
  [MONTH]: "m",
  [YEAR]: "y",
};

export const APPOINTMENT_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication",
  MATERIAL_DELIVERY: "material_delivery",
};

export const USER_STATUS = {
  ENROLLED: "ENROLLED",
  DISCHARGED: "DISCHARGED",
  INACTIVE: "INACTIVE",
  DROPPED: "DROPPED",
};

export const REPEAT_TYPE = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

export const REPEAT_OPTION = [
  { label: "Does not repeat", key: REPEAT_TYPE.NONE },
  { label: "Repeats Daily", key: REPEAT_TYPE.DAILY },
  { label: "Repeats Weekly", key: REPEAT_TYPE.WEEKLY },
  { label: "Repeats Monthly", key: REPEAT_TYPE.MONTHLY },
  { label: "Repeats Yearly", key: REPEAT_TYPE.YEARLY },
];

export const EVENT_ACTION = {
  EDIT_NOTES: "EDIT_NOTES",
  RESCHEDULE: "RESCHEDULE",
  EDIT_REMINDER: "EDIT_REMINDER",
  ADD_NOTES: "ADD_NOTES",
  DELETE_REMINDER: "DELETE_REMINDER",
  ADD_PRODUCT: "ADD_PRODUCT",
  EDIT_PRODUCT: "EDIT_PRODUCT",
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DAYS_TEXT = {
  Mon: "monday",
  Tue: "tuesday",
  Wed: "wednesday",
  Thu: "thursday",
  Fri: "friday",
  Sat: "saturday",
  Sun: "sunday",
};

export const ALTERNATE_DAYS = ["Sun", "Tue", "Thu", "Sat"];

export const DAYS_NUMBER = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export const DAYS_TEXT_NUM = {
  1: "sunday",
  2: "monday",
  3: "tuesday",
  4: "wednesday",
  5: "thursday",
  6: "friday",
  7: "saturday",
};

export const DAYS_TEXT_NUM_SHORT = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

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
  SYMPTOMS: "symptoms",
  VITALS: "vitals",
  DIET: "diet",
  WORKOUT: "workout",
};

export const EVENT_STATUS = {
  SCHEDULED: "scheduled",
  PENDING: "pending",
  COMPLETED: "completed",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
};

//request type
export const REQUEST_TYPE = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete",
};

export const SEVERITY_STATUS = {
  [CRITICAL]: {
    text: "Critical",
    color: "red",
  },
  [LOW]: {
    text: "Low",
    color: "green",
  },
  [HIGH]: {
    text: "High",
    color: "red",
  },
  [MEDIUM]: {
    text: "Medium",
    color: "black",
  },
};

// export const NO_ADHERENCE = "1";
export const NO_MEDICATION = "1";
export const NO_APPOINTMENT = "2";
export const NO_ACTION = "3";
export const NO_DIET = "4";
export const NO_WORKOUT = "5";

export const CHART_TITLE = {
  // [NO_ADHERENCE]: "Adherence",
  [NO_MEDICATION]: "Missed Medication",
  [NO_APPOINTMENT]: "Missed Appointments",
  [NO_ACTION]: "Missed Actions",
  [NO_DIET]: "Missed Diet",
  [NO_WORKOUT]: "Missed Workout",
};

export const GRAPH_COLORS = {
  // [NO_ADHERENCE]: {
  //   dark: "#13c2c2",
  //   light: "#b5f5ec",
  //   className: {
  //     dark: "bg-dark-aqua",
  //     light: "bg-light-aqua"
  //   }
  // },
  [NO_MEDICATION]: {
    dark: "#722ed1",
    light: "#d3adf7",
    className: {
      dark: "bg-dark-purple",
      light: "bg-light-purple",
    },
  },
  [NO_APPOINTMENT]: {
    dark: "#fa8c16",
    light: "#ffd591",
    className: {
      dark: "bg-dark-orange",
      light: "bg-light-orange",
    },
  },
  [NO_ACTION]: {
    dark: "#597ef7",
    light: "#adc6ff",
    className: {
      dark: "bg-dark-blue",
      light: "bg-light-blue",
    },
  },
  [NO_DIET]: {
    dark: "#A0522D",
    light: "#F5DEB3",
    className: {
      dark: "bg-dark-brown",
      light: "bg-light-brown",
    },
  },
  [NO_WORKOUT]: {
    dark: "#00FF7F",
    light: "#90EE90",
    className: {
      dark: "bg-spring-green",
      light: "bg-light-green",
    },
  },
};

export const GRAPH_TYPE = {
  // [NO_ADHERENCE]: 'donut',
  [NO_MEDICATION]: "donut",
  [NO_APPOINTMENT]: "donut",
  // [NO_ACTION]: 'donut',
  // [TEST_ONE]: 'donut'
};

export const SYMPTOM = {
  NEW: "Yes",
  OLD: "--",
};

export const TRAUMA = "1";

export const CONDITIONS = {
  [TRAUMA]: {
    value: "Trauma",
  },
};

export const TABLE_DEFAULT_BLANK_FIELD = "--";

export const TABLET = "1";
export const SYRUP = "2";
export const SYRINGE = "3";

export const MEDICINE_FORM_TYPE = {
  [TABLET]: { name: "tablet" },
  [SYRUP]: { name: "syrup" },
  [SYRINGE]: { name: "syringe" },
};

export const MEDICINE_TYPE = {
  TABLET: "tablet",
  INJECTION: "injection",
  SYRUP: "syrup",
};

export const MEDICINE_UNITS = {
  MG: "1",
  ML: "2",
};

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
  FULL_DAYS.SUN,
];

export const DAYS_KEYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const HEAD = "1";
const RIGHT_EYE = "2";
const LEFT_EYE = "3";
const RIGHT_EAR = "4";
const LEFT_EAR = "5";
const NOSE = "6";
const MOUTH = "7";
const NECK = "8";
const RIGHT_SHOULDER = "9";
const LEFT_SHOULDER = "10";
const CHEST = "11";
const RIGHT_ARM = "12";
const LEFT_ARM = "13";
const RIGHT_ELBOW = "14";
const LEFT_ELBOW = "15";
const STOMACH = "16";
const ABDOMEN = "17";
const RIGHT_FOREARM = "18";
const LEFT_FOREARM = "19";
const RIGHT_WRIST = "20";
const LEFT_WRIST = "21";
const RIGHT_HAND = "22";
const LEFT_HAND = "23";
const RIGHT_HAND_FINGER = "24";
const LEFT_HAND_FINGER = "25";
const RIGHT_HIP = "26";
const LEFT_HIP = "27";
const RIGHT_THIGH = "28";
const LEFT_THIGH = "29";
const RIGHT_KNEE = "30";
const LEFT_KNEE = "31";
const RIGHT_SHIN = "32";
const LEFT_SHIN = "33";
const RIGHT_ANKLE = "34";
const LEFT_ANKLE = "35";
const RIGHT_FOOT = "36";
const LEFT_FOOT = "37";
const RIGHT_TOE = "38";
const LEFT_TOE = "39";
const RECTUM = "40";
const URINARY_BLADDER = "41";
const HEAD_BACK = "42";
const NECK_BACK = "43";
const RIGHT_SHOULDER_BACK = "44";
const LEFT_SHOULDER_BACK = "45";
const BACK = "46";
const LOWER_BACK = "47";
const LEFT_TRICEP = "48";
const RIGHT_TRICEP = "49";
const LEFT_FOREARM_BACK = "50";
const RIGHT_FOREARM_BACK = "51";
const LEFT_HAMSTRING = "52";
const RIGHT_HAMSTRING = "53";
const LEFT_CALF = "54";
const RIGHT_CALF = "55";

export const PARTS_GRAPH = {
  [HEAD]: { name: "Head" },
  [RIGHT_EYE]: { name: "Right Eye" },
  [LEFT_EYE]: { name: "Left Eye" },
  [RIGHT_EAR]: { name: "Right Ear" },
  [LEFT_EAR]: { name: "Left Ear" },
  [NOSE]: { name: "Nose" },
  [MOUTH]: { name: "Mouth" },
  [NECK]: { name: "Neck" },
  [RIGHT_SHOULDER]: { name: "Right Shoulder" },
  [LEFT_SHOULDER]: { name: "Left Shoulder" },
  [CHEST]: { name: "Chest" },
  [RIGHT_ARM]: { name: "Right Arm" },
  [LEFT_ARM]: { name: "Left Arm" },
  [RIGHT_ELBOW]: { name: "Right Elbow" },
  [LEFT_ELBOW]: { name: "Left Elbow" },
  [STOMACH]: { name: "Stomach" },
  [ABDOMEN]: { name: "Abdomen" },
  [RIGHT_FOREARM]: { name: "Right Forearm" },
  [LEFT_FOREARM]: { name: "Left Forearm" },
  [RIGHT_WRIST]: { name: "Right Wrist" },
  [LEFT_WRIST]: { name: "Left Wrist" },
  [RIGHT_HAND]: { name: "Right Hand" },
  [LEFT_HAND]: { name: "Left Hand" },
  [RIGHT_HAND_FINGER]: { name: "Right Hand Finger" },
  [LEFT_HAND_FINGER]: { name: "Left Hand Finger" },
  [RIGHT_HIP]: { name: "Right Hip" },
  [LEFT_HIP]: { name: "Left Hip" },
  [RIGHT_THIGH]: { name: "Right Thigh" },
  [LEFT_THIGH]: { name: "Left Thigh" },
  [RIGHT_KNEE]: { name: "Right Knee" },
  [LEFT_KNEE]: { name: "Left Knee" },
  [RIGHT_SHIN]: { name: "Right Shin" },
  [LEFT_SHIN]: { name: "Left Shin" },
  [RIGHT_ANKLE]: { name: "Right Ankle" },
  [LEFT_ANKLE]: { name: "Left Ankle" },
  [RIGHT_FOOT]: { name: "Right Foot" },
  [LEFT_FOOT]: { name: "Left Foot" },
  [RIGHT_TOE]: { name: "Right Toe" },
  [LEFT_TOE]: { name: "Left Toe" },
  [RECTUM]: { name: "Rectum" },
  [URINARY_BLADDER]: { name: "Urinary Bladder" },

  [HEAD_BACK]: { name: "Head" },
  [NECK_BACK]: { name: "Neck" },
  [RIGHT_SHOULDER_BACK]: { name: "Right Shoulder" },
  [LEFT_SHOULDER_BACK]: { name: "Left Shoulder" },
  [BACK]: { name: "Back" },
  [LOWER_BACK]: { name: "Lower Back" },
  [LEFT_TRICEP]: { name: "Left Tricep" },
  [RIGHT_TRICEP]: { name: "Right Tricep" },
  [LEFT_FOREARM_BACK]: { name: "Left  Forearm" },
  [RIGHT_FOREARM_BACK]: { name: "Right Forearm" },
  [LEFT_HAMSTRING]: { name: "Left Hamstring" },
  [RIGHT_HAMSTRING]: { name: "Right Hamstring" },
  [LEFT_CALF]: { name: "Left Calf" },
  [RIGHT_CALF]: { name: "Right Calf" },
};

export const BODY_VIEW = {
  FRONT: "1",
  BACK: "2",
};

export const BODY_SIDE = {
  1: "FRONT",
  2: "BACK",
};

export const BODY_SIDE_TEXT = {
  1: "Front",
  2: "Back",
};
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
  URINARY_BLADDER: "URINARY_BLADDER",
};

export const PART_LIST = [
  HEAD,
  RIGHT_EYE,
  LEFT_EYE,
  RIGHT_EAR,
  LEFT_EAR,
  NOSE,
  MOUTH,
  NECK,
  RIGHT_SHOULDER,
  LEFT_SHOULDER,
  CHEST,
  RIGHT_ARM,
  LEFT_ARM,
  RIGHT_ELBOW,
  LEFT_ELBOW,
  STOMACH,
  ABDOMEN,
  RIGHT_FOREARM,
  LEFT_FOREARM,
  RIGHT_WRIST,
  LEFT_WRIST,
  RIGHT_HAND,
  LEFT_HAND,
  RIGHT_HAND_FINGER,
  LEFT_HAND_FINGER,
  RIGHT_THIGH,
  LEFT_THIGH,
  RIGHT_KNEE,
  LEFT_KNEE,
  RIGHT_SHIN,
  LEFT_SHIN,
  RIGHT_ANKLE,
  LEFT_ANKLE,
  RIGHT_FOOT,
  LEFT_FOOT,
  RIGHT_TOE,
  LEFT_TOE,
  RECTUM,
  URINARY_BLADDER,
  RIGHT_HIP,
  LEFT_HIP,
  HEAD_BACK,
  NECK_BACK,
  RIGHT_SHOULDER_BACK,
  LEFT_SHOULDER_BACK,
  BACK,
  LOWER_BACK,
  LEFT_TRICEP,
  RIGHT_TRICEP,
  LEFT_FOREARM_BACK,
  RIGHT_FOREARM_BACK,
  LEFT_HAMSTRING,
  RIGHT_HAMSTRING,
  LEFT_CALF,
  RIGHT_CALF,
];

export const PART_LIST_CODES = {
  HEAD: HEAD,
  RIGHT_EYE: RIGHT_EYE,
  LEFT_EYE: LEFT_EYE,
  RIGHT_EAR: RIGHT_EAR,
  LEFT_EAR: LEFT_EAR,
  NOSE: NOSE,
  MOUTH: MOUTH,
  NECK: NECK,
  RIGHT_SHOULDER: RIGHT_SHOULDER,
  LEFT_SHOULDER: LEFT_SHOULDER,
  CHEST: CHEST,
  RIGHT_ARM: RIGHT_ARM,
  LEFT_ARM: LEFT_ARM,
  RIGHT_ELBOW: RIGHT_ELBOW,
  LEFT_ELBOW: LEFT_ELBOW,
  STOMACH: STOMACH,
  ABDOMEN: ABDOMEN,
  RIGHT_FOREARM: RIGHT_FOREARM,
  LEFT_FOREARM: LEFT_FOREARM,
  RIGHT_WRIST: RIGHT_WRIST,
  LEFT_WRIST: LEFT_WRIST,
  RIGHT_HAND: RIGHT_HAND,
  LEFT_HAND: LEFT_HAND,
  RIGHT_HAND_FINGER: RIGHT_HAND_FINGER,
  LEFT_HAND_FINGER: LEFT_HAND_FINGER,
  RIGHT_THIGH: RIGHT_THIGH,
  LEFT_THIGH: LEFT_THIGH,
  RIGHT_KNEE: RIGHT_KNEE,
  LEFT_KNEE: LEFT_KNEE,
  RIGHT_SHIN: RIGHT_SHIN,
  LEFT_SHIN: LEFT_SHIN,
  RIGHT_ANKLE: RIGHT_ANKLE,
  LEFT_ANKLE: LEFT_ANKLE,
  RIGHT_FOOT: RIGHT_FOOT,
  LEFT_FOOT: LEFT_FOOT,
  RIGHT_TOE: RIGHT_TOE,
  LEFT_TOE: LEFT_TOE,
  RECTUM: RECTUM,
  URINARY_BLADDER: URINARY_BLADDER,
  RIGHT_HIP: RIGHT_HIP,
  LEFT_HIP: LEFT_HIP,
  HEAD_BACK: HEAD_BACK,
  NECK_BACK: NECK_BACK,
  RIGHT_SHOULDER_BACK: RIGHT_SHOULDER_BACK,
  LEFT_SHOULDER_BACK: LEFT_SHOULDER_BACK,
  BACK: BACK,
  LOWER_BACK: LOWER_BACK,
  LEFT_TRICEP: LEFT_TRICEP,
  RIGHT_TRICEP: RIGHT_TRICEP,
  LEFT_FOREARM_BACK: LEFT_FOREARM_BACK,
  RIGHT_FOREARM_BACK: RIGHT_FOREARM_BACK,
  LEFT_HAMSTRING: LEFT_HAMSTRING,
  RIGHT_HAMSTRING: RIGHT_HAMSTRING,
  LEFT_CALF: LEFT_CALF,
  RIGHT_CALF: RIGHT_CALF,
};

export const PART_LIST_FRONT = [
  HEAD,
  RIGHT_EYE,
  LEFT_EYE,
  RIGHT_EAR,
  LEFT_EAR,
  NOSE,
  MOUTH,
  NECK,
  RIGHT_SHOULDER,
  LEFT_SHOULDER,
  CHEST,
  RIGHT_ARM,
  LEFT_ARM,
  RIGHT_ELBOW,
  LEFT_ELBOW,
  STOMACH,
  ABDOMEN,
  RIGHT_FOREARM,
  LEFT_FOREARM,
  RIGHT_WRIST,
  LEFT_WRIST,
  RIGHT_HAND,
  LEFT_HAND,
  RIGHT_HAND_FINGER,
  LEFT_HAND_FINGER,
  RIGHT_THIGH,
  LEFT_THIGH,
  RIGHT_KNEE,
  LEFT_KNEE,
  RIGHT_SHIN,
  LEFT_SHIN,
  RIGHT_ANKLE,
  LEFT_ANKLE,
  RIGHT_FOOT,
  LEFT_FOOT,
  RIGHT_TOE,
  LEFT_TOE,
  RECTUM,
  URINARY_BLADDER,
];

export const PART_LIST_BACK = [
  RIGHT_HIP,
  LEFT_HIP,
  HEAD_BACK,
  NECK_BACK,
  RIGHT_SHOULDER_BACK,
  LEFT_SHOULDER_BACK,
  BACK,
  LOWER_BACK,
  LEFT_TRICEP,
  RIGHT_TRICEP,
  LEFT_FOREARM_BACK,
  RIGHT_FOREARM_BACK,
  LEFT_HAMSTRING,
  RIGHT_HAMSTRING,
  LEFT_CALF,
  RIGHT_CALF,
];

export const BODY = {
  [HEAD]: {
    key: HEAD,
    areaStyle: {
      height: 30,
      width: 68,
      top: 5,
      left: 90,
    },
    dotStyle: {
      top: 14,
      left: 28,
    },
  },
  [HEAD_BACK]: {
    key: HEAD_BACK,
    areaStyle: {
      height: 30,
      width: 68,
      top: 5,
      left: 90,
    },
    dotStyle: {
      top: 14,
      left: 28,
    },
  },
  [RIGHT_EYE]: {
    key: RIGHT_EYE,
    areaStyle: {
      top: 30,
      left: 92,
      height: 18,
      width: 35,
    },
    dotStyle: {
      top: 6,
      left: 14,
    },
  },
  [LEFT_EYE]: {
    key: LEFT_EYE,
    areaStyle: {
      top: 30,
      left: 125,
      height: 18,
      width: 35,
    },
    dotStyle: {
      top: 6,
      left: 4,
    },
  },
  [RIGHT_EAR]: {
    key: RIGHT_EAR,
    areaStyle: {
      top: 38,
      left: 78,
      height: 22,
      width: 30,
    },
    dotStyle: {
      top: 4,
      left: 10,
    },
  },
  [LEFT_EAR]: {
    key: LEFT_EAR,
    areaStyle: {
      top: 38,
      left: 140,
      height: 22,
      width: 30,
    },
    dotStyle: {
      top: 4,
      left: 6,
    },
  },
  [NOSE]: {
    key: NOSE,
    areaStyle: {
      top: 44,
      left: 113,
      height: 15,
      width: 22,
    },
    dotStyle: {
      top: 2,
      left: 4,
    },
  },
  [MOUTH]: {
    key: MOUTH,
    areaStyle: {
      top: 56,
      left: 105,
      height: 18,
      width: 42,
    },
    dotStyle: {
      top: 4,
      left: 14,
    },
  },
  [NECK]: {
    key: NECK,
    areaStyle: {
      top: 70,
      left: 100,
      height: 34,
      width: 48,
    },
    dotStyle: {
      top: 6,
      left: 18,
    },
  },

  [NECK_BACK]: {
    key: NECK_BACK,
    areaStyle: {
      top: 70,
      left: 100,
      height: 34,
      width: 48,
    },
    dotStyle: {
      top: 6,
      left: 18,
    },
  },
  [RIGHT_SHOULDER]: {
    key: RIGHT_SHOULDER,
    areaStyle: {
      top: 95,
      left: 40,
      height: 40,
      width: 40,
    },
    dotStyle: {
      top: 8,
      left: 20,
    },
    //areaStyle: { top: 144, left: 66 }
  },
  [LEFT_SHOULDER]: {
    key: LEFT_SHOULDER,
    areaStyle: {
      top: 95,
      left: 158,
      height: 40,
      width: 40,
    },
    dotStyle: {
      top: 8,
      right: 10,
    },
    //areaStyle: { top: 144, left: 210 }
  },
  [LEFT_SHOULDER_BACK]: {
    key: LEFT_SHOULDER_BACK,
    areaStyle: {
      top: 95,
      left: 40,
      height: 40,
      width: 40,
    },
    dotStyle: {
      top: 8,
      left: 20,
    },
    //areaStyle: { top: 144, left: 66 }
  },
  [RIGHT_SHOULDER_BACK]: {
    key: RIGHT_SHOULDER_BACK,
    areaStyle: {
      top: 95,
      left: 158,
      height: 40,
      width: 40,
    },
    dotStyle: {
      top: 8,
      right: 10,
    },
    //areaStyle: { top: 144, left: 210 }
  },
  [CHEST]: {
    key: CHEST,
    areaStyle: {
      top: 100,
      left: 80,
      height: 50,
      width: 88,
    },
    dotStyle: {
      top: 20,
      left: 36,
    },
    //areaStyle: { top: 180, left: 138 }
  },
  [BACK]: {
    key: BACK,
    areaStyle: {
      top: 100,
      left: 80,
      height: 50,
      width: 88,
    },
    dotStyle: {
      top: 20,
      left: 36,
    },
    //areaStyle: { top: 180, left: 138 }
  },
  [RIGHT_ARM]: {
    key: RIGHT_ARM,
    areaStyle: {
      top: 120,
      left: 45,
      height: 60,
      width: 40,
    },
    dotStyle: {
      top: 30,
      left: 15,
    },
    //areaStyle: { top: 200, left: 60 }
  },
  [LEFT_ARM]: {
    key: LEFT_ARM,
    areaStyle: {
      top: 120,
      left: 165,
      height: 60,
      width: 40,
    },
    dotStyle: {
      top: 30,
      right: 15,
    },
    //areaStyle: { top: 200, left: 216 }
  },
  [LEFT_TRICEP]: {
    key: LEFT_TRICEP,
    areaStyle: {
      top: 120,
      left: 45,
      height: 60,
      width: 40,
    },
    dotStyle: {
      top: 30,
      left: 15,
    },
    //areaStyle: { top: 200, left: 60 }
  },
  [RIGHT_TRICEP]: {
    key: RIGHT_TRICEP,
    areaStyle: {
      top: 120,
      left: 165,
      height: 60,
      width: 40,
    },
    dotStyle: {
      top: 30,
      right: 15,
    },
    //areaStyle: { top: 200, left: 216 }
  },
  [RIGHT_ELBOW]: {
    key: RIGHT_ELBOW,
    areaStyle: {
      top: 160,
      left: 45,
      height: 40,
      width: 40,
    },
    dotStyle: {
      top: 15,
      left: 14,
    },
    //areaStyle: { top: 252, left: 54 }
  },
  [LEFT_ELBOW]: {
    key: LEFT_ELBOW,
    areaStyle: {
      top: 160,
      left: 166,
      height: 40,
      width: 40,
    },
    dotStyle: {
      top: 15,
      right: 14,
    },
    //areaStyle: { top: 252, left: 220 }
  },
  [STOMACH]: {
    key: STOMACH,
    areaStyle: {
      top: 170,
      left: 90,
      height: 40,
      width: 70,
      // backgroundColor: "blue",
    },
    dotStyle: {
      top: 20,
      left: 30,
    },
    //areaStyle: { top: 275, left: 138 }
  },
  [ABDOMEN]: {
    key: ABDOMEN,
    areaStyle: {
      top: 210,
      left: 90,
      height: 40,
      width: 70,
    },
    dotStyle: {
      top: 15,
      left: 28,
    },
    //areaStyle: { top: 330, left: 138 }
  },

  [LOWER_BACK]: {
    key: LOWER_BACK,
    areaStyle: {
      top: 210,
      left: 90,
      height: 40,
      width: 70,
    },
    dotStyle: {
      top: 15,
      left: 28,
    },
    //areaStyle: { top: 330, left: 138 }
  },
  [RIGHT_FOREARM]: {
    key: RIGHT_FOREARM,
    areaStyle: {
      top: 200,
      left: 30,
      height: 50,
      width: 40,
    },
    dotStyle: {
      top: 20,
      left: 14,
    },
    //areaStyle: { top: 310, left: 44 }
  },
  [LEFT_FOREARM]: {
    key: LEFT_FOREARM,
    areaStyle: {
      top: 200,
      left: 180,
      height: 50,
      width: 40,
    },
    dotStyle: {
      top: 20,
      right: 14,
    },
    //areaStyle: { top: 310, left: 230 }
  },
  [LEFT_FOREARM_BACK]: {
    key: LEFT_FOREARM_BACK,
    areaStyle: {
      top: 200,
      left: 30,
      height: 50,
      width: 40,
    },
    dotStyle: {
      top: 20,
      left: 14,
    },
    //areaStyle: { top: 310, left: 44 }
  },
  [RIGHT_FOREARM_BACK]: {
    key: RIGHT_FOREARM_BACK,
    areaStyle: {
      top: 200,
      left: 180,
      height: 50,
      width: 40,
    },
    dotStyle: {
      top: 20,
      right: 14,
    },
    //areaStyle: { top: 310, left: 230 }
  },
  [RIGHT_WRIST]: {
    key: RIGHT_WRIST,
    areaStyle: {
      top: 240,
      left: 25,
      height: 28,
      width: 30,
    },
    dotStyle: {
      top: 10,
      left: 8,
    },
    //areaStyle: { top: 360, left: 32 }
  },
  [LEFT_WRIST]: {
    key: LEFT_WRIST,
    areaStyle: {
      top: 240,
      left: 200,
      height: 28,
      width: 30,
    },
    dotStyle: {
      top: 10,
      right: 8,
    },
    //areaStyle: { top: 360, left: 242 }
  },
  [RIGHT_HAND]: {
    key: RIGHT_HAND,
    areaStyle: {
      top: 270,
      left: 10,
      height: 25,
      width: 40,
    },
    dotStyle: {
      top: 4,
      left: 18,
    },
    //areaStyle: { top: 384, left: 26 }
  },
  [LEFT_HAND]: {
    key: LEFT_HAND,
    areaStyle: {
      top: 270,
      left: 200,
      height: 25,
      width: 40,
    },
    dotStyle: {
      top: 4,
      right: 18,
    },
    //areaStyle: { top: 384, left: 248 }
  },
  [RIGHT_HAND_FINGER]: {
    key: RIGHT_HAND_FINGER,
    areaStyle: {
      top: 295,
      left: 10,
      height: 40,
      width: 40,
      // backgroundColor: "blue",
    },
    dotStyle: {
      top: 4,
      left: 14,
    },
    //areaStyle: { top: 408, left: 24 }
  },
  [LEFT_HAND_FINGER]: {
    key: LEFT_HAND_FINGER,
    areaStyle: {
      top: 295,
      left: 200,
      height: 40,
      width: 40,
    },
    dotStyle: {
      top: 4,
      right: 14,
    },
    //areaStyle: { top: 408, left: 250 }
  },
  [LEFT_HIP]: {
    key: LEFT_HIP,
    areaStyle: {
      top: 235,
      left: 70,
      height: 50,
      width: 50,
    },
    dotStyle: {
      top: 20,
      left: 30,
    },
    //areaStyle: { top: 390, left: 104 }
  },
  [RECTUM]: {
    key: RECTUM,
    areaStyle: {
      top: 240,
      left: 100,
      height: 20,
      width: 50,
    },
    dotStyle: {
      top: 6,
      right: 18,
    },
    //areaStyle: { top: 390, left: 172 }
  },
  [URINARY_BLADDER]: {
    key: URINARY_BLADDER,
    areaStyle: {
      top: 260,
      left: 100,
      height: 30,
      // backgroundColor: "green",
      width: 50,
    },
    dotStyle: {
      top: 8,
      right: 20,
    },
    //areaStyle: { top: 390, left: 172 }
  },
  [RIGHT_HIP]: {
    key: RIGHT_HIP,
    areaStyle: {
      top: 235,
      left: 125,
      height: 50,
      width: 50,
    },
    dotStyle: {
      top: 20,
      right: 25,
    },
    //areaStyle: { top: 390, left: 172 }
  },
  [RIGHT_THIGH]: {
    key: RIGHT_THIGH,
    areaStyle: {
      top: 285,
      left: 70,
      height: 80,
      width: 60,
    },
    dotStyle: {
      top: 35,
      left: 25,
    },
    //areaStyle: { top: 470, left: 104 }
  },
  [LEFT_THIGH]: {
    key: LEFT_THIGH,
    areaStyle: {
      top: 285,
      left: 130,
      height: 80,
      width: 60,
    },
    dotStyle: {
      top: 35,
      right: 30,
    },
    //areaStyle: { top: 470, left: 172 }
  },
  [LEFT_HAMSTRING]: {
    key: LEFT_HAMSTRING,
    areaStyle: {
      top: 285,
      left: 70,
      height: 80,
      width: 60,
    },
    dotStyle: {
      top: 35,
      left: 25,
    },
    //areaStyle: { top: 470, left: 104 }
  },
  [RIGHT_HAMSTRING]: {
    key: RIGHT_HAMSTRING,
    areaStyle: {
      top: 285,
      left: 130,
      height: 80,
      width: 60,
    },
    dotStyle: {
      top: 35,
      right: 30,
    },
    //areaStyle: { top: 470, left: 172 }
  },
  [RIGHT_KNEE]: {
    key: RIGHT_KNEE,
    areaStyle: {
      top: 365,
      left: 80,
      height: 50,
      width: 45,
    },
    dotStyle: {
      top: 15,
      left: 18,
    },
    //areaStyle: { top: 548, left: 104 }
  },
  [LEFT_KNEE]: {
    key: LEFT_KNEE,
    areaStyle: {
      top: 365,
      left: 130,
      height: 50,
      width: 45,
    },
    dotStyle: {
      top: 15,
      right: 18,
    },
    //areaStyle: { top: 548, left: 172 }
  },
  [RIGHT_SHIN]: {
    key: RIGHT_SHIN,
    areaStyle: {
      top: 415,
      left: 80,
      height: 60,
      width: 45,
    },
    dotStyle: {
      top: 20,
      left: 22,
    },
    //areaStyle: { top: 640, left: 104 }
  },
  [LEFT_SHIN]: {
    key: LEFT_SHIN,
    areaStyle: {
      top: 415,
      left: 130,
      height: 60,
      width: 45,
    },
    dotStyle: {
      top: 20,
      right: 22,
    },
    //areaStyle: { top: 640, left: 172 }
  },
  [LEFT_CALF]: {
    key: LEFT_CALF,
    areaStyle: {
      top: 415,
      left: 80,
      height: 60,
      width: 45,
    },
    dotStyle: {
      top: 20,
      left: 22,
    },
    //areaStyle: { top: 640, left: 104 }
  },
  [RIGHT_CALF]: {
    key: RIGHT_CALF,
    areaStyle: {
      top: 415,
      left: 130,
      height: 60,
      width: 45,
    },
    dotStyle: {
      top: 20,
      right: 22,
    },
    //areaStyle: { top: 640, left: 172 }
  },
  [RIGHT_ANKLE]: {
    key: RIGHT_ANKLE,
    areaStyle: {
      top: 470,
      left: 102,
      height: 25,
      width: 30,
    },
    dotStyle: {
      top: 10,
      left: 8,
    },
    //areaStyle: { top: 700, left: 108 }
  },
  [LEFT_ANKLE]: {
    key: LEFT_ANKLE,
    areaStyle: {
      top: 470,
      left: 132,
      height: 25,
      width: 30,
    },
    dotStyle: {
      top: 10,
      right: 12,
    },
    //areaStyle: { top: 700, left: 168 }
  },
  [RIGHT_FOOT]: {
    key: RIGHT_FOOT,
    areaStyle: {
      top: 490,
      left: 94,
      height: 20,
      width: 35,
      // backgroundColor: "blue",
    },
    dotStyle: {
      top: 4,
      left: 12,
    },
    //areaStyle: { top: 720, left: 108 }
  },
  [LEFT_FOOT]: {
    key: LEFT_FOOT,
    areaStyle: {
      top: 490,
      left: 130,
      height: 20,
      width: 35,
      // backgroundColor: "blue",
    },
    dotStyle: {
      top: 4,
      right: 12,
    },
    //areaStyle: { top: 720, left: 168 }
  },
  [RIGHT_TOE]: {
    key: RIGHT_TOE,
    areaStyle: {
      top: 733,
      left: 84,
      height: 20,
      width: 40,
    },
    dotStyle: {
      top: 4,
      left: 20,
    },
    //areaStyle: { top: 740, left: 108 }
  },
  [LEFT_TOE]: {
    key: LEFT_TOE,
    areaStyle: {
      top: 733,
      left: 165,
      height: 20,
      width: 40,
    },
    dotStyle: {
      top: 4,
      right: 20,
    },
    //areaStyle: { top: 740, left: 168 }
  },
};

// -------- REPEAT INTERVAL,Occurence VITALS

export const REPEAT_INTERVAL_VITALS = {
  1: "Once",
  2: "Every hour",
  3: "Every 2 hour",
  4: "Every 4 hour",
  5: "Every 6 hour",
  6: "Every 12 hour",
};

export const FINAL = "1";
export const PROBABLE = "2";

export const DIAGNOSIS_TYPE = {
  [FINAL]: {
    diagnosis_type: "1",
    value: "Final",
  },
  [PROBABLE]: {
    diagnosis_type: "2",
    value: "Probable",
  },
};

export const CONSULTATION_FEE_TYPE_TEXT = {
  1: "One Time Fee",
  2: "Monthly Subscription",
};

//payment -------->
export const CONSULTATION_FEE = "consultation-fee";
export const BILLING = "billing";
export const PAYMENT_DETAILS = "payment-details";

export const SAVINGS = "savings";
export const CURRENT = "current";

export const ACCOUNT_TYPES = {
  [SAVINGS]: "Savings",
  [CURRENT]: "Current",
};

export const MEDICAL_TEST = "1";
export const CONSULTATION = "2";
export const RADIOLOGY = "3";

export const APPOINTMENT_TYPE_TITLE = {
  [MEDICAL_TEST]: {
    title: "Medical Test",
  },
  [CONSULTATION]: {
    title: "Consultation",
  },
  [RADIOLOGY]: {
    title: "Radiology",
  },
};

export const PATIENT_CONSTANTS = {
  MAX_HEIGHT_ALLOWED: 999,
  MAX_WEIGHT_ALLOWED: 999,
};

export const FEATURES = {
  CHAT: "Chat",
  VIDEO_CALL: "Video Call",
  AUDIO_CALL: "Audio Call",
};

export const TABLE_STATUS = {
  TRANSACTION_TABLE: "transaction_table",
  ADMIN_DOCTOR_TABLE: "admin_doctor_table",
};

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  STARTED: "started",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  ACCEPTED: "accepted",
};

export const ACCOUNT_STATUS = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
};

export const DELETE_TEMPLATE_RELATED_TYPE = {
  MEDICATION: "medication",
  APPOINTMENT: "appointment",
  VITAL: "vital",
  DIET: "diet",
  WORKOUT: "workout",
};

export const FAVOURITE_TYPE = {
  MEDICINE: "medicine",
  MEDICAL_TESTS: "medical_tests",
  RADIOLOGY: "radiology",
};

export const USER_FAV_ALL_TYPES = [
  FAVOURITE_TYPE.MEDICINE,
  FAVOURITE_TYPE.MEDICAL_TESTS,
  FAVOURITE_TYPE.RADIOLOGY,
];

export const WHEN_TO_TAKE_ABBR_TYPES = {
  OD: "1",
  BD: "2",
  TD: "3",
  SOS: "4",
};

export const LOCAL_STORAGE = {
  LOCAL_IS_AUDIO_ON: "localIsAudioOn",
  LOCAL_IS_VIDEO_ON: "localIsVideoOn",
};

export const ASCEND = "ascend";
export const DESCEND = "descend";

export const TYPE_SYMPTOMS = "Symptoms";
export const TYPE_APPOINTMENTS = "Appointments";
export const TYPE_VITALS = "vitals";
export const TYPE_USER_MESSAGE = "UserMessage";
export const TYPE_DIETS = "diets";
export const TYPE_WORKOUTS = "workouts";

export const VIDEO_TYPES = {
  URL: "url",
  UPLOAD: "upload",
  NONE: "none",
};

export const WAKE_UP = "1";
export const BREAKFAST = "2";
export const LUNCH = "3";
export const EVENING = "4";
export const DINNER = "5";
export const SLEEP = "6";
export const MID_MORNING = "7";
export const MEAL_TIMINGS = [
  WAKE_UP,
  BREAKFAST,
  MID_MORNING,
  LUNCH,
  EVENING,
  DINNER,
  SLEEP,
];

export const PATIENT_MEAL_TIMINGS = {
  [WAKE_UP]: {
    time: "2020-09-24T08:00:00+05:30",
    text: "Immediately After Wakeup",
  },
  [BREAKFAST]: {
    time: "2020-09-24T09:00:00+05:30",
    text: "Breakfast",
  },
  [LUNCH]: {
    time: "2020-09-24T13:00:00+05:30",
    text: "Lunch",
  },
  [EVENING]: {
    time: "2020-09-24T16:00:00+05:30",
    text: "Evening",
  },
  [DINNER]: {
    time: "2020-09-24T20:00:00+05:30",
    text: "Dinner",
  },
  [SLEEP]: {
    time: "2020-09-24T23:00:00+05:30",
    text: "Before Sleep",
  },
  [MID_MORNING]: {
    time: "2020-09-24T11:00:00+05:30",
    text: "Mid Morning",
  },
};
