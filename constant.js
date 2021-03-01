export const ACTION_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication",
  EXERCISE: "exercise",
  DIET: "diet",
  MATERIAL_DELIVERY: "material_delivery"
};

export const ACTIVITY_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication",
  SYMPTOM: "symptom"
};

export const EVENT_TYPE = {
  SYMPTOMS: "symptoms",
  VITALS: "vitals",
  APPOINTMENT: "appointment",
  REMINDER: "reminder",
  ADVERSE_EVENT: "adverse",
  ARTICLE: "article",
  MEDICATION_REMINDER: "medication-reminder",
  CARE_PLAN_ACTIVATION: "careplan-activation",
  APPOINTMENT_TIME_ASSIGNMENT: "appointment-time-assignment",
  ALL: "all",
};


export const VITALFIELD = {
  TEMPERATURE_UNIT: "temperatureUnit",
  TEMPERATURE: "temperature",
  RESPIRATION_RATE: "respirationRate",
  PULSE: "pulse",
  BLOOD_PRESSURE: "bloodPressure",
  TEMPERATURE_UNIT_C: "c",
  TEMPERATURE_UNIT_F: "f"
};

export const ACTIVITY_MODE = {
  CALL: "call",
  VISIT: "visit",
  CHAT: "chat"
};

export const REPEAT_TYPE = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly"
};

export const SUN = "Sun";
export const MON = "Mon";
export const TUE = "Tue";
export const WED = "Wed";
export const THU = "Thu";
export const FRI = "Fri";
export const SAT = "Sat";

export const SUNDAY = "Sun";
export const MONDAY = "Mon";
export const TUESDAY = "Tue";
export const WEDNESDAY = "Wed";
export const THURSDAY = "Thu";
export const FRIDAY = "Fri";
export const SATURDAY = "Sat";

export const DAYS = [SUN, MON, TUE, WED, THU, FRI, SAT];
export const DAYS_MOBILE = [
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
];

export const SEVERITY = {
  MILD: "MILD",
  MODERATE: "MODERATE",
  SEVERE: "SEVERE",
  VERY_SEVERE: "VERY_SEVERE",
  FATAL: "FATAL"
};

export const USER_CATEGORY = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  PROVIDER: "provider",
  ADMIN: "admin",
  CARE_TAKER: "care_taker"
};

export const REQUEST_TYPE = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete"
};

export const EVENT_IS = {
  CREATED: "CREATED",
  CANCEL: "CANCEL",
  CANCEL_ALL: "CANCEL_ALL",
  RESCHEDULED: "RESCHEDULED",
  PRIOR: "PRIOR",
  START: "START",
  PASSED: "PASSED",
  COMPLETE: "COMPLETE",
  MARKINCOMPLETE: "MARKINCOMPLETE",
  UPDATED: "UPDATED",
  SHARE: "SHARE",
  DELETE: "DELETE",
  APPROVED: "APPROVED"
};

export const ACTIVITY_LOG_STATUS = {
  PENDING: "pending",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  EXPIRED: "expired"
};

export const DEFAULT = "default";

export const GRANTS = {
  PROGRAM: {
    CREATE: "create_programs",
    UPDATE: "update_programs",
    VIEW: "view_programs",
    INVITE: "invite_programs"
  },
  EVENT: {
    CREATE: "create_events",
    UPDATE: "update_events",
    VIEW: "view_events",
    CANCEL: "cancel_events"
  },
  PASSWORD: {
    UPDATE: "update_passwords"
    //VIEW: "view_password",
  },
  USERS: {
    VIEW_PATIENT: "view_patients",
    UPDATE_PATIENT: "update_patients",
    VIEW_DOCTOR: "view_doctors",
    UPDATE_DOCTOR: "update_doctors",
    UPDATE_CARE_COACH: "update_careCoaches",
    VERIFY_PATIENT: "verify_patients",
    DISCHARGE_PATIENT: "discharge_patients"
  },
  MEDICATION: {
    CREATE: "create_medications",
    UPDATE: "update_medications",
    VIEW: "view_medications"
  },
  ADVERSE_EVENT: {
    CREATE: "create_adverseEvents",
    VIEW: "view_adverseEvents"
  },
  PRODUCT: {
    CREATE: "create_products",
    UPDATE: "update_products",
    VIEW: "view_products"
  },
  INSURANCE_PROVIDER: {
    VIEW: "view_insuranceProviders",
    UPDATE: "update_insuranceProviders"
  },
  HOSPITAL: {
    VIEW: "view_hospitals",
    UPDATE: "update_hospitals"
  },
  TWILIO: {
    CREATE: "create_twilios", //Create API gives us token no need for View Permission
    UPDATE: "update_twilios"
  },
  SURVEY: {
    CREATE: "create_surveys",
    UPDATE: "update_surveys",
    VIEW: "view_surveys",
    END: "end_surveys"
  },
  OTP: {
    SEND: "send_otps",
    VERIFY: "verify_otps"
  }
};

