export const ACTION_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication",
  EXERCISE: "exercise",
  DIET: "diet",
  MATERIAL_DELIVERY: "material_delivery"
};

export const ACTIVITY_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication"
};

export const EVENT_TYPE = {
  APPOINTMENT: "appointment",
  REMINDER: "reminder",
  ADVERSE_EVENT: "adverse",
  ARTICLE: "article",
  MEDICATION_REMINDER: "medication-reminder"
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

export const SUNDAY = "Sunday";
export const MONDAY = "Monday";
export const TUESDAY = "Tuesday";
export const WEDNESDAY = "Wednesday";
export const THURSDAY = "Thursday";
export const FRIDAY = "Friday";
export const SATURDAY = "Saturday";

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
export const USER_STATUS = {
  ENROLLED: "ENROLLED",
  DISCHARGED: "DISCHARGED",
  INACTIVE: "INACTIVE",
  DROPPED: "DROPPED"
};

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

export const PARTICIPANTS_SURVEY_STATUS = {
  COMPLETED: "COMPLETED"
};

export const RESOURCE = {
  DOCTORS: "doctors",
  PATIENTS: "patients",
  CARE_COACHS: "careCoachs",
  PROGRAM_ADMINS: "programAdmins",
  EVENTS: "events",
  PROGRAMS: "programs",
  SURVEYS: "surveyS"
};
//
// export const PERMISSIONS = {
//   CREATE: "create",
//   UPDATE: "update",
//   VIEW: "view",
//   INVITE: "invite",
//   CANCEL: "cancel",
//   VERIFY: "verify",
//   SEND: "send",
//   END: "end",
//   DISCHARGE: "discharge"
// };

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
  MRL_GENERATION: "MRL_GENERATION"
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
  EMAIL_LOGGER: 'email_loggers',
  DOCTOR_QUALIFICATIONS: 'doctor_qualifications',
  DOCTOR_CLINICS: 'doctor_clinics',
  UPLOAD_DOCUMENTS: 'upload_documents',
  TEMPLATE_MEDICATIONS: 'template_medications',
  TEMPLATE_APPOINTMENTS: 'template_appointments',
  CARE_PLAN_MEDICATIONS: 'care_plan_medications',
  CARE_PLAN_APPOINTMENTS: 'care_plan_appointments',
  DOCTOR_REGISTRATIONS: "doctor_registrations",
  TREATMENTS: "treatments",
  SEVERITY: "severity",
  USER_PREFERENCES: "user_preferences",
  PERMISSIONS: "permissions",
  USER_CATEGORY_PERMISSIONS: "user_category_permissions",
  COLLEGE:"colleges",
  COURSE:"courses",
  DEGREE:"degrees",
  QUALIFICATION:"qualifications",
  REGISTRATION_COUNCIL:"registration_councils",
  OTP_VERIFICATIONS: "otp_verifications",
  TREATMENT_CONDITION_MAPPING: "treatment_condition_mappings",
  FEATURE_DETAILS: 'feature_details',
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
  DOCTOR_REGISTRATION: "doctor_registration"
};

export const ONBOARDING_STATUS = {
  PROFILE_REGISTERED: "profile_registered",
  QUALIFICATION_REGISTERED: "qualification_registered",
  CLINIC_REGISTERED: "CLINIC_registered",
  PATIENT: {
    PASSWORD_UPDATE: "password_update",
    PROFILE_REGISTERED: "profile_registration"
  },
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
  CANCELLED: "cancelled"
};

export const EMAIL_TEMPLATE_NAME = {
  WELCOME: "welcome",
  FORGOT_PASSWORD: "forgotPassword",
  INVITATION:"invitation",
  VERIFIED_DOCTOR: "verifiedDoctor",
  OTP_VERIFICATION:"otpVerification",
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
  [AFTER_BREAKFAST]: {
    [TEXT_KEY]: "After Breakfast",
    [TIME_KEY]: "9am"
  },
  [NOON]: {
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

export const MEDICINE_TYPE = {
  TABLET: "tablet",
  INJECTION: "injection"
};

export const VERIFICATION_TYPE = {
  FORGOT_PASSWORD: "forgot_password",
  SIGN_UP: "sign_up",
  PATIENT_SIGN_UP: "patient_sign_up"
};

export const NO_ADHERENCE = "1";
export const NO_MEDICATION = "2";
export const NO_APPOINTMENT = "3";
export const NO_ACTION = "4";
export const TEST_ONE = "5";
export const TEST_TWO = "6";

export const CHART_LIMIT = 4;

export const CHART_DETAILS = {
  [NO_ADHERENCE]: {
    type: "no_adherence",
    name: "Non Adherence",
    critical: 19,
    total: 100
  },
  [NO_MEDICATION]: {
    type: "no_medication",
    name: "Non Medication",
    critical: 25,
    total: 80
  },
  [NO_APPOINTMENT]: {
    type: "no_appointment",
    name: "Non Appointment",
    critical: 5,
    total: 40
  },
  [NO_ACTION]: {
    type: "no_action",
    name: "Non Action",
    critical: 30,
    total: 120
  },
  [TEST_ONE]: {
    type: "test_one",
    name: "Test One",
    critical: 10,
    total: 50
  },
  [TEST_TWO]: {
    type: "test_two",
    name: "Test Two",
    critical: 10,
    total: 60
  },
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
    options: [
      {}
    ],
  },
  [CONSULTATION]: {
    title: "Consultation",
  },
  [RADIOLOGY]: {
    title: "Radiology",
  },
};

export const FEATURE_TYPE = {
  APPOINTMENT:"appointment",
  MEDICATION:"medication",
};

export const BLANK_STATE = "";