export const ACTIVITY_TYPE = {
    FOLLOWUP: "followup",
    MEDICATION: "medication",
    MATERIAL_DELIVERY: "material_delivery"
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

export const DAYS = [SUN, MON, TUE, WED, THU, FRI, SAT];
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

export const PERMISSIONS = {
    CREATE: "create",
    UPDATE: "update",
    VIEW: "view",
    INVITE: "invite",
    CANCEL: "cancel",
    VERIFY: "verify",
    SEND: "send",
    END: "end",
    DISCHARGE: "discharge"
};

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

export const CONTRIBUTION_TYPE = {
    OOP: "OOP",
    COPAY: "Copay",
    INSURANCE: "Insurance",
    CHARITY: "CharityApplied"
};

export const BENEFITPLAN_STATUS = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    APPROVED: "Approved",
    REJECTED: "Rejected"
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
    SCHEDULE_EVENTS:"schedule_events",
};

export const SIGN_IN_CATEGORY = {
    BASIC: "basic",
    GOOGLE: "google",
    FACEBOOK: "facebook"
};

export const GENDER = {
    MALE: "m",
    FEMALE: "f",
    TRANS: "t"
};

export const EVENT_STATUS = {
  SCHEDULED: "scheduled",
    PENDING: "pending",
    COMPLETED:"completed",
    EXPIRED:"expired",
    CANCELLED:"cancelled"
};