export const NOTIFICATION_VERB = {
  APPOINTMENT: "appointment",
  APPOINTMENT_CREATE: "APPOINTMENT_CREATE",
  APPOINTMENT_UPDATE: "APPOINTMENT_UPDATE",
  APPOINTMENT_EDIT_NOTES: "APPOINTMENT_EDIT_NOTES",
  APPOINTMENT_START: "APPOINTMENT_START",
  APPOINTMENT_PRIOR: "APPOINTMENT_PRIOR",
  APPOINTMENT_DELETE: "APPOINTMENT_DELETE",
  APPOINTMENT_DELETE_ALL: "APPOINTMENT_DELETE_ALL",
  REMINDER: "reminder",
  REMINDER_CREATE: "REMINDER_CREATE",
  REMINDER_UPDATE: "REMINDER_UPDATE",
  REMINDER_START: "REMINDER_START",
  REMINDER_DELETE: "REMINDER_DELETE",
  REMINDER_DELETE_ALL: "REMINDER_DELETE_ALL",
  REMINDER_EDIT_NOTES: "REMINDER_EDIT_NOTES",
  MEDICATION_REMINDER: "medication-reminder",
  MEDICATION_REMINDER_CREATE: "MEDICATION_REMINDER_CREATE",
  MEDICATION_REMINDER_UPDATE: "MEDICATION_REMINDER_UPDATE",
  MEDICATION_REMINDER_START: "MEDICATION_REMINDER_START",
  MEDICATION_REMINDER_DELETE: "MEDICATION_REMINDER_DELETE",
  MEDICATION_REMINDER_DELETE_ALL: "MEDICATION_REMINDER_DELETE_ALL",
  MEDICATION_REMINDER_EDIT_NOTES: "MEDICATION_REMINDER_EDIT_NOTES",
  SURVEY: "survey",
  SURVEY_CREATE: "SURVEY_CREATE",
  SURVEY_UPDATE: "survey update",
  ADVERSE_EVENT: "adverse",
  ADVERSE_EVENT_CREATE: "ADVERSE_EVENT_CREATE",
  VITALS: "vitals",
  VITALS_UPDATE: "VITALS_UPDATE",
  BASIC: "basic",
  BASIC_UPDATE: "BASIC_UPDATE",
  CLINICAL_READING: "clinical_reading",
  CLINICAL_READING_UPDATE: "CLINICAL_READING_UPDATE",
  CLINICAL_READING_DELETE: "CLINICAL_READING_DELETE",
  CLINICAL_READING_CREATE: "CLINICAL_READING_CREATE",
  MEDICATION: "medication",
  MEDICATION_UPDATE: "MEDICATION_UPDATE",
  MEDICATION_CREATE: "MEDICATION_CREATE",
  MEDICATION_DELETE: "MEDICATION_DELETE",
  ARTICLE: "article",
  ARTICLE_SHARE: "ARTICLE_SHARE",
  ARTICLE_UPDATE: "article update",
  PRESCRIPTION: "prescription",
  PRESCRIPTION_CREATE: "prescription create",
  PRESCRIPTION_UPDATE: "prescription update",
  PROGRAM: "program",
  PROGRAM_CREATE: "program create",
  PROGRAM_UPDATE: "program update",
  HOSPITALISATION: "hospitalisation",
  HOSPITALISATION_CREATE: "HOSPITALISATION_CREATE",
  BENEFIT_DOCS_VERIFIED: "BENEFIT_DOCS_VERIFIED",
  CHARITY_APPROVAL: "CHARITY_APPROVAL",
  MRL_GENERATION: "MRL_GENERATION",
  VITAL_CREATE: "VITAL_CREATE",
  VITAL_START: "VITAL_START",
  CARE_PLAN_CREATE: "CAREPLAN_CREATE",
  DEACTIVATE_DOCTOR: "DEACTIVATE_DOCTOR",
  ACTIVATE_DOCTOR:"ACTIVATE_DOCTOR"
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
  APPROVED: "Approve"
};

