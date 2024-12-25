export const ACTION_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication",
  WORKOUT: "workout",
  DIET: "diet",
  MATERIAL_DELIVERY: "material_delivery",
};

export const ACTIVITY_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication",
  SYMPTOM: "symptom",
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
  DIET: "diet",
  WORKOUT: "workout",
  ALL: "all",
};

export const VITALFIELD = {
  TEMPERATURE_UNIT: "temperatureUnit",
  TEMPERATURE: "temperature",
  RESPIRATION_RATE: "respirationRate",
  PULSE: "pulse",
  BLOOD_PRESSURE: "bloodPressure",
  TEMPERATURE_UNIT_C: "c",
  TEMPERATURE_UNIT_F: "f",
};

export const ACTIVITY_MODE = {
  CALL: "call",
  VISIT: "visit",
  CHAT: "chat",
};

export const REPEAT_TYPE = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
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
  SATURDAY,
];

export const DAYS_INTEGER = {
  [SUNDAY]: 0,
  [MONDAY]: 1,
  [TUESDAY]: 2,
  [WEDNESDAY]: 3,
  [THURSDAY]: 4,
  [FRIDAY]: 5,
  [SATURDAY]: 6,
};

export const SEVERITY = {
  MILD: "MILD",
  MODERATE: "MODERATE",
  SEVERE: "SEVERE",
  VERY_SEVERE: "VERY_SEVERE",
  FATAL: "FATAL",
};

export const USER_CATEGORY = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  PROVIDER: "provider",
  ADMIN: "admin",
  CARE_TAKER: "care_taker",
  HSP: "hsp",
};

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const PATIENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  COMPLETED: "completed",
  INPROGRESS: "inprogress",
};

export const BILLING_FREQUENCY = {
  MONTHLY: "monthly",
  ONCES: "onces",
};

export const REQUEST_TYPE = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete",
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
  APPROVED: "APPROVED",
};

export const ACTIVITY_LOG_STATUS = {
  PENDING: "pending",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  EXPIRED: "expired",
};

export const DEFAULT = "default";

export const GRANTS = {
  PROGRAM: {
    CREATE: "create_programs",
    UPDATE: "update_programs",
    VIEW: "view_programs",
    INVITE: "invite_programs",
  },
  EVENT: {
    CREATE: "create_events",
    UPDATE: "update_events",
    VIEW: "view_events",
    CANCEL: "cancel_events",
  },
  PASSWORD: {
    UPDATE: "update_passwords",
    //VIEW: "view_password",
  },
  USERS: {
    VIEW_PATIENT: "view_patients",
    UPDATE_PATIENT: "update_patients",
    VIEW_DOCTOR: "view_doctors",
    UPDATE_DOCTOR: "update_doctors",
    UPDATE_CARE_COACH: "update_careCoaches",
    VERIFY_PATIENT: "verify_patients",
    DISCHARGE_PATIENT: "discharge_patients",
  },
  MEDICATION: {
    CREATE: "create_medications",
    UPDATE: "update_medications",
    VIEW: "view_medications",
  },
  ADVERSE_EVENT: {
    CREATE: "create_adverseEvents",
    VIEW: "view_adverseEvents",
  },
  PRODUCT: {
    CREATE: "create_products",
    UPDATE: "update_products",
    VIEW: "view_products",
  },
  INSURANCE_PROVIDER: {
    VIEW: "view_insuranceProviders",
    UPDATE: "update_insuranceProviders",
  },
  HOSPITAL: {
    VIEW: "view_hospitals",
    UPDATE: "update_hospitals",
  },
  TWILIO: {
    CREATE: "create_twilios", //Create API gives us token no need for View Permission
    UPDATE: "update_twilios",
  },
  SURVEY: {
    CREATE: "create_surveys",
    UPDATE: "update_surveys",
    VIEW: "view_surveys",
    END: "end_surveys",
  },
  OTP: {
    SEND: "send_otps",
    VERIFY: "verify_otps",
  },
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
  VITAL_RESPONSE: "vital_response",
  CARE_PLAN_CREATE: "CAREPLAN_CREATE",
  DEACTIVATE_DOCTOR: "DEACTIVATE_DOCTOR",
  ACTIVATE_DOCTOR: "ACTIVATE_DOCTOR",
  DIET_CREATION: "diet_create",
  DIET_START: "diet_start",
  DIET_PRIOR: "diet_prior",
  DIET_RESPONSE: "diet_response",
  WORKOUT_CREATION: "workout_create",
  WORKOUT_START: "workout_start",
  WORKOUT_PRIOR: "workout_prior",
  WORKOUT_RESPONSE: "workout_response",
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
  FORGOT_PASSWORD: "forgot-password",
};

export const OPTION_TYPE = {
  TEXT: "TEXT",
  STAR: "STAR",
  RADIO: "RADIO",
  CHECKBOX: "CHECKBOX",
};

export const FIELD_TYPE = {
  INPUT: "input",
  RADIO: "radio",
  DATE: "date",
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
  VITALS: "vitals",
  FOOD_ITEMS: "food_items",
  PORTIONS: "portions",
  FOOD_GROUPS: "food_groups",
  DIET_FOOD_GROUP_MAPPINGS: "diet_food_group_mappings",
  SERVICE_OFFERING: "service_offerings",
  SERVICE_SUBSCRIPTION: "service_subscriptions",
  SERVICE_SUBSCRIPTION_MAPPING: "service_subscribe_plan_mappings",
  SERVICE_USER_MAPPING: "service_user_mappings",
  SERVICE_SUBSCRIPTION_USER_MAPPING: "service_subscription_user_mappings",
  SERVICE_SUBSCRIPTION_TRANSACTIONS: "service_subscription_transactions",
  HIS_PROVIDER_TABLE: "his_provider_tables",
};

export const ARTICLE_TYPE = {
  VIDEO: "video",
  IMAGE: "image",
  PDF: "pdf",
};

export const CURRENCY = {
  INR: "INR",
  AUD: "AUD",
  USD: "USD",
};

