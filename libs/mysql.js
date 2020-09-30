import {Sequelize} from "sequelize";
import Log from "./log";
const Logger = new Log("SEQUELIZE QUERY");
// const Config = require("../config/config");
// Config();

// MODELS
import * as ActionDetails from "../app/models/actionDetails";
import * as Actions from "../app/models/actions";
import * as Adherence from "../app/models/adherence";
import * as Appointments from "../app/models/appointments";
import * as Articles from "../app/models/articles";

import * as CarePlans from "../app/models/carePlan";
import * as CarePlanAppointments from "../app/models/carePlanAppointments";
import * as CarePlanMedications from "../app/models/carePlanMedications";
import * as CarePlanTemplates from "../app/models/careplanTemplate";
import * as Clinics from "../app/models/clinics";
import * as Colleges from "../app/models/college";
import * as Conditions from "../app/models/conditions";
import * as Consents from "../app/models/consents";
import * as Course from "../app/models/course";

import * as Degree from "../app/models/degree";
import * as Diet from "../app/models/diet";
import * as Disease from "../app/models/disease";
import * as DoctorClinics from "../app/models/doctorClinics";
import * as DoctorQualifications from "../app/models/doctorQualifications";
import * as DoctorRegistrations from "../app/models/doctorRegistrations";
import * as Doctors from "../app/models/doctors";

import * as EmailLogger from "../app/models/emailLogger";
import * as Exercise from "../app/models/exercise";

import * as FeatureDetails from "../app/models/featureDetails";
import * as Features from "../app/models/features";

import * as Medications from "../app/models/medicationReminders";
import * as Medicines from "../app/models/medicines";
import * as MemberSpecialities from "../app/models/memberSpecialities";

import * as OtpVerifications from "../app/models/otpVerifications";

import * as PatientCareTakers from "../app/models/patientCareTakers";
import * as Patients from "../app/models/patients";
import * as Permissions from "../app/models/permissions";
import * as PlatformEvents from "../app/models/platformEvents";
import * as ProductPlans from "../app/models/productPlans";
import * as ProviderMembers from "../app/models/providerMembers";
import * as Providers from "../app/models/providers";

import * as RegionFeatures from "../app/models/regionFeatures";
import * as RegionProviders from "../app/models/regionProviders";
import * as Regions from "../app/models/regions";
import * as RegistrationCouncils from "../app/models/registrationCouncil";
import * as Reminders from "../app/models/reminders";

import * as ScheduleEvents from "../app/models/scheduleEvents";
import * as Severity from "../app/models/severity";
import * as Speciality from "../app/models/specialities";
import * as Subscriptions from "../app/models/subscriptions";
import * as Symptoms from "../app/models/symptoms";

import * as TemplateAppointments from "../app/models/templateAppointments";
import * as TemplateMedications from "../app/models/templateMedications";
import * as TreatmentConditionMapping from "../app/models/treatmentConditionMapping";
import * as Treatments from "../app/models/treatments";

import * as UploadDocuments from "../app/models/uploadDocuments";
import * as UserCategoryPermissions from "../app/models/userCategoryPermissions";
import * as UserDevices from "../app/models/userDevices";
import * as UserPreferences from "../app/models/userPreferences";
import * as Users from "../app/models/users";
import * as UserVerifications from "../app/models/userVerifications";

import * as Vitals from "../app/models/vitals";
import * as VitalTemplates from "../app/models/vitalTemplates";

const database = new Sequelize(
  process.config.db.name,
  process.config.db.username,
  process.config.db.password,
  {
    host: process.config.db.host,
    port: process.config.db.port,
    dialect: process.config.db.dialect,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: function (str) {
      Logger.debug("query", str);
    }
  }
);

console.log("procees:::::::::::::",process.config);

// Models List...
const modelList = [
    ActionDetails,
    Actions,
    Adherence,
    Appointments,
    Articles,

    CarePlans,
    CarePlanAppointments,
    CarePlanMedications,
    CarePlanTemplates,
    Clinics,
    Colleges,
    Conditions,
    Consents,
    Course,

    Degree,
    Diet,
    Disease,
    DoctorClinics,
    DoctorQualifications,
    DoctorRegistrations,
    Doctors,

    EmailLogger,
    Exercise,

    FeatureDetails,
    Features,

    Medications,
    Medicines,
    MemberSpecialities,

    ScheduleEvents,

    OtpVerifications,

    PatientCareTakers,
    Patients,
    Permissions,
    PlatformEvents,
    ProductPlans,
    Providers,
    ProviderMembers,

    RegionFeatures,
    RegionProviders,
    Regions,
    RegistrationCouncils,
    Reminders,

    Severity,
    Speciality,
    Subscriptions,
    Symptoms,

    TemplateAppointments,
    TemplateMedications,
    TreatmentConditionMapping,
    Treatments,

    UploadDocuments,
    UserCategoryPermissions,
    UserDevices,
    UserPreferences,
    Users,
    UserVerifications,

    Vitals,
    VitalTemplates,
];

// MODEL INIT...
for (const model of modelList) {
    model.db(database);
}

// ASSOCIATIONS...
for(const model of modelList) {
    model.associate(database);
}

export default database;