export const NOTIFICATION_URLS = {
  EVENTS: "/event",
  BASIC: "/basic",
  VITAL: "/vital",
  CLINICAL_READING: "/clinical-reading",
  MEDICATION: "/medication",
  ADVERSE_EVENT: "/adverse-event",
  HOSPITALIZATION: "/hospitalization",
  SURVEY: "/survey",
  ARTICLE: "/article",
  SIGN_UP: "sign-up",
  FORGOT_PASSWORD: "forgot-password"
};

export const OPTION_TYPE = {
  TEXT: "TEXT",
  STAR: "STAR",
  RADIO: "RADIO",
  CHECKBOX: "CHECKBOX"
};

export const FIELD_TYPE = {
  INPUT: "input",
  RADIO: "radio",
  DATE: "date"
};

export const DB_TABLES = {
  USERS: "users",
  DOCTORS: "doctors",
  PATIENTS: "patients",
  APPOINTMENTS: "appointments",
  SCHEDULE_EVENTS: "schedule_events",
  PATIENT_CARE_TAKERS: "patient_care_takers",
  CARE_PLAN_TEMPLATE: "care_plan_templates",
  CONSENTS: "consents",
  CONDITIONS: "conditions",
  REGIONS: "regions",
  PROVIDERS: "providers",
  REGION_FEATURES: "region_features",
  FEATURES: "features",
  MEDICINES: "medicines",
  MEDICATION_REMINDERS: "medication_reminders",
  ARTICLES: "articles",
  CARE_PLANS: "care_plans",
  CLINICS: "clinics",
  REGION_PROVIDERS: "region_providers",
  PROVIDER_MEMBERS: "provider_members",
  REMINDERS: "reminders",
  MEMBER_SPECIALITIES: "member_specialities",
  SPECIALITIES: "specialities",
  PLATFORM_EVENTS: "platform_events",
  PRODUCT_PLANS: "product_plans",
  SUBSCRIPTIONS: "subscriptions",
  ACTIONS: "actions",
  ACTION_DETAILS: "action_details",
  EXERCISE: "exercise",
  DIET: "diet",
  ADHERENCE: "adherence",
  DISEASE: "disease",
  USER_VERIFICATIONS: "user_verifications",
  EMAIL_LOGGER: "email_loggers",
  DOCTOR_QUALIFICATIONS: "doctor_qualifications",
  DOCTOR_CLINICS: "doctor_clinics",
  UPLOAD_DOCUMENTS: "upload_documents",
  TEMPLATE_MEDICATIONS: "template_medications",
  TEMPLATE_APPOINTMENTS: "template_appointments",
  CARE_PLAN_MEDICATIONS: "care_plan_medications",
  CARE_PLAN_APPOINTMENTS: "care_plan_appointments",
  DOCTOR_REGISTRATIONS: "doctor_registrations",
  TREATMENTS: "treatments",
  SEVERITY: "severity",
  USER_PREFERENCES: "user_preferences",
  PERMISSIONS: "permissions",
  USER_CATEGORY_PERMISSIONS: "user_category_permissions",
  COLLEGE: "colleges",
  COURSE: "courses",
  DEGREE: "degrees",
  QUALIFICATION: "qualifications",
  REGISTRATION_COUNCIL: "registration_councils",
  OTP_VERIFICATIONS: "otp_verifications",
  TREATMENT_CONDITION_MAPPING: "",
  FEATURE_DETAILS: "feature_details",
  USER_DEVICES: "user_devices",
  SYMPTOMS: "symptoms",
  VITAL_TEMPLATES: "vital_templates",
  VITALS: "vitals"
};

export const ARTICLE_TYPE = {
  VIDEO: "video",
  IMAGE: "image",
  PDF: "pdf"
};

export const CURRENCY = {
  INR: "INR",
  AUD: "AUD",
  USD: "USD"
};

export const DOCUMENT_PARENT_TYPE = {
  DOCTOR_QUALIFICATION: "doctor_qualification",
  DOCTOR_REGISTRATION: "doctor_registration",
  SYMPTOM_AUDIO: "symptom_audio",
  SYMPTOM_PHOTO: "symptom_photo",
  SYMPTOM_VIDEO: "symptom_video",
  APPOINTMENT_DOC: "appointment_doc",
  REPORT: "report"
};