export const DOCUMENT_PARENT_TYPE = {
  DOCTOR_QUALIFICATION: "doctor_qualification",
  DOCTOR_REGISTRATION: "doctor_registration",
  SYMPTOM_AUDIO: "symptom_audio",
  SYMPTOM_PHOTO: "symptom_photo",
  SYMPTOM_VIDEO: "symptom_video",
  APPOINTMENT_DOC: "appointment_doc",
  REPORT: "report",
  PRESCRIPTION_PDF: "prescription_pdf",
  DIET_RESPONSE: "diet_response",
  EXERCISE_CONTENT: "exercise_content",
};

export const ONBOARDING_STATUS = {
  PROFILE_REGISTERED: "profile_registered",
  QUALIFICATION_REGISTERED: "qualification_registered",
  CLINIC_REGISTERED: "CLINIC_registered",
  PATIENT: {
    PASSWORD_UPDATE: "password_update",
    PROFILE_REGISTERED: "profile_registration",
  },
};

export const SIGN_IN_CATEGORY = {
  BASIC: "basic",
  GOOGLE: "google",
  FACEBOOK: "facebook",
};

export const GENDER = {
  MALE: "m",
  FEMALE: "f",
  OTHER: "o",
};

export const EVENT_STATUS = {
  SCHEDULED: "scheduled",
  PENDING: "pending",
  COMPLETED: "completed",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  STARTED: "started",
  PRIOR: "prior",
};

export const EMAIL_TEMPLATE_NAME = {
  WELCOME: "welcome",
  FORGOT_PASSWORD: "forgotPassword",
  INVITATION: "invitation",
  VERIFIED_DOCTOR: "verifiedDoctor",
  OTP_VERIFICATION: "otpVerification",
  SERVER_CRASH: "serverCrash",
};

export const OBJECT_NAME = {
  USER: "user",
  APPOINTMENT: "appointments",
  MEDICATION: "medications",
  MEDICINE: "medicines",
};

export const EVERYDAY = "1";
export const ALTERNATE_START_TODAY = "2";
export const ALTERNATE_START_TOMORROW = "3";

export const CUSTOM_REPEAT_OPTIONS = {
  [EVERYDAY]: {
    key: "everyday",
    text: "Everyday",
  },
  [ALTERNATE_START_TODAY]: {
    key: "alternate_today",
    text: "Alternate start today",
  },
  [ALTERNATE_START_TOMORROW]: {
    key: "alternate_tomorrow",
    text: "Alternate start tomorrow",
  },
};

export const DOSE_AMOUNT = ["2", "8", "100", "200", "500"];

export const MG = "1";
export const ML = "2";

export const DOSE_UNIT = {
  [MG]: {
    text: "mg",
  },
  [ML]: {
    text: "ml",
  },
};

export const TEXT_KEY = "text";
export const TIME_KEY = "time";

export const WITH_BREAKFAST = "0";
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

export const DIET_TIMINGS = {};

export const MEDICATION_TIMING = {
  [WITH_BREAKFAST]: {
    [TEXT_KEY]: "With Breakfast",
    [TIME_KEY]: "2020-09-24T03:30:00.000Z",
  },
  [AFTER_WAKEUP]: {
    [TEXT_KEY]: "After Wake Up",
    [TIME_KEY]: "2020-09-24T02:30:00.000Z",
  },
  [BEFORE_BREAKFAST]: {
    [TEXT_KEY]: "Before Breakfast",
    [TIME_KEY]: "2020-09-24T03:00:00.000Z",
  },
  [AFTER_BREAKFAST]: {
    [TEXT_KEY]: "After Breakfast",
    [TIME_KEY]: "2020-09-24T04:00:00.000Z",
  },
  [BEFORE_LUNCH]: {
    [TEXT_KEY]: "Before Lunch",
    [TIME_KEY]: "2020-09-24T07:00:00.000Z",
  },
  [WITH_LUNCH]: {
    [TEXT_KEY]: "With Lunch",
    [TIME_KEY]: "2020-09-24T07:30:00.000Z",
  },
  [AFTER_LUNCH]: {
    [TEXT_KEY]: "After Lunch",
    [TIME_KEY]: "2020-09-24T08:00:00.000Z",
  },
  [BEFORE_EVENING_SNACK]: {
    [TEXT_KEY]: "Before Evening Snacks",
    [TIME_KEY]: "2020-09-24T10:00:00.000Z",
  },
  [AFTER_EVENING_SNACK]: {
    [TEXT_KEY]: "After Evening Snacks",
    [TIME_KEY]: "2020-09-24T11:00:00.000Z",
  },
  [BEFORE_DINNER]: {
    [TEXT_KEY]: "Before Dinner",
    [TIME_KEY]: "2020-09-24T14:00:00.000Z",
  },
  [WITH_DINNER]: {
    [TEXT_KEY]: "With Dinner",
    [TIME_KEY]: "2020-09-24T14:30:00.000Z",
  },
  [AFTER_DINNER]: {
    [TEXT_KEY]: "After Dinner",
    [TIME_KEY]: "2020-09-24T15:00:00.000Z",
  },
  [BEFORE_SLEEP]: {
    [TEXT_KEY]: "Before Sleeping",
    [TIME_KEY]: "2020-09-24T17:30:00.000Z",
  },
};

export const MEDICINE_TYPE = {
  TABLET: "tablet",
  INJECTION: "injection",
  SYRUP: "syrup",
};

export const VERIFICATION_TYPE = {
  FORGOT_PASSWORD: "forgot_password",
  SIGN_UP: "sign_up",
  PATIENT_SIGN_UP: "patient_sign_up",
};

