import { Sequelize } from "sequelize";
import Logger from "./log";
const Log = new Logger("SEQUELIZE QUERY");
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
import * as DoctorPatientFeaturesMapping from "../app/models/doctorPatientFeatureMapping";

import * as EmailLogger from "../app/models/emailLogger";
import * as Exercise from "../app/models/exercise";
import * as EventHistory from "../app/models/eventHistory";

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
import * as PaymentProducts from "../app/models/paymentProducts";

import * as RegionFeatures from "../app/models/regionFeatures";
import * as RegionProviders from "../app/models/regionProviders";
import * as Regions from "../app/models/regions";
import * as RegistrationCouncils from "../app/models/registrationCouncil";
import * as Reminders from "../app/models/reminders";
import * as Reports from "../app/models/reports";

import * as ScheduleEvents from "../app/models/scheduleEvents";
import * as Severity from "../app/models/severity";
import * as Speciality from "../app/models/specialities";
import * as Subscriptions from "../app/models/subscriptions";
import * as Symptoms from "../app/models/symptoms";

import * as TemplateAppointments from "../app/models/templateAppointments";
import * as TemplateMedications from "../app/models/templateMedications";
import * as TemplateVitals from "../app/models/templateVitals";
import * as TreatmentConditionMapping from "../app/models/treatmentConditionMapping";
import * as Treatments from "../app/models/treatments";
import * as Transactions from "../app/models/transactions";

import * as UploadDocuments from "../app/models/uploadDocuments";
import * as UserCategoryPermissions from "../app/models/userCategoryPermissions";
import * as UserDevices from "../app/models/userDevices";
import * as UserPreferences from "../app/models/userPreferences";
import * as Users from "../app/models/users";
import * as UserVerifications from "../app/models/userVerifications";

import * as Vitals from "../app/models/vitals";
import * as VitalTemplates from "../app/models/vitalTemplates";
import * as Watchlist from "../app/models/doctor_patient_watchlist";

import * as AccountDetails from "../app/models/accountDetails";
import * as DoctorProviderMapping from "../app/models/doctorProviderMapping";

// Models List...
const models = [
  AccountDetails,
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
  DoctorProviderMapping,
  DoctorPatientFeaturesMapping,

  EmailLogger,
  Exercise,
  EventHistory,

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
  PaymentProducts,

  RegionFeatures,
  RegionProviders,
  Regions,
  RegistrationCouncils,
  Reminders,
  Reports,

  Severity,
  Speciality,
  Subscriptions,
  Symptoms,

  TemplateAppointments,
  TemplateMedications,
  TemplateVitals,
  TreatmentConditionMapping,
  Treatments,
  Transactions,

  UploadDocuments,
  UserCategoryPermissions,
  UserDevices,
  UserPreferences,
  Users,
  UserVerifications,

  Vitals,
  VitalTemplates,

  Watchlist
];

class Database {
  static connection = null;

  static getDatabase = async () => {
    // console.log("=====", Database.connection);
    if (Database.connection === null) {
      Database.connection = await new Sequelize(
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
          logging: function(str) {
            Log.debug("query", str);
          }
        }
      );
    }

    return Database.connection;
  };

  static getModel = dbName => Database.connection.models[dbName];

  static initTransaction = () => Database.connection.transaction();

  static init = async () => {
    try {
      const database = await Database.getDatabase();
      await database.authenticate();

      for (const model of models) {
        model.db(database);
      }

      for (const model of models) {
        model.associate(database);
      }
      Log.info("Db and tables have been created...");
    } catch (err) {
      Log.err(1000, "Db connect error is: ", err);
    }
  };
}

export default Database;