export const ONBOARDING_STATUS = {
  PROFILE_REGISTERED: "profile_registered",
  QUALIFICATION_REGISTERED: "qualification_registered",
  CLINIC_REGISTERED: "CLINIC_registered",
  PATIENT: {
    PASSWORD_UPDATE: "password_update",
    PROFILE_REGISTERED: "profile_registration"
  }
};

export const SIGN_IN_CATEGORY = {
  BASIC: "basic",
  GOOGLE: "google",
  FACEBOOK: "facebook"
};

export const GENDER = {
  MALE: "m",
  FEMALE: "f",
  OTHER: "o"
};

export const EVENT_STATUS = {
  SCHEDULED: "scheduled",
  PENDING: "pending",
  COMPLETED: "completed",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  STARTED: "started"
};

export const EMAIL_TEMPLATE_NAME = {
  WELCOME: "welcome",
  FORGOT_PASSWORD: "forgotPassword",
  INVITATION: "invitation",
  VERIFIED_DOCTOR: "verifiedDoctor",
  OTP_VERIFICATION: "otpVerification"
};

export const OBJECT_NAME = {
  USER: "user",
  APPOINTMENT: "appointments",
  MEDICATION: "medications",
  MEDICINE: "medicines"
};

export const EVERYDAY = "1";
export const ALTERNATE_START_TODAY = "2";
export const ALTERNATE_START_TOMORROW = "3";

export const CUSTOM_REPEAT_OPTIONS = {
  [EVERYDAY]: {
    key: "everyday",
    text: "Everyday"
  },
  [ALTERNATE_START_TODAY]: {
    key: "alternate_today",
    text: "Alternate start today"
  },
  [ALTERNATE_START_TOMORROW]: {
    key: "alternate_tomorrow",
    text: "Alternate start tomorrow"
  }
};

export const DOSE_AMOUNT = ["2", "8", "100", "200", "500"];

export const MG = "1";
export const ML = "2";