// export const NO_ADHERENCE = "1";
export const NO_MEDICATION = "1";
export const NO_APPOINTMENT = "2";
export const NO_ACTION = "3";
export const NO_DIET = "4";
export const NO_WORKOUT = "5";

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
  },
  [NO_APPOINTMENT]: {
    type: "no_appointment",
    name: "Missed Appointment",
  },
  [NO_ACTION]: {
    type: "no_action",
    name: "Missed Action",
  },
  [NO_DIET]: {
    type: "no_diet",
    name: "Missed Diet",
  },
  [NO_WORKOUT]: {
    type: "no_workout",
    name: "Missed Workout",
  },
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

  ADD_CARE_PLAN_TEMPLATE: "ADD_CARE_PLAN_TEMPLATE",
};

export const USER_REFERENCE_ID_SIZE = 4;

const DAY = "1";
const MONTH = "2";
const YEAR = "3";

export const AGE_TYPE = {
  [DAY]: "d",
  [MONTH]: "m",
  [YEAR]: "y",
};

/*------------------------------- APPOINTMENT DETAILS ---------------------------------*/

export const MEDICAL_TEST = "1";
export const CONSULTATION = "2";
export const RADIOLOGY = "3";

export const APPOINTMENT_TYPE = {
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

export const APPOINTMENT_TYPE_DESCRIPTION = {
  [MEDICAL_TEST]: {
    options: [{}],
  },
  [CONSULTATION]: {
    title: "Consultation",
  },
  [RADIOLOGY]: {
    title: "Radiology",
  },
};

export const FEATURE_TYPE = {
  APPOINTMENT: "appointment",
  PREV_VERSION_APPOINTMENT: "prev_version_appointment",
  MEDICATION: "medication",
  VITAL: "vital",
  TERMS_OF_SERVICE: "terms_of_service",
  PRIVACY_POLICY: "privacy_policy",
  TERMS_OF_PAYMENT: "terms_of_payment",
};

export const TERMS_AND_CONDITIONS_TYPES = {
  TERMS_OF_PAYMENT: "terms_of_payment",
  DEFAULT_TERMS_OF_PAYMENT: "default_terms_of_payment",
};

export const BLANK_STATE = "";

export const PASSWORD_LENGTH = 8;

export const ALLOWED_DOC_TYPE_DOCTORS = [
  "jpeg",
  "svg",
  "png",
  "pdf",
  "application",
  "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const TABLET = "1";
const SYRUP = "2";
const INJECTION = "3";

export const MEDICINE_FORM_TYPE = {
  [TABLET]: { name: "tablet" },
  [SYRUP]: { name: "syrup" },
  [INJECTION]: { name: "injection" },
};

// MEDICINE FORMULATION ----------------------------------------------

export const categories = {
  index: "1",
  name: "",
  items: [
    { name: "TABLET", defaultUnit: MG, id: 1 },
    { name: "SYRUP", defaultUnit: ML, id: 2 },
    { name: "CAPSULE", defaultUnit: MG, id: 3 },
    { name: "SUSPENSION", defaultUnit: MG, id: 4 },
    { name: "GELS", defaultUnit: ML, id: 5 },
    { name: "LOTIONS", defaultUnit: ML, id: 6 },
    { name: "LINIMENTS", defaultUnit: ML, id: 7 },
    { name: "LOZENGES", defaultUnit: MG, id: 8 },
    //new changes
    { name: "SPRAY", defaultUnit: ML, id: 9 },
    { name: "NEBULISER", defaultUnit: MG, id: 10 },
    { name: "CREAM", defaultUnit: ML, id: 11 },
    { name: "OINTMENT", defaultUnit: ML, id: 12 },
    { name: "RECTAL SUPPOSITORY", defaultUnit: MG, id: 13 },
    { name: "RECTAL ENEMA", defaultUnit: MG, id: 14 },
    { name: "PESSARIES OF VAGINAL", defaultUnit: MG, id: 15 },
    { name: "INHALER", defaultUnit: ML, id: 16 },
    { name: "I/D INTRDERMAL", defaultUnit: ML, id: 17 },
    { name: "S/C SUBCUTANEOUS", defaultUnit: ML, id: 18 },
    { name: "I/M INTRAMUSCULAR", defaultUnit: ML, id: 19 },
    { name: "I/V INTRAVENOUS", defaultUnit: ML, id: 20 },
    { name: "OTHER", defaultUnit: null, id: 21 },
  ],
};

export const CATEGORY_ONE = {
  index: "1",
  name: "",
  items: [
    { name: "TABLET", defaultUnit: MG, id: 1 },
    { name: "SYRUP", defaultUnit: ML, id: 2 },
    { name: "CAPSULE", defaultUnit: MG, id: 3 },
    { name: "SUSPENSION", defaultUnit: MG, id: 4 },
    { name: "GELS", defaultUnit: ML, id: 5 },
    { name: "LOTIONS", defaultUnit: ML, id: 6 },
    { name: "LINIMENTS", defaultUnit: ML, id: 7 },
    { name: "LOZENGES", defaultUnit: MG, id: 8 },
  ],
};

export const CATEGORY_TWO = {
  index: "2",
  name: "",
  items: [
    { name: "SPRAY", defaultUnit: ML, id: 9 },
    { name: "NEBULISER", defaultUnit: MG, id: 10 },
    { name: "CREAM", defaultUnit: ML, id: 11 },
    { name: "OINTMENT", defaultUnit: ML, id: 12 },
  ],
};

export const CATEGORY_THREE = {
  index: "3",
  name: "",
  items: [
    { name: "RECTAL SUPPOSITORY", defaultUnit: MG, id: 13 },
    { name: "RECTAL ENEMA", defaultUnit: MG, id: 14 },
    { name: "PESSARIES OF VAGINAL", defaultUnit: MG, id: 15 },
  ],
};

export const CATEGORY_FOUR = {
  index: "4",
  name: "",
  items: [{ name: "INHALER", defaultUnit: ML, id: 16 }],
};

export const CATEGORY_FIVE = {
  index: "5",
  name: "INJECTION",
  items: [
    { name: "I/D INTRDERMAL", defaultUnit: ML, id: 17 },
    { name: "S/C SUBCUTANEOUS", defaultUnit: ML, id: 18 },
    { name: "I/M INTRAMUSCULAR", defaultUnit: ML, id: 19 },
    { name: "I/V INTRAVENOUS", defaultUnit: ML, id: 20 },
  ],
};

export const CATEGORY_SIX = {
  index: "6",
  name: "OTHER",
  items: [{ name: "OTHER", defaultUnit: null, id: 21 }],
};

export const MEDICINE_FORMULATION = {
  [CATEGORY_ONE.index]: {
    ...CATEGORY_ONE,
  },
  [CATEGORY_TWO.index]: {
    ...CATEGORY_TWO,
  },
  [CATEGORY_THREE.index]: {
    ...CATEGORY_THREE,
  },
  [CATEGORY_FOUR.index]: {
    ...CATEGORY_FOUR,
  },
  [CATEGORY_FIVE.index]: {
    ...CATEGORY_FIVE,
  },
  [CATEGORY_SIX.index]: {
    ...CATEGORY_SIX,
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
  [RIGHT_CALF]: { name: "Right Calf" },
};

export const BODY_VIEW = {
  FRONT: "1",
  BACK: "2",
};

export const REPEAT_INTERVAL = {
  ONCE: "ONCE",
  ONE_HOUR: "ONE_HOUR",
  TWO_HOUR: "TWO_HOUR",
  FOUR_HOUR: "FOUR_HOUR",
  SIX_HOUR: "SIX_HOUR",
  TWELVE_HOUR: "TWELVE_HOUR",
};

export const MP4 = "mp4";
export const ALLOWED_VIDEO_EXTENSIONS = [MP4];

export const WAKE_UP = "1";
export const BREAKFAST = "2";
export const LUNCH = "3";
export const EVENING = "4";
export const DINNER = "5";
export const SLEEP = "6";
// added 12/7/21
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
    value: "2020-09-24T08:00:00+05:30",
    text: "Wake Up",
  },
  [BREAKFAST]: {
    value: "2020-09-24T09:00:00+05:30",
    text: "Breakfast",
  },
  [LUNCH]: {
    value: "2020-09-24T13:00:00+05:30",
    text: "Lunch",
  },
  [EVENING]: {
    value: "2020-09-24T16:00:00+05:30",
    text: "Evening Snacks",
  },
  [DINNER]: {
    value: "2020-09-24T20:00:00+05:30",
    text: "Dinner",
  },
  [SLEEP]: {
    value: "2020-09-24T23:00:00+05:30",
    text: "Sleep",
  },
  // added 12/7/21
  [MID_MORNING]: {
    value: "2020-09-24T11:00:00+05:30",
    text: "Mid Morning",
  },
};

export const OFFLINE_SYNC_DATA_TASKS = {
  SYNC_EVENTS_DATA: "event_sync_data",
};

export const CONSENT_TYPE = {
  CARE_PLAN: "CARE_PLAN",
};

export const S3_DOWNLOAD_FOLDER = "s3Downloads";
export const S3_DOWNLOAD_FOLDER_PROVIDER = "s3Downloads/provider";
export const PRESCRIPTION_PDF_FOLDER = "prescriptionPdfs";

export const FEATURES = {
  CHAT: "Chat",
  VIDEO_CALL: "Video Call",
  AUDIO_CALL: "Audio Call",
};

export const EVENT_LONG_TERM_VALUE = null;

export const TEMPLATE_DUPLICATE_TEXT = " Copy";
export const MESSAGE_TYPES = {
  USER_MESSAGE: "USER_MESSAGE",
  BOT_MESSAGE: "BOT_MESSAGE",
};

export const AGORA_CALL_NOTIFICATION_TYPES = {
  START_CALL: "START_CALL",
  MISSED_CALL: "MISSED_CALL",
};

export const USER_FAV_USER_CATEGORY = [
  USER_CATEGORY.DOCTOR,
  USER_CATEGORY.PATIENT,
  USER_CATEGORY.CARE_TAKER,
  USER_CATEGORY.HSP,
  USER_CATEGORY.PROVIDER,
  USER_CATEGORY.ADMIN,
];

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

export const WHEN_TO_TAKE_ABBREVATIONS = {
  OD: 1,
  BD: 2,
  TDS: 3,
  SOS: 4,
};

export const RADIOLOGY_SUB_TYPES = {
  CT_SCAN: "CT SCAN",
  NUCLEAR_MEDICINE: "NUCLEAR MEDICINE",
  ULTRASOUND: "ULTRASOUND",
  XRAY: "X-RAY",
  MRI: "MRI",
  ECHO_AND_DOPPLER: "ECHO AND DOPPLER",
  CT_ANGIO: "CT ANGIO",
};

export const RADIOLOGY_SUB_CATEGORY_DATA = {
  1: { name: RADIOLOGY_SUB_TYPES.CT_SCAN, id: 1 },
  2: { name: RADIOLOGY_SUB_TYPES.NUCLEAR_MEDICINE, id: 2 },
  3: { name: RADIOLOGY_SUB_TYPES.ULTRASOUND, id: 3 },
  4: { name: RADIOLOGY_SUB_TYPES.XRAY, id: 4 },
  5: { name: RADIOLOGY_SUB_TYPES.MRI, id: 5 },
  6: { name: RADIOLOGY_SUB_TYPES.ECHO_AND_DOPPLER, id: 6 },
  7: { name: RADIOLOGY_SUB_TYPES.CT_ANGIO, id: 7 },
};

export const RADIOLOGY_CATEGORY_DATA = {
  [RADIOLOGY_SUB_TYPES.CT_SCAN]: {
    1: {
      index: 1,
      name: "",
      items: [
        "CECT ANY OTHER SPECIFIC REGION",
        "CECT HEAD",
        "CECT CHEST",
        "CECT + NCCT HEAD",
        "3D RECONSTRUCTION OF SPECIFIC PART/EXTRA REGION",
        "ADDITIONAL CT SCAN SECTION",
        "CECT LOWER ABDOMEN",
        "CECT PNS (CORONAL & AXIAL)",
        "CECT + HRCT CHEST",
        "NCCT KUB",
        "NCCT JOINTS / SPINE (ANY ONE REGION)",
        "NCCT HEAD",
        "DENTAL CT",
        "SIDROSCAN",
        "NCCT + HRCT CHEST",
        "NCCT ANY OTHER SPECIFIC REGION",
        "NCCT CHEST",
        "HRCT CHEST",
        "CT UROGRAPHY",
        "HRCT TEMPORAL BONE",
        "CT TRIPLE PHASE",
        "CT THORAX",
        "CT GUIDED BIOPSY (EXCLUDING HISTOPATH. CHARG.)",
        "CT ANGIOGRAPHY",
        "CONTRAST CT SCAN",
        "CECT WHOLE ABDOMEN",
        "CECT UPPER ABDOMEN",
      ],
    },
    2: {
      index: 2,
      name: "HEAD",
      items: [
        "HEAD (PLAIN)",
        "HEAD (CONTRAST)",
        ".+ ANY SCREENING (e.g. PNS)",
        "HEAD - CV JUNCTION",
        "HEAD - SELLA TURCICA-AXIAL /or CORONAL (EACH)- PLAIN",
        "HEAD - SELLA TURCICA-AXIAL /or CORONAL (EACH)- CONTRAST",
        "HEAD - SELLA TURCICA-AXIAL + CORONAL - PLAIN",
        "HEAD - SELLA TURCICA-AXIAL+ CORONAL -CONTRAST",
      ],
    },
    3: {
      index: 3,
      name: "EAR",
      items: ["EAR + HRCT - PLAIN", "EAR + HRCT - CONTRAST"],
    },
    4: {
      index: 4,
      name: "ORBIT",
      items: ["ORBIT AXIAL & CORONAL (CONTRAST)"],
    },
    5: {
      index: 5,
      name: "FACE",
      items: [
        "FACE (PLAIN)",
        "FACE (CONTRAST)",
        "PNS - AXIAL /or/ CORONAL (EACH) - PLAIN",
        "PNS - AXIAL /or/ CORONAL (EACH) - CONTRAST",
        "PNS - AXIAL & CORONAL - PLAIN",
        "PNS - AXIAL & CORONAL - CONTRAST",
      ],
    },
    6: {
      index: 6,
      name: "DENTAL",
      items: ["DENTA SCAN (PLAIN)"],
    },
    7: {
      index: 7,
      name: "NECK",
      items: [
        "NECK (PLAIN)",
        "NECK (CONTRAST)",
        "NECK & UPPER CHEST (PLAIN)",
        "NECK & UPPER CHEST (CONTRAST)",
      ],
    },
    8: {
      index: 8,
      name: "CHEST",
      items: [
        "CHEST - HRCT (PLAIN)",
        "CHEST - THORAX (CONTRAST)",
        "CHEST WITH PULMONARY ANGIO (PLAIN)",
        "CHEST WITH PULMONARY ANGIO (CONTRAST)",
        "CHEST - LOWER CHEST & UPPER ABDOMEN (PLAIN)",
        "CHEST - LOWER CHEST & UPPER ABDOMEN (CONTRAST)",
        "CHEST + PULMONARY ANGIO + HRCT CHEST (PLAIN)",
        "CHEST + PULMONARY ANGIO + HRCT CHEST (CONTRAST)",
        "CHEST - HRCT + CECT + BRONCHOSCOPY (PLAIN)",
        "CHEST - HRCT + CECT + BRONCHOSCOPY (CONTRAST)",
      ],
    },
    9: {
      index: 9,
      name: "SPINE",
      items: [
        "SPINE - CERVICAL (CONTRAST)",
        "SPINE - DORSAL (CONTRAST)",
        "SPINE - DORSO LUMBAR (PLAIN)",
        "SPINE - DORSO LUMBAR (CONTRAST)",
        "SPINE - LUMBO SACRAL (LS) - CONTRAST",
        "SPINE - SACROILIAC JOINTS",
      ],
    },
    10: {
      index: 10,
      name: "ABDOMEN",
      items: [
        "ABDOMEN - UPPER (CONTRAST)",
        "ABDOMEN - LOWER (CONTRAST)",
        "ABDOMEN - WHOLE ABDOMEN (CONTRAST)",
        "ABDOMEN - WHOLE ABDOMEN WITH UROGRAPHY",
        "ABDOMEN - WHOLE ABDOMEN WITH RENAL ANGIO (CONTRAST)",
        "ABDOMEN - WHOLE ABDOMEN WITH ABDOMINAL ANGIOGRAPHY (CONTRAST)",
        "ABDOMEN - UPPER ABDOMEN WITH BI- PHASIC/TRIPHASIC LIVER (CONTRAST",
        "ABDOMEN - WHOLE ABDOMEN WITH BI-PHASIC/ TRIPHASIC LIVER (CONTRAST)",
        "ABDOMEN - WHOLE ABDOMEN WITH ABDOMINAL ANGIO (CONTRAST)",
      ],
    },
    11: {
      index: 11,
      name: "EXTREMITIES",
      items: [
        "EXTREMITIES AND JOINTS (PLAIN)",
        "EXTREMITIES AND JOINTS (CONTRAST)",
        "EXTREMITIES - MUSCULOSKELETAL (PER REGION) - PLAIN",
        "EXTREMITIES - MUSCULOSKELETAL (PER REGION) - CONTRAST",
        "CT BONY PART WITH 3-D RECONSTRUCTIONS",
      ],
    },
  },
  [RADIOLOGY_SUB_TYPES.NUCLEAR_MEDICINE]: {
    1: {
      index: 1,
      name: "",
      items: [
        "SESTA MIBI / Thallium Tumor",
        "SPECT ECD Brain Scan",
        "SPECT HMPAO Brain Scan",
        "SPECT Stress Thallium",
        "Stress Renal Testing",
        "Strontium Therapy-89 (4mci)",
        "Testicular Perfusion Scan",
        "Hepatobilliary Scan (HIDA)",
        "Iodine Therapy-131 (5mci)",
        "Lung Perfusion Scan",
        "Lung Ventilation Scan",
        "GI Bleeding Detection",
        "Gated SPECT",
        "GHA Brain Scan",
        "Phosphorous Therapy-32(10mci)",
        "Mackels Diverticulum Scan",
        "Lymphoscintigraphy",
        "Gastro Oesophagial Reflux",
        "Gastric Emptying Time",
        "SPECT Thallium Scan With Dobutamine",
        "DVT (Venography)",
        "Dobutamine MUGA",
        "Captopril Renal Scan",
        "Liver Scan And Hepatic Blood Flow",
        "VQ Scan",
        "Thyroid Scan",
        "Bone Ciprofloxacin Scan",
        "Baseline & Captopril Renal Scan",
        "I-131 MIBG Scan",
        "Mammoscitigraphy",
        "Parathyroid Scan",
        "Renal DMSA, Renal Scan",
        "Cysternography",
        "Cardiac Resting MUGA",
        "Bone Marrow Scan",
        "Whole Body SESTA MIBI Scan",
        "EC Renal Scan",
        "Vesico-Ureteric Reflux/DRCG",
        "Renal DTPA Renal Scan/GFR",
        "Bone Scan SPECT",
        "Whole Body Bone Scan",
        "Samarium Therapy",
        "Salivary Gland Scan",
      ],
    },
  },
  [RADIOLOGY_SUB_TYPES.ULTRASOUND]: {
    1: {
      index: 1,
      name: "",
      items: [
        "BETA SCAN/ U/S ORBITAL",
        "U/S WHOLE ABDOMEN (Abd + Pelvis)",
        "U/S PELVIS",
        "U/S ABDOMEN",
        "U/S BREAST",
        "U/S FOLLICULAR STUDY tvs 5",
        "U/S FOLLICULAR STUDY (SINGLE DAY) tvs",
        "U/S SCROTUM",
        "U/S SOFT TISSUE",
        "U/S THYROID",
        "U/S TRUS",
        "U/S CHEST",
        "FNAC-USG GUIDED",
        "ABSCESS DRAINAGE - USG GUIDED",
        "USG TVS",
        "USG ABDOMEN + TVS",
        "U/S OTHERS (Small Parts, Superficial)",
        "U/S FOLLICULAR STUDY (SINGLE DAY)",
      ],
    },
    2: {
      index: 2,
      name: "OBSTETRIC ULTRASOUND",
      items: [
        "3D / 4D ULTRASOUND - TWINS",
        "FETAL COLOUR DOPPLER/ DOPPLER FOR PREGNANCY",
        "FETAL COLOUR DOPPLER/ DOPPLER FOR PREGNANCY - TWINS",
        "LEVEL II USG FOR FETAL WELLBEING",
        "U/S OBSTETRIC TVS STUDY",
        "U/S OBSTETRIC WITH WHOLE ABDOMEN",
        "USG BIOPHYSICAL PROFILE",
        "USG TWINS",
        "ANOMALY SCAN",
        "USG FOLLICULAR MONITORING ONE CYCLE(TVS 5)",
        "USG LEVEL I FOETAL WELL BEING",
        "USG LEVEL II DETAILED SCAN",
        "USG LOWER ABDOMEN WITH FILM",
        "USG LOWER ABDOMEN WITHOUT FILM/SCREENING ONLY",
        "USG WHOLE ABDOMEN WITHOUT FILM/SCREENING ONLY",
        "USG PROCEDURE/PIGTAIL/BIOPSY",
        "USG TRUS GUIDED BIOPSY",
        "USG TRANS CRANIAL SONOGRAPHY",
        "USG TRANSRECTAL SONOGRAPHY (TRUS)",
        "USG CONFIRMATION OF PREGNANCY",
        "USG COLOUR DOPPLER OBSTETRICS",
        "USG ANY SINGLE SYSTEM WITHOUT FILM/SCREENING ONLY",
        "FIBROSCAN",
        "USG ANY SINGLE SYSTEM WITH FILM",
        "USG (B-SCAN)",
        "COLOUR DOPPLER (ARTERIAL OR VENOUS - ANY ONE)",
        "USG TRANSVAGINAL SONOGRAPHY (TVS)",
        "USG WHOLE ABDOMEN WITH FILM",
        "USG GUIDED FNAC",
        "USG HRS ALL PARTS",
      ],
    },
  },
  [RADIOLOGY_SUB_TYPES.XRAY]: {
    1: {
      index: 1,
      name: "",
      items: [
        "XRAY CERVICAL SPINE AP/ LATERAL VIEWS",
        "XRAY CERVICAL SPINE AP VIEW",
        "XRAY CERVICAL SPINE LATERAL VIEW",
        "XRAY CERVICAL SPINE OBLIQUE VIEW",
        "XRAY DORSAL SPINE AP/ LATERAL VIEWS",
        "XRAY DORSAL SPINE OBLIQUE VIEW",
        "XRAY DORSAL SPINE AP VIEW",
        "XRAY DORSAL SPINE LATERAL VIEW",
        "XRAY LS SPINE LATERAL VIEW",
        "XRAY L.S SPINE AP/ LATERAL VIEWS",
        "XRAY LUMBAR SPINE AP VIEW",
        "XRAY LUMBAR SPINE OBLIQUE VIEW",
        "XRAY CHEST P.A",
        "XRAY CHEST LATERAL VIEW",
        "XRAY CHEST AP VIEW",
        "XRAY RIBS - AP VIEW",
        "XRAY CHEST DECUBITUS VIEW",
        "XRAY FISTULOGRAM / SINOGRAM",
        "XRAY H S G",
        "XRAY I V P",
        "XRAY T TUBE CHOLANGIOGRAM",
        "XRAY MCU",
        "XRAY RGU",
        "MCU + RGU",
        "XRAY KUB",
        "XRAY ABDOMEN ERECT VIEW",
        "XRAY ANKLE - AP & LATERAL VIEWS",
        "XRAY ANKLE - AP VIEW",
        "XRAY ANKLE - LATERAL VIEW",
        "XRAY SHOULDER - AP & LATERAL VIEWS",
        "XRAY SHOULDER - AP VIEW",
        "XRAY SHOULDER - LATERAL VIEW",
        "XRAY WHOLE SPINE",
        "XRAY TM JOINTS - RIGHT OBLIQUE VIEW",
        "XRAY TM JOINTS - LEFT OBLIQUE VIEW",
      ],
    },
    2: {
      index: 2,
      name: "",
      items: [
        "XRAY SACROILIAC JOINTS - AP VIEW",
        "XRAY SACROILIAC JOINTS - RIGHT OBLIQUE VIEW",
        "XRAY SACROILIAC JOINTS - LEFT OBLIQUE VIEW",
        "XRAY WRIST JOINT AP & LATERAL VIEWS",
        "XRAY WRIST JOINT - AP VIEW",
        "XRAY WRIST JOINT - LATERAL VIEW",
        "XRAY PELVIS - AP & LATERAL VIEWS",
        "XRAY PELVIS AP VIEW",
        "XRAY PELVIS LATERAL VIEW",
        "XRAY PNS-WATER'S VIEW/CALDWELL'S VIEW",
        "XRAY NASAL BONE LATERAL VIEW",
        "XRAY SKULL AP & LATERAL VIEWS",
        "XRAY SKULL AP VIEW",
        "XRAY SKULL LATERAL VIEW",
        "XRAY SACROCOCCYX AP & LATERAL VIEWS",
        "XRAY SACROCOCCYX AP VIEW",
        "XRAY SACROCOCCYX LATERAL VIEW",
        "XRAY ARM/ FOREARM - AP & LATERAL VIEWS",
        "XRAY ARM/ FOREARM - AP VIEW",
        "XRAY ARM/ FOREARM - LATERAL VIEW",
        "XRAY ELBOW - AP & LATERAL VIEWS",
        "XRAY ELBOW AP VIEW",
        "XRAY ELBOW LATERAL VIEW",
        "XRAY HAND - AP & LATERAL VIEWS",
        "XRAY HAND - AP VIEW",
        "XRAY HAND - LATERAL VIEW",
        "XRAY BOTH HIP JOINT - AP VIEW",
        "XRAY HIP JOINT - LATERAL VIEW",
        "XRAY HIP JOINT - OBLIQUE VIEW",
        "XRAY HIP - AP VIEW",
        "XRAY HIP - LATERAL VIEW",
        "XRAY HIP - OBLIQUE VIEW",
        "XRAY THIGH/ LEG - AP & LATERAL VIEWS",
        "XRAY THIGH/ LEG - AP VIEW",
        "XRAY THIGH/ LEG - LATERAL VIEW",
        "XRAY KNEE JOINT AP & LATERAL VIEWS",
        "XRAY KNEE JOINT AP VIEW",
        "XRAY KNEE JOINT AP & LATERAL VIEWS (ERECT STANDING)",
      ],
    },
    3: {
      index: 3,
      name: "",
      items: [
        "XRAY KNEE JOINT LATERAL VIEW",
        "XRAY BOTH KNEES SKYLINE VIEW",
        "XRAY FOOT AP & LATERAL VIEWS",
        "XRAY FOOT AP VIEW",
        "XRAY FOOT LATERAL VIEW",
        "XRAY MASTOIDS (BOTH) SHULLER'S VIEW",
        "XRAY STYLOID PROCESS",
      ],
    },
    4: {
      index: 4,
      name: "MAMMOGRAPHY",
      items: ["MAMMOGRAM (BOTH BREASTS )", "MAMMOGRRAM (ONE BREAST)"],
    },
    5: {
      index: 5,
      name: "OPG",
      items: [
        "ORTHO PANTOMOGRAPH",
        "CEPHALOGRAM",
        "TEMPORO MANDIBULAR JOINT",
        "SUBMENTOVERTEX",
        "REVERSE TOWNE'S VIEW",
        "OBLIQUE LATERAL - BODY",
      ],
    },
    6: {
      index: 6,
      name: "DEXA-BONE DENSITOMETRY",
      items: [
        "DEXA - TWO SITES",
        "DEXA - THREE SITES",
        "WHOLE BODY DEXA including BODY FAT ANALYSIS",
      ],
    },
    7: {
      index: 7,
      name: "",
      items: [
        "X RAY DIGITAL- (CONTRAST)",
        "XRAY BARIUM ENEMA",
        "XRAY BARIUM MEAL",
        "XRAY BARIUM MEAL FOLLOW THRU.",
        "XRAY BARIUM SWALLOW",
      ],
    },
  },
  [RADIOLOGY_SUB_TYPES.MRI]: {
    1: {
      index: 1,
      name: "",
      items: [
        "MRI BRAIN PLAIN",
        "MRI SCREENING",
        "MRI ANGIOGRAPHY (MRA)",
        "MRI ORBITS",
        "MRI CP & IAM",
        "MRI - NECK",
        "MRI + MRA",
        "MR VENOGRAPHY",
        "MRI + MR VENOGRAPHY",
        "MRI PITUITARY GLAND",
      ],
    },
    2: {
      index: 2,
      name: "",
      items: [
        "MRI CERVICAL SPINE",
        "MRI DORSAL SPINE",
        "MRI LUMBOSACRAL SPINE",
        "MRI CERVICODORSAL SPINE",
        "MRI DORSO LUMBOSACRAL SPINE",
        "MRI WHOLE SPINE",
        "MRI CHEST",
        "MRI UPPER ABDOMEN",
        "MRI LOWER ABDOMEN",
        "MRI WHOLE ABDOMEN",
        "MRCP",
        "MRI T.M. JOINT",
        "MRI WRIST JOINT",
        "MRI KNEE JOINT",
        "MRI SHOULDER JOINT",
        "MRI HIP JOINT",
        "MRI FOOT",
        "MRI LEG",
        "MRI THIGH",
        "MRI ARM",
        "MRI FOREARM",
        "MRI ORBIT",
        "MRI NECK",
        "MRI PELVIS",
        "MRI TEMPORAL BONE (EAR)",
        "MRI ANESTHESIA/ SEDATION",
        "MRI WHOLE SPINE SCREENING",
        "MRI SI JOINT",
        "MRI BRAIN + MRA + MRV",
        "MR PERFUSION",
        "MRCP WITH CONTRAST (MAGNETIC RESONANCE CHOLANGIO/PANCREATA GRAPHY",
        "MRCP WITHOUT CONTRAST (MAGNETIC RESONANCE CHOLANGIO/PANCREATA GRAPHY",
        "MRI BRAIN / NECK / MRS",
        "MRI BRAIN + MRA + MRV WITH CONTRAST",
        "MRI FOR ONE REGION ONLY",
        "MRI HEAD CONTRAST",
        "MRI ORBIT",
        "MRI SCREENING(SINGLE PART)",
        "MRI WHOLE ABDOMEN",
        "MRI WHOLE SPINE SCREENING (CERVICAL, DORSAL, LUMBAR)",
        "MRV",
        "MRI CONTRAST MEDIUM / DYE",
        "HEAD (STROKE PROTOCOL WITH DIFFUSION)",
        "HEAD + MRA",
        "MR ANGIOGRAPHY (ANY ONE EXTREMITY, REGION)",
        "HEAD + MRA + NECK",
        "HEAD + MRS",
        "HEAD + MRV",
        "HEAD EPILEPSY",
      ],
    },
  },
  [RADIOLOGY_SUB_TYPES.ECHO_AND_DOPPLER]: {
    1: {
      index: 1,
      name: "",
      items: [
        "ECHOCARDIOGRAPHY - COLOUR DOPPLER",
        "PENILE DOPPLER",
        "COLOUR DOPPLER (ARTERY) - ONE LEG",
        "COLOUR DOPPLER (ARTERY) - BOTH LEG",
        "COLOUR DOPPLER (VENOUS) - ONE LEG",
        "COLOUR DOPPLER (VENOUS) - BOTH LEG",
        "COLOUR DOPPLER (ARTERY/VENOUS) - ONE LEG",
        "COLOUR DOPPLER (ARTERY/VENOUS) - BOTH LEG",
      ],
    },
  },
  [RADIOLOGY_SUB_TYPES.CT_ANGIO]: {
    1: {
      index: 1,
      name: "",
      items: [
        "ANGIOGRAPHY - CEREBRAL (Brain)/NECK/ PULMONARY/ AORTIC/ ABDOMEN/ RENAL (PLAIN)",
        "ANGIOGRAPHY - CEREBRAL (Brain)/NECK/ PULMONARY/ AORTIC/ ABDOMEN/ RENAL (CONTRAST)",
        "ANGIOGRAPHY - ANGIO BRAIN & NECK (PLAIN)",
        "ANGIOGRAPHY - ANGIO BRAIN & NECK (CONTRAST)",
        "ANGIOGRAPHY - PERIPHERAL ANGIOGRAPHY (LOWER LIMB)-CONTRAST",
        "ANGIOGRAPHY - PERIPHERAL ANGIOGRAPHY (UPPER LIMB)-CONTRAST",
        "ANGIOGRAPHY - RENAL ANGIOGRAPHY + UROGRAPHY (CONTRAST)",
        "ANGIOGRAPHY - CORONARY",
      ],
    },
  },
};

export const RADIOLOGY_DATA = {
  1: {
    id: 1,
    name: RADIOLOGY_SUB_TYPES.CT_SCAN,
    data: {
      ...RADIOLOGY_CATEGORY_DATA[RADIOLOGY_SUB_TYPES.CT_SCAN],
    },
  },
  2: {
    id: 2,
    name: RADIOLOGY_SUB_TYPES.NUCLEAR_MEDICINE,
    data: {
      ...RADIOLOGY_CATEGORY_DATA[RADIOLOGY_SUB_TYPES.NUCLEAR_MEDICINE],
    },
  },
  3: {
    id: 3,
    name: RADIOLOGY_SUB_TYPES.ULTRASOUND,
    data: {
      ...RADIOLOGY_CATEGORY_DATA[RADIOLOGY_SUB_TYPES.ULTRASOUND],
    },
  },
  4: {
    id: 4,
    name: RADIOLOGY_SUB_TYPES.XRAY,
    data: {
      ...RADIOLOGY_CATEGORY_DATA[RADIOLOGY_SUB_TYPES.XRAY],
    },
  },
  5: {
    id: 5,
    name: RADIOLOGY_SUB_TYPES.MRI,
    data: {
      ...RADIOLOGY_CATEGORY_DATA[RADIOLOGY_SUB_TYPES.MRI],
    },
  },
  6: {
    id: 6,
    name: RADIOLOGY_SUB_TYPES.ECHO_AND_DOPPLER,
    data: {
      ...RADIOLOGY_CATEGORY_DATA[RADIOLOGY_SUB_TYPES.ECHO_AND_DOPPLER],
    },
  },
  7: {
    id: 7,
    name: RADIOLOGY_SUB_TYPES.CT_ANGIO,
    data: {
      ...RADIOLOGY_CATEGORY_DATA[RADIOLOGY_SUB_TYPES.CT_ANGIO],
    },
  },
};

export const DIAGNOSIS_TYPE = {
  FINAL: {
    id: "1",
    text: "final",
  },
  PROBABLE: {
    id: "2",
    text: "probable",
  },
};

export const DAYS_TEXT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DIET_RESPONSE_STATUS = {
  DONE: "DONE",
  SKIPPED: "SKIPPED",
  EXPIRED: "EXPIRED",
  PARTIALLY_DONE: "PARTIALLY_DONE",
};

export const WORKOUT_RESPONSE_STATUS = {
  DONE: "DONE",
  SKIPPED: "SKIPPED",
  EXPIRED: "EXPIRED",
  PARTIALLY_DONE: "PARTIALLY_DONE",
};

export const DEFAULT_PROVIDER = "self";

export const DOCTOR_TYPE_PROFILES = [USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP];