export const DOSE_UNIT = {
  [MG]: {
    text: "mg"
  },
  [ML]: {
    text: "ml"
  }
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

export const MEDICATION_TIMING = {
  [AFTER_WAKEUP]: {
    [TEXT_KEY]: "After Wake Up",
    [TIME_KEY]: "2020-09-24T02:30:00.000Z"
  },
  [BEFORE_BREAKFAST]: {
    [TEXT_KEY]: "Before Breakfast",
    [TIME_KEY]:"2020-09-24T03:00:00.000Z"
  },
  [AFTER_BREAKFAST]: {
    [TEXT_KEY]: "After Breakfast",
    [TIME_KEY]: "2020-09-24T04:00:00.000Z"
  },
  [BEFORE_LUNCH]: {
    [TEXT_KEY]: "Before Lunch",
    [TIME_KEY]: "2020-09-24T07:00:00.000Z"
  },
  [WITH_LUNCH]: {
    [TEXT_KEY]: "With Lunch",
    [TIME_KEY]: "2020-09-24T07:30:00.000Z"
  },
  [AFTER_LUNCH]: {
    [TEXT_KEY]: "After Lunch",
    [TIME_KEY]: "2020-09-24T08:00:00.000Z"
  },
  [BEFORE_EVENING_SNACK]: {
    [TEXT_KEY]: "Before Evening Snacks",
    [TIME_KEY]: "2020-09-24T10:00:00.000Z"
  },
  [AFTER_EVENING_SNACK]: {
    [TEXT_KEY]: "After Evening Snacks",
    [TIME_KEY]: "2020-09-24T11:00:00.000Z"
  },
  [BEFORE_DINNER]: {
    [TEXT_KEY]: "Before Dinner",
    [TIME_KEY]: "2020-09-24T14:00:00.000Z"
  },
  [WITH_DINNER]: {
    [TEXT_KEY]: "With Dinner",
    [TIME_KEY]: "2020-09-24T14:30:00.000Z"
  },
  [AFTER_DINNER]: {
    [TEXT_KEY]: "After Dinner",
    [TIME_KEY]: "2020-09-24T15:00:00.000Z"
  },
  [BEFORE_SLEEP]: {
    [TEXT_KEY]: "Before Sleeping",
    [TIME_KEY]: "2020-09-24T17:30:00.000Z"
  }
};

export const MEDICINE_TYPE = {
  TABLET: "tablet",
  INJECTION: "injection",
  SYRUP: "syrup"
};

export const VERIFICATION_TYPE = {
  FORGOT_PASSWORD: "forgot_password",
  SIGN_UP: "sign_up",
  PATIENT_SIGN_UP: "patient_sign_up"
};

// export const NO_ADHERENCE = "1";
export const NO_MEDICATION = "1";
export const NO_APPOINTMENT = "2";
export const NO_ACTION = "3";
// export const TEST_ONE = "5";
// export const TEST_TWO = "6";

export const CHART_LIMIT = 4;

export const CHART_DETAILS = {
  // [NO_ADHERENCE]: {
  //   type: "no_adherence",
  //   name: "Missed Adherence",
  //   critical: 19,
  //   total: 100
  // },
  [NO_MEDICATION]: {
    type: "no_medication",
    name: "Missed Medication",
    critical: 25,
    total: 80
  },
  [NO_APPOINTMENT]: {
    type: "no_appointment",
    name: "Missed Appointment",
    critical: 5,
    total: 40
  },
  [NO_ACTION]: {
    type: "no_action",
    name: "Missed Action",
    critical: 30,
    total: 120
  }
  // [TEST_ONE]: {
  //   type: "test_one",
  //   name: "Test One",
  //   critical: 10,
  //   total: 50
  // },
  // [TEST_TWO]: {
  //   type: "test_two",
  //   name: "Test Two",
  //   critical: 10,
  //   total: 60
  // }
};

export const PERMISSIONS = {
  ADD_PATIENT: "ADD_PATIENT",

  ADD_APPOINTMENT: "ADD_APPOINTMENT",
  EDIT_APPOINTMENT: "EDIT_APPOINTMENT",

  ADD_MEDICATION: "ADD_MEDICATION",
  EDIT_MEDICATION: "EDIT_MEDICATION",

  ADD_CARE_PLAN_TEMPLATE: "ADD_CARE_PLAN_TEMPLATE"
};

export const USER_REFERENCE_ID_SIZE = 4;

const DAY = "1";
const MONTH = "2";
const YEAR = "3";

export const AGE_TYPE = {
  [DAY]: "d",
  [MONTH]: "m",
  [YEAR]: "y"
};

/*------------------------------- APPOINTMENT DETAILS ---------------------------------*/

const MEDICAL_TEST = "1";
const CONSULTATION = "2";
const RADIOLOGY = "3";

export const APPOINTMENT_TYPE = {
  [MEDICAL_TEST]: {
    title: "Medical Test"
  },
  [CONSULTATION]: {
    title: "Consultation"
  },
  [RADIOLOGY]: {
    title: "Radiology"
  }
};

export const APPOINTMENT_TYPE_DESCRIPTION = {
  [MEDICAL_TEST]: {
    options: [{}]
  },
  [CONSULTATION]: {
    title: "Consultation"
  },
  [RADIOLOGY]: {
    title: "Radiology"
  }
};

export const FEATURE_TYPE = {
  APPOINTMENT: "appointment",
  MEDICATION: "medication",
  VITAL: "vital",
  TERMS_OF_SERVICE: "terms_of_service",
  PRIVACY_POLICY: "privacy_policy"
};

export const BLANK_STATE = "";

export const PASSWORD_LENGTH = 8;

export const ALLOWED_DOC_TYPE_DOCTORS = ["jpeg", "svg", "png", "pdf"];

const TABLET = "1";
const SYRUP = "2";
const INJECTION = "3";

export const MEDICINE_FORM_TYPE = {
  [TABLET]: { name: "tablet" },
  [SYRUP]: { name: "syrup" },
  [INJECTION]: { name: "injection" }
};

// MEDICINE FORMULATION ----------------------------------------------

export const CATEGORY_ONE = {
  index: "1",
  name:"",
  items: [
    {name: "CAPSULE", defaultUnit: MG, id: 1},
    {name: "SUSPENSION", defaultUnit: MG, id: 2},
    {name: "GELS", defaultUnit: ML, id: 3},
    {name:"LOTIONS", defaultUnit: ML, id: 4},
    {name:"LINIMENTS", defaultUnit: ML, id: 5},
    {name: "LOZENGES", defaultUnit: MG, id: 6}
  ]
};

export const CATEGORY_TWO = {
  index: "2",
  name:"",
  items: [
    {name:"SPRAY", defaultUnit: ML, id: 7},
    {name:"NEBULISER", defaultUnit: MG, id: 8},
    {name:"CREAM", defaultUnit: ML, id: 9},
    {name:"OINTMENT", defaultUnit: ML, id: 10},
  ],
};


export const CATEGORY_THREE = {
  index: "3",
  name:"",
  items: [
    {name:"RECTAL SUPPOSITORY", defaultUnit: MG, id: 11},
    {name:"RECTAL ENEMA", defaultUnit: MG, id: 12},
    {name:"PESSARIES OF VAGINAL", defaultUnit: MG, id: 13},
  ],
};

export const CATEGORY_FOUR = {
  index: "4",
  name:"",
  items: [
    {name:"INHALER", defaultUnit: ML, id: 14},
  ],
};

export const CATEGORY_FIVE = {
  index: "5",
  name:"INJECTION",
  items: [
    {name:"I/D INTRDERMAL", defaultUnit: ML, id: 15},
    {name:"S/C SUBCUTANEOUS", defaultUnit: ML, id: 16},
    {name:"I/M INTRAMUSCULAR", defaultUnit: ML, id: 17},
    {name:"I/V INTRAVENOUS", defaultUnit: ML, id: 18},
  ],
};

export const MEDICINE_FORMULATION = {
  [CATEGORY_ONE.index]: {
    ...CATEGORY_ONE
  },
  [CATEGORY_TWO.index]: {
    ...CATEGORY_TWO
  },
  [CATEGORY_THREE.index]: {
    ...CATEGORY_THREE
  },
  [CATEGORY_FOUR.index]: {
    ...CATEGORY_FOUR
  },
  [CATEGORY_FIVE.index]: {
    ...CATEGORY_FIVE
  },
};

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
  [RIGHT_CALF]: { name: "Right Calf" }
};

export const BODY_VIEW = {
  FRONT: "1",
  BACK: "2"
};

export const REPEAT_INTERVAL = {
  ONCE: "ONCE",
  ONE_HOUR: "ONE_HOUR",
  TWO_HOUR: "TWO_HOUR",
  FOUR_HOUR: "FOUR_HOUR",
  SIX_HOUR: "SIX_HOUR",
  TWELVE_HOUR: "TWELVE_HOUR"
};

export const MP4 = "mp4";
export const ALLOWED_VIDEO_EXTENSIONS = [MP4];

export const WAKE_UP = "1";
export const BREAKFAST = "2";
export const LUNCH = "3";
export const EVENING = "4";
export const DINNER = "5";
export const SLEEP = "6";

export const PATIENT_MEAL_TIMINGS = {
  [WAKE_UP]: {
    value: "2020-09-24T08:00:00+05:30"
  },
  [BREAKFAST]: {
    value: "2020-09-24T09:00:00+05:30"
  },
  [LUNCH]: {
    value: "2020-09-24T13:00:00+05:30"
  },
  [EVENING]: {
    value: "2020-09-24T16:00:00+05:30"
  },
  [DINNER]: {
    value: "2020-09-24T20:00:00+05:30"
  },
  [SLEEP]: {
    value: "2020-09-24T23:00:00+05:30"
  }
};

export const OFFLINE_SYNC_DATA_TASKS = {
  SYNC_EVENTS_DATA: "event_sync_data"
};

export const CONSENT_TYPE = {
  CARE_PLAN: "CARE_PLAN"
};

export const S3_DOWNLOAD_FOLDER = "s3Downloads";
export const PRESCRIPTION_PDF_FOLDER = "prescriptionPdfs";

export const FEATURES = {
  CHAT: "Chat",
  VIDEO_CALL: "Video Call",
  AUDIO_CALL: "Audio Call"
};

export const EVENT_LONG_TERM_VALUE = null;

export const TEMPLATE_DUPLICATE_TEXT = " Copy";
export const MESSAGE_TYPES = {
  USER_MESSAGE:"USER_MESSAGE",
  BOT_MESSAGE:"BOT_MESSAGE"
};


export const USER_FAV_USER_CATEGORY=[
  USER_CATEGORY.PATIENT, 
  USER_CATEGORY.DOCTOR, 
  USER_CATEGORY.ADMIN,
  USER_CATEGORY.CARE_TAKER, 
  USER_CATEGORY.PROVIDER
]


export const FAVOURITE_TYPE = {
  MEDICINE: "medicine",
};

export const USER_FAV_ALL_TYPES=[
  FAVOURITE_TYPE.MEDICINE
]