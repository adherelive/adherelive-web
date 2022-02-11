import Controller from "../../";
import userService from "../../../services/user/user.service";
import patientService from "../../../services/patients/patients.service";
import minioService from "../../../services/minio/minio.service";

// SERVICES ------------
import VitalService from "../../../services/vitals/vital.service";
import UserPreferenceService from "../../../services/userPreferences/userPreference.service";
import ConsentService from "../../../services/consents/consent.service";
import DoctorService from "../../../services/doctor/doctor.service";
import doctorRegistrationService from "../../../services/doctorRegistration/doctorRegistration.service";
import conditionService from "../../../services/condition/condition.service";
import ReportService from "../../../services/reports/report.service";
import PaymentProductService from "../../../services/paymentProducts/paymentProduct.service";
import ExerciseContentService from "../../../services/exerciseContents/exerciseContent.service";
import WorkoutService from "../../../services/workouts/workout.service";
import RepetitionService from "../../../services/exerciseRepetitions/repetition.service";
import PortionServiceService from "../../../services/portions/portions.service";
import DietService from "../../../services/diet/diet.service";

// WRAPPERS ------------
import ExerciseContentWrapper from "../../../ApiWrapper/mobile/exerciseContents";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import ConsentWrapper from "../../../ApiWrapper/mobile/consent";
import QualificationWrapper from "../../../ApiWrapper/mobile/doctorQualification";
import DegreeWrapper from "../../../ApiWrapper/mobile/degree";
import RegistrationWrapper from "../../../ApiWrapper/mobile/doctorRegistration";
import CouncilWrapper from "../../../ApiWrapper/mobile/council";
import ConditionWrapper from "../../../ApiWrapper/mobile/conditions";
import UserPreferenceWrapper from "../../../ApiWrapper/mobile/userPreference";
import ReportWrapper from "../../../ApiWrapper/mobile/reports";
import PaymentProductWrapper from "../../../ApiWrapper/mobile/paymentProducts";
import PortionWrapper from "../../../ApiWrapper/mobile/portions";
import WorkoutWrapper from "../../../ApiWrapper/mobile/workouts";
import DietWrapper from "../../../ApiWrapper/mobile/diet";

import * as DietHelper from "../../diet/dietHelper";

import { randomString } from "../../../../libs/helper";
import Log from "../../../../libs/log";

import fs from "fs";
import md5 from "js-md5";
import { imgSync } from "base64-img";
import appointmentService from "../../../services/appointment/appointment.service";
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import MReminderWrapper from "../../../ApiWrapper/mobile/medicationReminder";
import medicineService from "../../../services/medicine/medicine.service";
import MedicineApiWrapper from "../../../ApiWrapper/mobile/medicine";
import carePlanService from "../../../services/carePlan/carePlan.service";
// import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
// import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import providerTermsMappingService from "../../../services/providerTermsMapping/providerTermsMappings.service";
import patientPaymentConsentMappingService from "../../../services/patientPaymentConsentMapping/patientPaymentConsentMapping.service";
// import doctorProviderMappingService from "../../../services/doctorProviderMapping/doctorProviderMapping.service";
import userRolesService from "../../../services/userRoles/userRoles.service";

import UserWrapper from "../../../ApiWrapper/mobile/user";
import UserRolesWrapper from "../../../ApiWrapper/mobile/userRoles";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import CarePlanTemplateWrapper from "../../../ApiWrapper/web/carePlanTemplate";
import AppointmentWrapper from "../../../ApiWrapper/mobile/appointments";
// import TemplateMedicationWrapper from "../../../ApiWrapper/mobile/templateMedication";
// import TemplateAppointmentWrapper from "../../../ApiWrapper/mobile/templateAppointment";
import SymptomWrapper from "../../../ApiWrapper/mobile/symptoms";
import ProviderWrapper from "../../../ApiWrapper/mobile/provider";
import ProviderTermsMappingWrapper from "../../../ApiWrapper/mobile/providerTermsMappings";
import PatientConsentMappingWrapper from "../../../ApiWrapper/mobile/patientPaymentConsentMapping";
// import DoctorProviderMappingWrapper from "../../../ApiWrapper/web/doctorProviderMapping";

// import templateMedicationService from "../../../services/templateMedication/templateMedication.service";
// import templateAppointmentService from "../../../services/templateAppointment/templateAppointment.service";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import SymptomService from "../../../services/symptom/symptom.service";
import qualificationService from "../../../services/doctorQualifications/doctorQualification.service";

import moment from "moment";
import {
  BODY_VIEW,
  CONSENT_TYPE,
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY,
  S3_DOWNLOAD_FOLDER,
  PRESCRIPTION_PDF_FOLDER,
  S3_DOWNLOAD_FOLDER_PROVIDER,
  CONSULTATION,
} from "../../../../constant";
import generateOTP from "../../../helper/generateOtp";
import otpVerificationService from "../../../services/otpVerification/otpVerification.service";
import { EVENTS, Proxy_Sdk } from "../../../proxySdk";
import generatePDF from "../../../helper/generateCarePlanPdf";
import { downloadFileFromS3 } from "../user/userHelper";
import { getFilePath } from "../../../helper/filePath";
import {
  checkAndCreateDirectory,
  getSeparateName,
} from "../../../helper/common";
import { getDoctorCurrentTime } from "../../../helper/getUserTime";
import * as carePlanHelper from "../carePlans/carePlanHelper";
import PERMISSIONS from "../../../../config/permissions";

const path = require("path");

const Logger = new Log("mobile patient controller");

class MPatientController extends Controller {
  constructor() {
    super();
  }

  mUpdatePatient = async (req, res) => {
    try {
      // console.log("-------------- req.body ------------", req.body);
      console.log("=============IN Mobile Controller 1=================");
      console.log(userDetails);
      console.log(body);
      console.log("==================================================");
      const { userDetails, body } = req;
      const { profile_pic, name, email, timings = {} } = body || {};
      const { userId = "3" } = userDetails || {};

      if (email) {
        const updateUserDetails = await userService.updateEmail(
          { email },
          userId
        );
      }

      if (Object.keys(timings).length > 0) {
        const prevUserPreference =
          await UserPreferenceService.getPreferenceByData({ user_id: userId });
        let addTimingPreference = null;
        if (!prevUserPreference) {
          addTimingPreference = await UserPreferenceService.addUserPreference({
            user_id: userId,
            details: {
              timings,
            },
          });
        } else {
          const userPreferenceWrapper = await UserPreferenceWrapper(
            prevUserPreference
          );
          const userPreferenceId = userPreferenceWrapper.getUserPreferenceId();
          addTimingPreference =
            await UserPreferenceService.updateUserPreferenceData(
              {
                user_id: userId,
                details: {
                  timings,
                },
              },
              userPreferenceId
            );
        }
        // Logger.debug("addTimingPreference", addTimingPreference);
      }

      const patientDetails = await patientService.getPatientByUserId(userId);
      const initialPatientData = await PatientWrapper(patientDetails);

      const splitName = name.split(" ");

      let profilePic = "";

      if (profile_pic.startsWith("data")) {
        const extension = profile_pic.substring(
          "data:image/".length,
          profile_pic.indexOf(";base64")
        );

        if (!extension) {
          return this.raiseClientError(
            res,
            422,
            { message: "Bad request" },
            ""
          );
        }

        const file_name = randomString(7);

        const file_path = imgSync(profile_pic, "/tmp", file_name);
        const file = fs.readFileSync(file_path);

        // console.log("file ------> ", file);

        if (userId) {
          if (profile_pic) {
            await minioService.createBucket();

            let hash = md5.create();

            hash.update(`${userId}`);
            hash.hex();
            hash = String(hash);

            const imageName = md5(`${userId}-profile-pic`);
            // const fileExt = "";
            const file_name =
              hash.substring(4) + "/" + imageName + "." + extension;
            // const fileUrl = "/" + file_name;

            await minioService.saveBufferObject(file, file_name);
            profilePic = file_name;
          }
        } else {
          // todo
        }
      } else {
        if (userId) {
          profilePic = profile_pic;
        } else {
          // todo
        }
      }

      const profilePicUrl = `/${profilePic}`;

      // Logger.debug("18371823 profilePicUrl ---> ", profilePicUrl);

      // todo minio configure here

      const previousDetails = (await initialPatientData.getDetails()) || {};
      const { basic_info: prevBasicInfo } =
        initialPatientData.getBasicInfo() || {};

      const { first_name, middle_name, last_name } =
        getSeparateName(name) || {};

      const patientData = {
        user_id: userId,
        first_name,
        middle_name,
        last_name,
        ...prevBasicInfo,
        details: {
          // todo: profile_pic
          ...previousDetails,
          profile_pic: profilePicUrl,
        },
      };

      const updatedpatientDetails = await patientService.updatePatient(
        patientDetails,
        patientData
      );
      const updateUser = await userService.updateUser(
        { onboarded: true, onboarding_status: null },
        userId
      );

      const patientApiWrapper = await PatientWrapper(updatedpatientDetails);

      const updatedUserDetails = await UserWrapper(null, userId);

      return this.raiseSuccess(
        res,
        200,
        {
          users: {
            [updatedUserDetails.getId()]: updatedUserDetails.getBasicInfo(),
          },
          patients: {
            [patientApiWrapper.getPatientId()]: {
              ...patientApiWrapper.getBasicInfo(),
            },
          },
        },
        "Patient details updated successfully"
      );
    } catch (error) {
      console.log("UPDATE PATIENT ERROR --> ", error);
      return this.raiseServerError(res, 500, error, error.message);
    }
  };

  getPatientAppointments = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { params: { id } = {} } = req;

      const appointmentList = await appointmentService.getAppointmentForPatient(
        id
      );

      let appointmentApiData = {};
      let scheduleEventData = {};
      let appointmentDocuments = {};
      let appointmentIds = [];

      for (const appointment of appointmentList) {
        const appointmentWrapper = await AppointmentWrapper(appointment);

        const {
          appointments,
          schedule_events,
          appointment_docs,
          appointment_id,
        } = await appointmentWrapper.getReferenceInfo();
        appointmentIds.push(appointment_id);
        appointmentApiData = { ...appointmentApiData, ...appointments };
        scheduleEventData = { ...scheduleEventData, ...schedule_events };
        appointmentDocuments = { ...appointmentDocuments, ...appointment_docs };
      }

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            ...appointmentApiData,
          },
          schedule_events: {
            ...scheduleEventData,
          },
          appointment_docs: {
            ...appointmentDocuments,
          },
          appointment_ids: appointmentIds,
        },
        `Appointment data for patient: ${id} fetched successfully`
      );
    } catch (error) {
      Logger.debug("getPatientAppointments 500 error", error);
      raiseServerError(res);
    }
  };

  getPatientMedications = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;

      const medicationDetails =
        await medicationReminderService.getMedicationsForParticipant({
          participant_id: id,
        });

      // console.log("712367132 medicationDetails --> ", medicationDetails);
      // Logger.debug("medication details", medicationDetails);

      let medicationApiData = {};
      let scheduleEventApiData = {};
      let medicineId = [];

      for (const medication of medicationDetails) {
        const medicationWrapper = await MReminderWrapper(medication);
        const { medications, schedule_events } =
          await medicationWrapper.getReferenceInfo();
        medicationApiData = {
          ...medicationApiData,
          ...medications,
        };
        scheduleEventApiData = { ...scheduleEventApiData, ...schedule_events };
        medicineId.push(medicationWrapper.getMedicineId());
      }

      Logger.debug("medicineId", medicineId);

      const medicineData = await medicineService.getMedicineByData({
        id: medicineId,
      });

      let medicineApiData = {};

      Logger.debug("medicineData", medicineData);

      for (const medicine of medicineData) {
        const medicineWrapper = await MedicineApiWrapper(medicine);
        medicineApiData[medicineWrapper.getMedicineId()] =
          medicineWrapper.getBasicInfo();
      }

      Logger.debug("medicineData", medicineData);

      return raiseSuccess(
        res,
        200,
        {
          medications: {
            ...medicationApiData,
          },
          medicines: {
            ...medicineApiData,
          },
          schedule_events: {
            ...scheduleEventApiData,
          },
        },
        "Medications fetched successfully"
      );
    } catch (error) {
      Logger.debug("medication get 500 error ", error);
      return raiseServerError(res);
    }
  };

  //TODO: need to delete below function if all working fine in mobile app.
  getPatientCarePlanDetailsWithImp1 = async (req, res) => {
    try {
      const { id: patient_id = 1 } = req.params;
      const {
        userDetails: {
          userRoleId = null,
          userId,
          userCategoryId,
          userData: { category } = {},
        } = {},
      } = req;

      if (!patient_id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct patient to continue"
        );
      }

      let allProvidersData = {};
      let allUserRoleData = {};
      let carePlanApiDetails = {};
      let templateMedicationData = {};
      let templateAppointmentData = {};
      let otherCarePlanTemplates = {};

      let medicationApiDetails = {};

      let carePlanTemplateIds = [];
      let latestCarePlanId = null;
      let treatmentIds = [];

      // for vitals
      let vitalTemplateData = {};

      // get all careplans attached to patient
      const carePlans =
        (await carePlanService.getMultipleCarePlanByData({
          patient_id,
          user_role_id: userRoleId,
        })) || [];

      if (carePlans.length > 0) {
        // check done.
        const {
          medications,
          providers = {},
          care_plans,
          user_roles = {},
          care_plan_ids,
          current_careplan_id,
        } = await carePlanHelper.getCareplanDataWithImp({
          carePlans,
          userCategory: category,
          doctorId: userCategoryId,
          userRoleId,
        });

        // care plans
        carePlanApiDetails = { ...carePlanApiDetails, ...care_plans };
        //        carePlanIds = [...care_plan_ids];
        latestCarePlanId = current_careplan_id;
        medicationApiDetails = { ...medicationApiDetails, ...medications };
        allProvidersData = { ...allProvidersData, ...providers };
        allUserRoleData = { ...allUserRoleData, ...user_roles };

        Object.keys(care_plans).forEach((id) => {
          const { details: { treatment_id } = {} } = care_plans[id] || {};
          treatmentIds.push(treatment_id);
        });
      }

      const carePlanTemplates =
        (await carePlanTemplateService.getCarePlanTemplateData({
          user_id: userId,
          treatment_id: treatmentIds,
        })) || [];

      if (carePlanTemplates.length > 0) {
        for (let index = 0; index < carePlanTemplates.length; index++) {
          const carePlanTemplate = await CarePlanTemplateWrapper(
            carePlanTemplates[index]
          );
          // check done.
          const {
            care_plan_templates,
            template_appointments,
            template_medications,
            vital_templates,
          } = await carePlanTemplate.getReferenceInfoWithImp();

          carePlanTemplateIds = [
            ...new Set([
              ...carePlanTemplateIds,
              ...Object.keys(care_plan_templates),
            ]),
          ];

          // carePlanTemplateIds.push(...Object.keys(care_plan_templates));
          otherCarePlanTemplates = {
            ...otherCarePlanTemplates,
            ...care_plan_templates,
          };
          vitalTemplateData = {
            ...vitalTemplateData,
            ...vital_templates,
          };
          templateAppointmentData = {
            ...templateAppointmentData,
            ...template_appointments,
          };
          templateMedicationData = {
            ...templateMedicationData,
            ...template_medications,
          };
        }
      } else {
        carePlanTemplateIds.push("1");
        otherCarePlanTemplates["1"] = {
          basic_info: {
            id: "1",
            name: "Blank Template",
          },
        };
      }

      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: {
            ...carePlanApiDetails,
          },
          care_plan_templates: {
            ...otherCarePlanTemplates,
          },
          care_plan_template_ids: [...carePlanTemplateIds],
          current_careplan_id: latestCarePlanId,

          template_appointments: {
            ...templateAppointmentData,
          },
          template_medications: {
            ...templateMedicationData,
          },
          vital_templates: {
            ...vitalTemplateData,
          },
        },
        "Patient care plan details fetched successfully"
      );
    } catch (error) {
      Logger.debug("get careplan 500 error ---> ", error);
      return this.raiseServerError(res);
    }
  };

  // Copy from the Web

  getTime = () => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();
    return (
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  };

  getPatientCarePlanDetailsWithImp = async (req, res) => {
    console.log("get PatientCarePlanDetails Called - 1" + this.getTime());
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      console.log("get PatientCarePlanDetails Called - 2" + this.getTime());
      const { id: patient_id = 1 } = req.params;
      console.log("get PatientCarePlanDetails Called - 3" + this.getTime());
      Logger.info(`params: patient_id = ${patient_id}`);
      const {
        userDetails: {
          userRoleId = null,
          userId,
          userCategoryId,
          userData: { category } = {},
        } = {},
      } = req;
      console.log("get PatientCarePlanDetails Called - 4" + this.getTime());
      if (!patient_id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct patient to continue"
        );
      }
      console.log("get PatientCarePlanDetails Called - 5" + this.getTime());

      // get all careplans attached to patient
      const carePlans =
        (await carePlanService.getMultipleCarePlanByData({
          patient_id,
          user_role_id: userRoleId,
        })) || [];
      console.log("get PatientCarePlanDetails Called - 6" + this.getTime());
      let treatmentIds = [];
      let carePlanIds = [];
      let latestCarePlanId = null;
      let templateMedicationData = {};
      let templateAppointmentData = {};
      let otherCarePlanTemplates = {};
      let carePlanTemplateIds = [];
      // for care plan templates
      let templateVitalData = {};
      let templateDietData = {};
      let templateWorkoutData = {};
      let carePlanApiDetails = {};

      console.log("get PatientCarePlanDetails Called - 7" + this.getTime());
      // for vitals
      let vitalTemplateData = {};

      if (carePlans.length > 0) {
        const { care_plans, care_plan_ids, current_careplan_id } =
          await carePlanHelper.getCareplanDataWithImp({
            carePlans,
            userCategory: category,
            doctorId: userCategoryId,
            userRoleId,
          });

        // care plans
        carePlanApiDetails = { ...carePlanApiDetails, ...care_plans };

        console.log("get PatientCarePlanDetails Called - 8" + this.getTime());
        // care plan ids
        carePlanIds = [...care_plan_ids];

        // latest care plan id

        console.log("get PatientCarePlanDetails Called - 9" + this.getTime());
        // get all treatment ids from careplan for templates
        Object.keys(care_plans).forEach((id) => {
          const { details: { treatment_id } = {} } = care_plans[id] || {};
          treatmentIds.push(treatment_id);

          //

          /*
                    "care_plans": {
                          "1": {
                              "basic_info": {
                                  "id": 1,
                                  "doctor_id": 1,
                                  "patient_id": 1,
                                  "care_plan_template_id": null,
                                  "user_role_id": 1
                              },
                              "details": {
                                  "severity_id": 1,
                                  "condition_id": 1,
                                  "treatment_id": 1
                              },*/
          console.log("===========test=========");
          console.log(patient_id);
          console.log(id["basic_info"]["patient_id"]);

          console.log("===========testEnd=========");
          console.log(id);
          if (id["basic_info"]["patient_id"] === patient_id) {
            console.log("===========test=========");
            console.log(patient_id);
            console.log(id["basic_info"]["patient_id"]);
            latestCarePlanId = id["basic_info"]["id"];
            console.log("===========testEnd=========");
            console.log(id);
          }
        });

        console.log("get PatientCarePlanDetails Called - 10" + this.getTime());
      }

      console.log("get PatientCarePlanDetails Called - 11" + this.getTime());
      // get all careplan templates for user(doctor)
      const carePlanTemplates =
        (await carePlanTemplateService.getCarePlanTemplateData({
          user_id: userId,
          treatment_id: treatmentIds,
        })) || [];
      console.log("get PatientCarePlanDetails Called - 12" + this.getTime());
      if (carePlanTemplates.length > 0) {
        console.log("get PatientCarePlanDetails Called - 13" + this.getTime());
        for (let index = 0; index < carePlanTemplates.length; index++) {
          const carePlanTemplate = await CarePlanTemplateWrapper(
            carePlanTemplates[index]
          );

          const {
            care_plan_templates,
            template_appointments,
            template_medications,
            template_vitals,
            template_diets,
            template_workouts,
            vital_templates,
          } = await carePlanTemplate.getReferenceInfoWithImp();

          carePlanTemplateIds = [
            ...new Set([
              ...carePlanTemplateIds,
              ...Object.keys(care_plan_templates),
            ]),
          ];
          // carePlanTemplateIds.push(...Object.keys(care_plan_templates));
          otherCarePlanTemplates = {
            ...otherCarePlanTemplates,
            ...care_plan_templates,
          };
          templateAppointmentData = {
            ...templateAppointmentData,
            ...template_appointments,
          };
          templateMedicationData = {
            ...templateMedicationData,
            ...template_medications,
          };
          templateVitalData = {
            ...templateVitalData,
            ...template_vitals,
          };
          templateDietData = {
            ...templateDietData,
            ...template_diets,
          };
          templateWorkoutData = {
            ...templateWorkoutData,
            ...template_workouts,
          };
          vitalTemplateData = {
            ...vitalTemplateData,
            ...vital_templates,
          };
        }
        console.log("get PatientCarePlanDetails Called - 14" + this.getTime());
      } else {
        console.log("get PatientCarePlanDetails Called - 15" + this.getTime());
        carePlanTemplateIds.push("1");
        otherCarePlanTemplates["1"] = {
          basic_info: {
            id: "1",
            name: "Blank Template",
          },
        };
        console.log("get PatientCarePlanDetails Called - 16" + this.getTime());
      }
      return raiseSuccess(
        res,
        200,
        {
          // added by gaurav start
          //care plan - > care_plans
          care_plans: {
            ...carePlanApiDetails,
          },
          // vital_templates

          // added by gaurav end
          current_careplan_id: latestCarePlanId,
          care_plan_ids: carePlanIds,
          care_plan_template_ids: [...carePlanTemplateIds],
          care_plan_templates: {
            ...otherCarePlanTemplates,
          },

          template_appointments: {
            ...templateAppointmentData,
          },
          template_medications: {
            ...templateMedicationData,
          },
          template_vitals: {
            ...templateVitalData,
          },
          template_diets: {
            ...templateDietData,
          },
          template_workouts: templateWorkoutData,
          vital_templates: {
            ...vitalTemplateData,
          },
        },
        "Patient care plan details fetched successfully"
      );
    } catch (error) {
      // Logger.debug("get careplan 500 error ---> ", error);
      console.log("GET PATIENT DETAILS ERROR careplan --> ", error);
      return raiseServerError(res);
    }
  };

  //TODO: need to delete below function if all working fine in mobile app.
  getPatientCarePlanDetails = async (req, res) => {
    try {
      const { id: patient_id = 1 } = req.params;
      const {
        userDetails: {
          userRoleId = null,
          userId,
          userCategoryId,
          userData: { category } = {},
        } = {},
      } = req;

      if (!patient_id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct patient to continue"
        );
      }

      let doctorData = {};

      let allProvidersData = {};
      let allUserRoleData = {};

      let carePlanApiDetails = {};
      let templateMedicationData = {};
      let template_medication_ids = [];

      let templateAppointmentData = {};
      let template_appointment_ids = [];
      let medicine_ids = [];

      let otherCarePlanTemplates = {};
      let appointmentApiDetails = {};
      let scheduleEventData = {};
      let medicationApiDetails = {};
      let medicineApiData = {};

      let carePlanAppointmentData = {};
      let appointment_ids = [];

      let carePlanMedicationData = {};
      let medication_ids = [];

      let carePlanTemplateIds = [];

      let latestCarePlan = null;
      let latestCarePlanId = null;

      let carePlanIds = [];

      let treatmentIds = [];

      // for care plan templates
      let templateVitalData = {};
      let templateDietData = {},
        foodItemDetailsApiData = {},
        foodItemsApiData = {},
        portionsApiData = {};

      let templateWorkoutData = {},
        exerciseDetailData = {},
        exerciseData = {},
        repetitionData = {};

      // for vitals
      let vitalTemplateData = {};

      // get all careplans attached to patient
      const carePlans =
        (await carePlanService.getMultipleCarePlanByData({
          patient_id,
          user_role_id: userRoleId,
        })) || [];

      if (carePlans.length > 0) {
        const {
          care_plans,
          medicines,
          appointments,
          medications,
          schedule_events,
          doctors,
          providers = {},
          user_roles = {},
          care_plan_ids,
          current_careplan_id,
        } = await carePlanHelper.getCareplanData({
          carePlans,
          userCategory: category,
          doctorId: userCategoryId,
          userRoleId,
        });

        // care plans
        carePlanApiDetails = { ...carePlanApiDetails, ...care_plans };

        // care plan ids
        carePlanIds = [...care_plan_ids];

        // latest care plan id
        latestCarePlanId = current_careplan_id;

        // doctors
        doctorData = { ...doctorData, ...doctors };

        // appointments
        appointmentApiDetails = { ...appointmentApiDetails, ...appointments };

        // medications
        medicationApiDetails = { ...medicationApiDetails, ...medications };

        // schedule events
        scheduleEventData = { ...scheduleEventData, ...schedule_events };

        // medicines
        medicineApiData = { ...medicineApiData, ...medicines };

        allProvidersData = { ...allProvidersData, ...providers };

        allUserRoleData = { ...allUserRoleData, ...user_roles };

        // get all treatment ids from careplan for templates
        Object.keys(care_plans).forEach((id) => {
          const { details: { treatment_id } = {} } = care_plans[id] || {};
          treatmentIds.push(treatment_id);
        });
      }

      // get all careplan templates for user(doctor)
      const carePlanTemplates =
        (await carePlanTemplateService.getCarePlanTemplateData({
          user_id: userId,
          treatment_id: treatmentIds,
        })) || [];

      if (carePlanTemplates.length > 0) {
        for (let index = 0; index < carePlanTemplates.length; index++) {
          const carePlanTemplate = await CarePlanTemplateWrapper(
            carePlanTemplates[index]
          );

          const {
            care_plan_templates,
            template_appointments,
            template_medications,
            template_vitals,
            template_diets,
            template_workouts,
            exercise_details,
            exercises,
            repetitions,
            vital_templates,
            food_items,
            food_item_details,
            portions,
            medicines,
          } = await carePlanTemplate.getReferenceInfo();

          carePlanTemplateIds = [
            ...new Set([
              ...carePlanTemplateIds,
              ...Object.keys(care_plan_templates),
            ]),
          ];

          // carePlanTemplateIds.push(...Object.keys(care_plan_templates));
          otherCarePlanTemplates = {
            ...otherCarePlanTemplates,
            ...care_plan_templates,
          };
          templateAppointmentData = {
            ...templateAppointmentData,
            ...template_appointments,
          };
          templateMedicationData = {
            ...templateMedicationData,
            ...template_medications,
          };

          templateVitalData = {
            ...templateVitalData,
            ...template_vitals,
          };

          templateDietData = {
            ...templateDietData,
            ...template_diets,
          };

          foodItemDetailsApiData = {
            ...foodItemDetailsApiData,
            ...food_item_details,
          };

          foodItemsApiData = {
            ...foodItemsApiData,
            ...food_items,
          };

          portionsApiData = {
            ...portionsApiData,
            ...portions,
          };

          templateWorkoutData = {
            ...templateWorkoutData,
            ...template_workouts,
          };

          exerciseDetailData = {
            ...exerciseDetailData,
            ...exercise_details,
          };

          exerciseData = {
            ...exerciseData,
            ...exercises,
          };

          repetitionData = {
            ...repetitionData,
            ...repetitions,
          };

          vitalTemplateData = {
            ...vitalTemplateData,
            ...vital_templates,
          };

          medicineApiData = { ...medicineApiData, ...medicines };
        }
      } else {
        carePlanTemplateIds.push("1");
        otherCarePlanTemplates["1"] = {
          basic_info: {
            id: "1",
            name: "Blank Template",
          },
        };
      }
      let exerciseContentData = {};
      const exerciseContentService = new ExerciseContentService();

      for (let each in exerciseData) {
        const exercise = exerciseData[each] || {};
        const { basic_info: { id = null } = {} } = exercise || {};
        const exerciseContentExists =
          (await exerciseContentService.findOne({
            exercise_id: id,
            creator_id: userCategoryId,
            creator_type: category,
          })) || null;

        if (exerciseContentExists) {
          const exerciseContentWrapper = await ExerciseContentWrapper({
            exercise_id: id,
            auth: { creator_id: userCategoryId, creator_type: category },
          });
          exerciseContentData[exerciseContentWrapper.getId()] =
            exerciseContentWrapper.getBasicInfo();
        }
      }

      const symptomData =
        (await SymptomService.getAllByData({ patient_id })) || [];

      let symptomDetails = {};
      let uploadDocumentData = {};

      if (symptomData.length > 0) {
        for (const data of symptomData) {
          const symptom = await SymptomWrapper({ data });
          const { symptoms } = await symptom.getAllInfo();
          const { upload_documents } = await symptom.getReferenceInfo();
          symptomDetails = { ...symptomDetails, ...symptoms };
          uploadDocumentData = { ...uploadDocumentData, ...upload_documents };
        }
      }

      /*
            care_plans: {
                  ...carePlanApiDetails,
                },
                care_plan_templates: {
                  ...otherCarePlanTemplates,
                },
                care_plan_template_ids: [...carePlanTemplateIds],
                current_careplan_id: latestCarePlanId,

                template_appointments: {
                  ...templateAppointmentData,
                },
                template_medications: {
                  ...templateMedicationData,
                },
                vital_templates: {
                  ...vitalTemplateData,
                },
                */
      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: {
            ...carePlanApiDetails,
          },
          care_plan_templates: {
            ...otherCarePlanTemplates,
          },
          care_plan_template_ids: [...carePlanTemplateIds],
          current_careplan_id: latestCarePlanId,
          medicines: {
            ...medicineApiData,
          },
          template_appointments: {
            ...templateAppointmentData,
          },
          template_medications: {
            ...templateMedicationData,
          },
          care_plan_ids: carePlanIds,
          doctors: {
            ...doctorData,
          },
          appointments: {
            ...appointmentApiDetails,
          },
          medications: {
            ...medicationApiDetails,
          },
          symptoms: {
            ...symptomDetails,
          },
          upload_documents: {
            ...uploadDocumentData,
          },
          template_vitals: {
            ...templateVitalData,
          },
          template_diets: {
            ...templateDietData,
          },
          food_items: {
            ...foodItemsApiData,
          },
          food_item_details: {
            ...foodItemDetailsApiData,
          },
          portions: {
            ...portionsApiData,
          },
          providers: {
            ...allProvidersData,
          },
          user_roles: {
            ...allUserRoleData,
          },

          template_workouts: templateWorkoutData,
          exercise_details: exerciseDetailData,
          exercises: exerciseData,
          exercise_contents: exerciseContentData,
          repetitions: repetitionData,

          vital_templates: {
            ...vitalTemplateData,
          },
          schedule_events: {
            ...scheduleEventData,
          },
        },
        "Patient care plan details fetched successfully"
      );
    } catch (error) {
      Logger.debug("get careplan 500 error ---> ", error);
      return this.raiseServerError(res);
    }
  };

  getPatientSymptoms = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("req.params ----->", req.params);
      const { params: { patient_id } = {}, userDetails: { userId } = {} } = req;

      const symptomData = await SymptomService.getAllByData({ patient_id });

      let uploadDocumentData = {};
      const dateWiseSymptoms = {};
      let partWiseSymptoms = {};

      const sideWiseParts = {};
      let symptomDates = [];
      let symptomParts = [];

      const frontPart = {};
      const backPart = {};

      if (symptomData.length > 0) {
        for (const data of symptomData) {
          const symptom = await SymptomWrapper({ data });

          Logger.debug("symptom created date ---> ", symptom.getCreatedDate());

          // DATA FORMATTED FOR DATE ORDER
          const symptomDetails = await symptom.getDateWiseInfo();
          const { upload_documents } = await symptom.getReferenceInfo();

          if (symptomDates.indexOf(symptom.getCreatedDate()) === -1) {
            symptomDates.push(symptom.getCreatedDate());
          }
          uploadDocumentData = { ...uploadDocumentData, ...upload_documents };
          if (dateWiseSymptoms.hasOwnProperty(symptom.getCreatedDate())) {
            dateWiseSymptoms[symptom.getCreatedDate()].push(symptomDetails);
          } else {
            dateWiseSymptoms[symptom.getCreatedDate()] = [];
            dateWiseSymptoms[symptom.getCreatedDate()].push(symptomDetails);
          }
        }

        symptomDates.sort((a, b) => {
          if (moment(a).isBefore(moment(b))) return 1;

          if (moment(a).isAfter(moment(b))) return -1;

          return 0;
        });
        symptomDates.forEach((date) => {
          const data = dateWiseSymptoms[date] || [];
          data.sort((activityA, activityB) => {
            const { createdAt: a } = activityA;
            const { createdAt: b } = activityB;
            if (moment(a).isBefore(moment(b))) return 1;

            if (moment(a).isAfter(moment(b))) return -1;

            return 0;
          });
        });

        return raiseSuccess(
          res,
          200,
          {
            timeline_symptoms: {
              ...dateWiseSymptoms,
            },
            // symptom_parts: {
            //   ...sideWiseParts
            // },
            upload_documents: {
              ...uploadDocumentData,
            },
            symptom_dates: symptomDates,
            // symptom_part_ids: symptomParts
          },
          "Symptoms data fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Patient has not updated any symptoms yet for the treatment"
        );
      }
    } catch (error) {
      Logger.debug("getPatientSymptoms 500 error", error);
      return raiseServerError(res);
    }
  };

  getPatientPartSymptoms = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("req.params ----->", req.params);
      const { query: { duration = "5" } = {}, params: { patient_id } = {} } =
        req;

      const currentTime = moment().utc().toISOString();
      const historyTime = moment()
        .subtract(duration, "days")
        .utc()
        .toISOString();

      const symptomData = await SymptomService.getFilteredData({
        patient_id,
        start_time: historyTime,
        end_time: currentTime,
      });

      let uploadDocumentData = {};

      const sideWiseParts = {};
      let symptomDates = [];
      let symptomParts = [];

      const frontPart = {};
      const backPart = {};

      if (symptomData.length > 0) {
        for (const data of symptomData) {
          const symptom = await SymptomWrapper({ data });
          const symptomDetails = await symptom.getDateWiseInfo();

          // DATA FORMATTED FOR SIDE AND PART WISE ORDER

          if (symptom.getSide() === BODY_VIEW.FRONT) {
            if (frontPart.hasOwnProperty(symptom.getPart())) {
              frontPart[symptom.getPart()].push(symptomDetails);
            } else {
              frontPart[symptom.getPart()] = [];
              frontPart[symptom.getPart()].push(symptomDetails);
            }
          } else {
            if (backPart.hasOwnProperty(symptom.getPart())) {
              backPart[symptom.getPart()].push(symptomDetails);
            } else {
              backPart[symptom.getPart()] = [];
              backPart[symptom.getPart()].push(symptomDetails);
            }
          }

          const { upload_documents } = await symptom.getReferenceInfo();
          uploadDocumentData = { ...uploadDocumentData, ...upload_documents };
          symptomDates.push(symptom.getCreatedDate());
          symptomParts.push(symptom.getPart());
        }

        for (const side of Object.values(BODY_VIEW)) {
          if (side === BODY_VIEW.FRONT) {
            sideWiseParts[side] = { ...frontPart };
          } else {
            sideWiseParts[side] = { ...backPart };
          }
        }

        Object.values(BODY_VIEW).forEach((side) => {
          const sideData = sideWiseParts[side] || {};
          Object.keys(sideData).forEach((part) => {
            const data = sideData[part] || [];
            data.sort((activityA, activityB) => {
              const { createdAt: a } = activityA;
              const { createdAt: b } = activityB;
              if (moment(a).isBefore(moment(b))) return 1;

              if (moment(a).isAfter(moment(b))) return -1;

              return 0;
            });
          });
        });

        return raiseSuccess(
          res,
          200,
          {
            symptom_parts: {
              ...sideWiseParts,
            },
            upload_documents: {
              ...uploadDocumentData,
            },
          },
          "Symptoms data fetched successfully"
        );
      } else {
        Object.values(BODY_VIEW).forEach((side) => {
          sideWiseParts[side] = [];
        });
        return raiseSuccess(
          res,
          200,
          {
            symptom_parts: {
              ...sideWiseParts,
            },
            upload_documents: {
              ...uploadDocumentData,
            },
          },
          "Patient has not updated any symptoms yet for the treatment"
        );
      }
    } catch (error) {
      Logger.debug("getPatientPartSymptoms 500 error", error);
      return raiseServerError(res);
    }
  };

  getPatientVitals = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("34554321345324", req.params);
      const { params: { patient_id } = {} } = req;

      const carePlans = await carePlanService.getMultipleCarePlanByData({
        patient_id,
      });

      let allVitals = [];

      for (const carePlan of carePlans) {
        const vitals = await VitalService.getAllByData({
          care_plan_id: carePlan.get("id"),
        });

        allVitals = [...allVitals, ...vitals];
      }

      let vitalDetails = {};
      let vitalTemplateDetails = {};
      let carePlanTemplateDetails = {};

      if (allVitals.length > 0) {
        for (const vitalData of allVitals) {
          const vital = await VitalWrapper(vitalData);
          const { vitals } = await vital.getAllInfo();
          const { vital_templates, care_plans } =
            await vital.getReferenceInfo();

          vitalDetails = { ...vitalDetails, ...vitals };

          vitalTemplateDetails = {
            ...vitalTemplateDetails,
            ...vital_templates,
          };
          carePlanTemplateDetails = {
            ...carePlanTemplateDetails,
            ...care_plans,
          };
        }

        return raiseSuccess(
          res,
          200,
          {
            vitals: {
              ...vitalDetails,
            },
            vital_templates: {
              ...vitalTemplateDetails,
            },
            care_plans: {
              ...carePlanTemplateDetails,
            },
            vital_ids: Object.keys(vitalDetails),
          },
          "Vitals fetched successfully for the patient"
        );
      } else {
        return raiseSuccess(
          res,
          200,
          {},
          "There are no added vitals for the patient"
        );
      }
    } catch (error) {
      Logger.debug("getPatientVitals 500 error", error);
      return raiseServerError(res);
    }
  };

  searchPatient = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      Logger.info(`searchPatient request query : ${req.query.value}`);
      const { query: { value = "" } = {} } = req;

      const users = await userService.getPatientByMobile(value);
      if (users.length > 0) {
        let userDetails = {};
        let patientDetails = {};
        const patientIds = [];
        for (const userData of users) {
          const user = await UserWrapper(userData.get());
          const { users, patients, patient_id } = await user.getReferenceInfo();
          patientIds.push(patient_id);
          userDetails = { ...userDetails, ...users };
          patientDetails = { ...patientDetails, ...patients };
        }

        return raiseSuccess(
          res,
          200,
          {
            users: {
              ...userDetails,
            },
            patients: {
              ...patientDetails,
            },
            patient_ids: patientIds,
          },
          "Patients fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          201,
          {},
          "No patient linked with the given phone number"
        );
      }
    } catch (error) {
      Logger.debug("searchPatient 500 error", error);
      return raiseServerError(res);
    }
  };

  patientConsentRequest = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id: patient_id } = {}, userDetails: { userId } = {} } =
        req;

      const patient = await PatientWrapper(null, patient_id);

      // const { users } = await patient.getReferenceInfo();
      const users = await UserWrapper(null, patient.getUserId());

      const { basic_info: { prefix, mobile_number, email } = {} } =
        users.getBasicInfo();

      Logger.debug("patient_id ---> ", mobile_number);

      const otp = generateOTP();

      await otpVerificationService.delete({
        user_id: patient.getUserId(),
      });

      await otpVerificationService.create({
        user_id: patient.getUserId(),
        otp,
      });

      if (process.config.app.env === "development") {
        const emailPayload = {
          title: "OTP Consent verification for patient",
          toAddress: process.config.app.developer_email,
          templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
          templateData: {
            title: "Patient",
            mainBodyText: "OTP for the AdhereLive patient consent is",
            subBodyText: otp,
            host: process.config.WEB_URL,
            contactTo: process.config.app.support_email,
          },
        };
        Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
      } else {
        if (email) {
          const emailPayload = {
            title: "OTP Consent verification for patient",
            toAddress: email,
            templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
            templateData: {
              title: "Patient",
              mainBodyText: "OTP for the AdhereLive patient consent is",
              subBodyText: otp,
              host: process.config.WEB_URL,
              contactTo: process.config.app.support_email,
            },
          };
          Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
        }

        const smsPayload = {
          // countryCode: prefix,
          phoneNumber: `+${prefix}${mobile_number}`, // mobile_number
          message: `<#> Hello from AdhereLive! Your OTP for consent request is ${otp}`,
        };

        Proxy_Sdk.execute(EVENTS.SEND_SMS, smsPayload);
      }

      return raiseSuccess(
        res,
        200,
        {
          user_id: patient.getUserId(),
        },
        "OTP sent successfully"
      );
    } catch (error) {
      Logger.debug("patientConsentRequest 500 error", error);
      return raiseServerError(res);
    }
  };

  patientConsentVerification = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body: { otp, user_id } = {},
        userDetails: { userRoleId, userId, userData: { category } = {} } = {},
      } = req;

      // service instance
      const consentService = new ConsentService();

      const otpVerification = await otpVerificationService.getOtpByData({
        otp,
        user_id,
      });

      if (otpVerification.length > 0) {
        // helper variables
        let doctorData = {};
        const doctorIds = [];
        let consentDoctorId = null;

        const destroyOtp = await otpVerificationService.delete({ user_id });

        const user = await UserWrapper(null, user_id);
        const { patient_id } = await user.getReferenceInfo();

        const patient = await PatientWrapper(null, patient_id);

        let authDoctor = null;

        if (
          category === USER_CATEGORY.DOCTOR ||
          category === USER_CATEGORY.HSP
        ) {
          authDoctor = await DoctorService.getDoctorByData({ user_id: userId });
        }

        const consentData = await consentService.create({
          type: CONSENT_TYPE.CARE_PLAN,
          doctor_id: authDoctor.get("id"),
          patient_id,
          user_role_id: userRoleId,
        });
        const consents = await ConsentWrapper({ data: consentData });

        const carePlans = await carePlanService.getCarePlanByData({
          patient_id,
        });

        if (carePlans.length > 0) {
          for (let i = 0; i < carePlans.length; i++) {
            const carePlan = await CarePlanWrapper(carePlans[i]);
            doctorIds.push(carePlan.getDoctorId());
          }
        }

        if (doctorIds.length > 0) {
          const doctors = await DoctorService.getAllDoctorByData({
            id: doctorIds,
          });

          if (doctors.length > 0) {
            for (let i = 0; i < doctors.length; i++) {
              const doctor = await DoctorWrapper(doctors[i]);
              doctorData[doctor.getDoctorId()] = await doctor.getAllInfo();

              if (doctor.getUserId() === userId) {
                consentDoctorId = doctor.getDoctorId();
              }
            }
          }
        }

        return raiseSuccess(
          res,
          200,
          {
            doctors: {
              ...doctorData,
            },
            patients: {
              [patient.getPatientId()]: {
                ...patient.getBasicInfo(),
                consent_ids: [consents.getConsentId()],
              },
            },
            consents: {
              [consents.getConsentId()]: consents.getBasicInfo(),
            },
          },
          "Consent approved"
        );
      } else {
        return raiseClientError(
          res,
          400,
          {},
          "Otp not correct. Please try again."
        );
      }
    } catch (error) {
      Logger.debug("patientConsentVerification 500 error", error);
      return raiseServerError(res);
    }
  };

  searchPatientForDoctor = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails: { userRoleId = null, userId } = {} } = req;
      const { query: { value = "" } = {} } = req;

      const isNumber = !isNaN(value);
      let doctorData = {};
      const patientIdsForThisDoc = [];
      const userIdsForForPatientForDoc = [];
      const doctor = await DoctorService.getDoctorByUserId(parseInt(userId));
      const doctorDetails = await DoctorWrapper(doctor);
      doctorData[doctorDetails.getDoctorId()] =
        await doctorDetails.getAllInfo();
      const { care_plan_ids: all_care_plan_ids = [] } =
        doctorData[doctorDetails.getDoctorId()];
      const care_plan_ids = all_care_plan_ids[userRoleId.toString()] || [];

      for (const each_id of care_plan_ids) {
        let thisCarePlanData = await userService.getCarePlanData(each_id);
        const { dataValues: { patient_id = null } = {} } = thisCarePlanData;
        patientIdsForThisDoc.push(patient_id);
        const { dataValues: { user_id = null } = {} } =
          await patientService.getPatientByIdForPatientSearch(patient_id);
        userIdsForForPatientForDoc.push(user_id);
      }

      if (!isNumber) {
        const allPatients = await patientService.getPatientForDoctor(
          value,
          patientIdsForThisDoc
        );
        if (allPatients.length > 0) {
          let userDetails = {};
          let patientDetails = {};
          const patientIds = [];

          for (const patientData of allPatients) {
            const patient = await PatientWrapper(patientData, null);
            const { patients, users } = await patient.getReferenceInfo();
            const { basic_info: { id: current_patient_id = null } = {} } =
              Object.values(patients)[0];
            patientIds.push(current_patient_id);
            userDetails = { ...userDetails, ...users };
            patientDetails = { ...patientDetails, ...patients };
          }

          return raiseSuccess(
            res,
            200,
            {
              users: {
                ...userDetails,
              },
              patients: {
                ...patientDetails,
              },
              patient_ids: patientIds,
            },
            "Patients fetched successfully"
          );
        } else {
          return raiseSuccess(
            res,
            201,
            {},
            "No patient linked with the input "
          );
        }
      } else {
        const users = await patientService.getPatientByMobileForDoctor(
          value,
          userIdsForForPatientForDoc
        );

        if (users.length > 0) {
          let userDetails = {};
          let patientDetails = {};
          const patientIds = [];
          for (const userData of users) {
            const user = await UserWrapper(userData.get());

            const { users, patients, patient_id } =
              await user.getReferenceInfo();
            patientIds.push(patient_id);
            userDetails = { ...userDetails, ...users };
            patientDetails = { ...patientDetails, ...patients };
          }

          return raiseSuccess(
            res,
            200,
            {
              users: {
                ...userDetails,
              },
              patients: {
                ...patientDetails,
              },
              patient_ids: patientIds,
            },
            "Patients fetched successfully"
          );
        } else {
          return raiseSuccess(
            res,
            201,
            {},
            "No patient linked with the given phone number"
          );
        }
      }
    } catch (error) {
      Logger.debug("searchPatientForDoctor 500 error", error);
      return raiseServerError(res);
    }
  };

  generatePrescription = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { care_plan_id = null } = req.params;
      const {
        userDetails: {
          userId = null,
          userRoleId = null,
          userData: { category = "" } = {},
        } = {},
        permissions = [],
      } = req;

      const dietService = new DietService();
      const workoutService = new WorkoutService();

      const carePlanId = parseInt(care_plan_id);

      let dataForPdf = {};

      let usersData = {};
      let userRolesData = {};
      let qualifications = {};
      let degrees = {};
      let registrationsData = {};
      let conditions = {};
      let medications = {};
      let medicines = {};
      let nextAppointmentDuration = null;

      if (!carePlanId) {
        return raiseClientError(res, 422, {}, "Invalid Care plan.");
      }

      console.log("genpre called");

      const carePlan = await carePlanService.getCarePlanById(carePlanId);
      const carePlanData = await CarePlanWrapper(carePlan);

      const doctorUserRoleId = carePlanData.getUserRoleId();
      /*
      if (
        `${doctorUserRoleId}` !== `${userRoleId}` &&
        category !== USER_CATEGORY.PATIENT
      ) {
        return raiseClientError(
          res,
          422,
          {},
          "You don't have the rights to access this prescription."
        );
      }*/
      const userRoles = await userRolesService.getSingleUserRoleByData({
        id: doctorUserRoleId,
      });
      if (userRoles) {
        const userRolesWrapper = await UserRolesWrapper(userRoles);
        userRolesData = {
          ...userRolesData,
          [doctorUserRoleId]: userRolesWrapper.getBasicInfo(),
        };
      }

      const carePlanCreatedDate = carePlanData.getCreatedAt();
      const carePlanPatientId = carePlanData.getPatientId();

      const {
        details: { condition_id = null } = {},
        medication_ids = [],
        appointment_ids = [],
        diet_ids = [],
        workout_ids = [],
      } = await carePlanData.getAllInfo();

      const conditionData = await conditionService.getByData({
        id: condition_id,
      });
      if (conditionData) {
        const condition = await ConditionWrapper(conditionData);
        conditions[condition_id] = condition.getBasicInfo();
      }

      // if (permissions.includes(PERMISSIONS.MEDICATIONS.ADD)) {
      console.log("medication_ids", medication_ids);
      for (const medicationId of medication_ids) {
        const medication = await medicationReminderService.getMedication({
          id: medicationId,
        });

        if (medication) {
          const medicationWrapper = await MReminderWrapper(medication);
          const medicineId = medicationWrapper.getMedicineId();
          const medicineData = await medicineService.getMedicineByData({
            id: medicineId,
          });

          console.log("genpre-2-called", medicineData);

          for (const medicine of medicineData) {
            console.log("genpre-3-called");
            const medicineWrapper = await MedicineApiWrapper(medicine);
            medicines = {
              ...medicines,
              ...{
                [medicineWrapper.getMedicineId()]: medicineWrapper.getAllInfo(),
              },
            };
          }
          medications = {
            ...medications,
            ...{ [medicationId]: medicationWrapper.getBasicInfo() },
          };
        }
      }
      // }

      const now = moment();
      let nextAppointment = null;
      let suggestedInvestigations = [];
      for (const appointmentId of appointment_ids) {
        const appointment = await appointmentService.getAppointmentById(
          appointmentId
        );

        if (appointment) {
          const appointmentWrapper = await AppointmentWrapper(appointment);

          const startDate = appointmentWrapper.getStartTime();
          const startDateObj = moment(startDate);
          const { organizer } = await appointmentWrapper.getBasicInfo();
          const diff = startDateObj.diff(now);

          if (diff > 0) {
            if (!nextAppointment || nextAppointment.diff(startDateObj) > 0) {
              nextAppointment = startDateObj;
            }
          }

          const { type } = appointmentWrapper.getDetails() || {};

          if (type !== CONSULTATION) {
            const { type_description = "", radiology_type = "" } =
              appointmentWrapper.getDetails() || {};
            suggestedInvestigations.push({
              type,
              type_description,
              radiology_type,
              start_date: startDate,
              organizer,
            });
          }
        }
      }

      let dietApiData = {},
        dietIds = [],
        workoutApiData = {},
        workoutIds = [];

      // diet
      for (const id of diet_ids) {
        const diet = await dietService.getByData({ id });

        if (diet) {
          const dietData = await dietService.findOne({ id });
          const dietWrapper = await DietWrapper({ data: dietData });
          const expired_on = await dietWrapper.getExpiredOn();

          if (expired_on) {
            continue;
          }

          const referenceInfo = await dietWrapper.getReferenceInfo();

          let dietFoodGroupsApidata = {},
            dietBasicInfo = {};

          dietBasicInfo[dietWrapper.getId()] = await dietWrapper.getBasicInfo();

          const {
            diet_food_group_mappings = {},
            food_groups = {},
            food_items = {},
            food_item_details = {},
          } = referenceInfo || {};

          const timeWise = await DietHelper.getTimeWiseDietFoodGroupMappings({
            diet_food_group_mappings,
          });

          for (let eachTime in timeWise) {
            const { mappingIds = [] } = timeWise[eachTime] || {};

            for (let ele of mappingIds) {
              let primary = null,
                related_diet_food_group_mapping_ids = [];

              if (Array.isArray(ele)) {
                ele.sort(function (a, b) {
                  return a - b;
                });

                primary = ele[0] || null;
                related_diet_food_group_mapping_ids = ele.slice(1);
              } else {
                primary = ele;
              }

              let currentfodmattedData = {};

              // const related_diet_food_group_mapping_ids = mappingIds.slice(1);
              let similarFoodGroups = [],
                notes = "";

              const current_mapping = diet_food_group_mappings[primary] || {};
              const { basic_info: { time = "", food_group_id = null } = {} } =
                current_mapping;
              const {
                basic_info: { food_item_detail_id = null, serving = null } = {},
                details = {},
              } = food_groups[food_group_id] || {};
              const { basic_info: { portion_id = null } = {} } =
                food_item_details[food_item_detail_id] || {};

              if (details) {
                const { notes: detail_notes = "" } = details;
                notes = detail_notes;
              }
              if (related_diet_food_group_mapping_ids.length) {
                for (
                  let i = 0;
                  i < related_diet_food_group_mapping_ids.length;
                  i++
                ) {
                  const similarMappingId =
                    related_diet_food_group_mapping_ids[i];

                  const {
                    basic_info: {
                      food_group_id: similar_food_group_id = null,
                    } = {},
                  } = diet_food_group_mappings[similarMappingId] || {};
                  const {
                    basic_info: {
                      food_item_detail_id: similar_food_item_detail_id = null,
                      serving: similar_serving = null,
                    } = {},
                    details: similar_details = {},
                  } = food_groups[similar_food_group_id] || {};

                  const {
                    basic_info: { portion_id: similar_portion_id = null } = {},
                  } = food_item_details[similar_food_item_detail_id] || {};

                  let similar_notes = "";
                  if (similar_details) {
                    const { notes = "" } = similar_details || {};
                    similar_notes = notes;
                  }

                  const similarData = {
                    serving: similar_serving,
                    portion_id: similar_portion_id,
                    food_item_detail_id: similar_food_item_detail_id,
                    food_group_id: similar_food_group_id,
                    notes: similar_notes,
                  };

                  similarFoodGroups.push(similarData);
                  // delete diet_food_group_mappings[similarMappingId];
                }
              }

              currentfodmattedData = {
                serving,
                portion_id,
                food_group_id,
                notes,
                food_item_detail_id,
                similar: [...similarFoodGroups],
              };

              const currentDietDataForTime = dietFoodGroupsApidata[time] || [];
              currentDietDataForTime.push(currentfodmattedData);

              dietFoodGroupsApidata[`${time}`] = [...currentDietDataForTime];
            }
          }

          dietApiData[id] = {
            diets: {
              ...dietBasicInfo,
            },
            diet_food_groups: {
              ...dietFoodGroupsApidata,
            },
            food_items,
            food_item_details,
          };

          dietIds.push(id);
        }
      }

      for (const id of workout_ids) {
        const workout = await workoutService.findOne({ id });

        if (workout) {
          const workoutWrapper = await WorkoutWrapper({ data: workout });
          const expired_on = await workoutWrapper.getExpiredOn();
          if (expired_on) {
            continue;
          }

          let workout_exercise_groups = [];
          const { exercises, exercise_groups, exercise_details } =
            await workoutWrapper.getReferenceInfo();

          for (const exerciseGroupId of Object.keys(exercise_groups)) {
            const {
              basic_info: { id: exercise_group_id, exercise_detail_id } = {},
              sets,
              details = {},
            } = exercise_groups[exerciseGroupId] || {};

            const { basic_info: { exercise_id } = {} } =
              exercise_details[exercise_detail_id] || {};

            workout_exercise_groups.push({
              exercise_group_id,
              exercise_detail_id,
              sets,
              ...details,
            });
          }

          workoutApiData[workoutWrapper.getId()] = {
            ...(await workoutWrapper.getReferenceInfo()),
            workout_exercise_groups,
          };

          workoutIds.push(workoutWrapper.getId());
        }
      }

      // sort suggested investigations
      const sortedInvestigations = suggestedInvestigations.sort((a, b) => {
        const { start_date: aStartDate } = a || {};
        const { start_date: bStartDate } = b || {};

        if (moment(bStartDate).diff(moment(aStartDate), "minutes") > 0) {
          return 1;
        } else {
          return -1;
        }
      });

      Logger.debug("Sorted investigations ", sortedInvestigations);

      if (nextAppointment) {
        nextAppointmentDuration =
          nextAppointment.diff(now, "days") !== 0
            ? `${nextAppointment.diff(now, "days")} days`
            : `${nextAppointment.diff(now, "hours")} hours`;
      }

      let patientUserId = userId;
      let patient = null;
      if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
        patient = await patientService.getPatientById({
          id: carePlanPatientId,
        });
      } else {
        patient = await patientService.getPatientByUserId(userId);
      }

      const patientData = await PatientWrapper(patient);

      const timingPreference = await UserPreferenceService.getPreferenceByData({
        user_id: patientData.getUserId(),
      });
      const userPrefOptions = await UserPreferenceWrapper(timingPreference);
      const { timings: userTimings = {} } = userPrefOptions.getAllDetails();
      const timings = DietHelper.getTimings(userTimings);

      // if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
      //   patientUserId = patientData.getUserId();
      // }
      let doctor_id = "";
      if (category === USER_CATEGORY.DOCTOR) {
        patient = await patientService.getPatientById({
          id: carePlanPatientId,
        });
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
      } else if (category === USER_CATEGORY.HSP) {
        patient = await patientService.getPatientById({
          id: carePlanPatientId,
        });
        ({ doctor_id } = await carePlanData.getReferenceInfo());
      } else {
        patient = await patientService.getPatientByUserId(userId);
        ({ doctor_id } = await carePlanData.getReferenceInfo());
      }

      const { doctors } = await carePlanData.getReferenceInfo();

      const {
        [doctor_id]: {
          basic_info: { signature_pic = "", full_name = "" } = {},
        } = {},
      } = doctors;

      checkAndCreateDirectory(S3_DOWNLOAD_FOLDER);

      const doctorSignImage = `${S3_DOWNLOAD_FOLDER}/${full_name}.jpeg`;

      const downloadImage = await downloadFileFromS3(
        getFilePath(signature_pic),
        doctorSignImage
      );

      const doctorQualifications =
        await qualificationService.getQualificationsByDoctorId(doctor_id);

      await doctorQualifications.forEach(async (doctorQualification) => {
        const doctorQualificationWrapper = await QualificationWrapper(
          doctorQualification
        );
        const degreeId = doctorQualificationWrapper.getDegreeId();
        const degreeWrapper = await DegreeWrapper(null, degreeId);
        degrees[degreeId] = degreeWrapper.getBasicInfo();
      });

      const doctorRegistrations =
        await doctorRegistrationService.getRegistrationByDoctorId(doctor_id);

      for (const doctorRegistration of doctorRegistrations) {
        const registrationData = await RegistrationWrapper(doctorRegistration);
        const council_id = registrationData.getCouncilId();
        const councilWrapper = await CouncilWrapper(null, council_id);

        const regData = registrationData.getBasicInfo();
        const { basic_info: { number = "" } = {} } = regData;
        registrationsData[registrationData.getDoctorRegistrationId()] = {
          number,
          council: councilWrapper.getBasicInfo(),
        };
      }

      const {
        [`${doctor_id}`]: { basic_info: { user_id: doctorUserId = null } = {} },
      } = doctors;

      const user_ids = [doctorUserId, patientUserId];
      for (const id of user_ids) {
        const intId = parseInt(id);
        const user = await userService.getUserById(intId);

        if (user) {
          const userWrapper = await UserWrapper(user.get());
          usersData = { ...usersData, ...{ [id]: userWrapper.getBasicInfo() } };
        }
      }

      // provider data
      const {
        [doctorUserRoleId]: {
          basic_info: { linked_id: provider_id = null } = {},
        } = {},
      } = userRolesData || {};

      let providerData = {};

      let providerIcon = "";
      let providerPrescriptionDetails = "";
      if (provider_id) {
        const providerWrapper = await ProviderWrapper(null, provider_id);
        const { providers, users } = await providerWrapper.getReferenceInfo();

        const { details: { icon = null, prescription_details = "" } = {} } =
          providers[provider_id] || {};
        checkAndCreateDirectory(S3_DOWNLOAD_FOLDER_PROVIDER);
        providerPrescriptionDetails = prescription_details;
        if (icon) {
          providerIcon = `${S3_DOWNLOAD_FOLDER_PROVIDER}/provider-${provider_id}-icon.jpeg`;

          const downloadProviderImage = await downloadFileFromS3(
            getFilePath(icon),
            providerIcon
          );
        }

        providerData = { ...providers[provider_id] };
        usersData = { ...usersData, ...users };
      }

      const portionServiceService = new PortionServiceService();
      const allPortions = await portionServiceService.getAll();
      let portionApiData = {};

      for (let each in allPortions) {
        const portion = allPortions[each] || {};
        const portionWrapper = await PortionWrapper({ data: portion });
        portionApiData[portionWrapper.getId()] = portionWrapper.getBasicInfo();
      }

      const repetitionService = new RepetitionService();
      let repetitionApiData = {};

      const { count, rows: repetitions = [] } =
        (await repetitionService.findAndCountAll()) || {};
      if (count) {
        for (let index = 0; index < repetitions.length; index++) {
          const { id, type } = repetitions[index] || {};
          repetitionApiData[id] = { id, type };
        }
      }

      dataForPdf = {
        users: { ...usersData },
        medications,
        medicines,
        // ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD) && {
        //   medications,
        // }),
        // ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD) && { medicines }),
        care_plans: {
          [carePlanData.getCarePlanId()]: {
            ...carePlanData.getBasicInfo(),
          },
        },
        providers: providerData,
        doctors,
        doctor_id,
        degrees,
        portions: { ...portionApiData },
        repetitions: { ...repetitionApiData },
        providerIcon,
        providerPrescriptionDetails,
        conditions,
        registrations: registrationsData,
        creationDate: carePlanCreatedDate,
        suggestedInvestigations: sortedInvestigations,
        nextAppointmentDuration,
        patients: {
          ...{ [patientData.getPatientId()]: patientData.getBasicInfo() },
        },
        diets_formatted_data: { ...dietApiData },
        workouts_formatted_data: { ...workoutApiData },
        workout_ids: workoutIds,
        diet_ids: dietIds,
        timings,
        currentTime: getDoctorCurrentTime(doctorUserId).format(
          "Do MMMM YYYY, hh:mm a"
        ),
      };

      checkAndCreateDirectory(PRESCRIPTION_PDF_FOLDER);
      const pdfFileName = await generatePDF(dataForPdf, doctorSignImage);
      const pdfFile = `${pdfFileName}.pdf`;

      const options = {
        root: path.join(__dirname, `../../../../${PRESCRIPTION_PDF_FOLDER}/`),
      };
      return res.sendFile(pdfFile, options);
    } catch (err) {
      Logger.debug("Error got in the generate prescription: ", err);
      return raiseServerError(res);
    }
  };

  getPatientTimings = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {} } = req;
      const userPreference = await UserPreferenceService.getPreferenceByData({
        user_id: userId,
      });
      const userPreferenceWrapper = await UserPreferenceWrapper(userPreference);
      const userPreferenceData = userPreferenceWrapper.getBasicInfo();
      return raiseSuccess(
        res,
        201,
        {
          user_preference: {
            ...userPreferenceData,
          },
        },
        "User preference fetched successfully."
      );
    } catch (err) {
      Logger.debug("Error got in the get patient timings: ", err);
      return raiseServerError(res);
    }
  };

  getPatientReports = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { patient_id } = {},
        userDetails: { userCategoryId } = {},
      } = req;
      Logger.info(`params: patient_id = ${patient_id}`);

      if (!patient_id) {
        return raiseClientError(res, 422, {}, "Please select correct patient");
      }

      const reportService = new ReportService();
      const allReports =
        (await reportService.getAllReportByData({
          patient_id,
        })) || [];

      let reportData = {};
      let documentData = {};

      let doctorIds = [];

      let reportIds = [];

      for (let index = 0; index < allReports.length; index++) {
        const report = await ReportWrapper({ data: allReports[index] });
        const { reports, upload_documents } = await report.getReferenceInfo();
        reportIds.push(report.getId());
        reportData = { ...reportData, ...reports };
        documentData = { ...documentData, ...upload_documents };

        // collect other doctor ids
        if (
          (report.getUploaderType() === USER_CATEGORY.DOCTOR ||
            report.getUploaderType() === USER_CATEGORY.HSP) &&
          report.getUploaderId() !== userCategoryId
        ) {
          doctorIds.push(report.getUploaderId());
        }
      }

      // get other doctor basic details
      // todo: check with others if this data is already present for multi careplan
      let doctorData = {};
      if (doctorIds.length > 0) {
        const allDoctors =
          (await DoctorService.getAllDoctorByData({
            id: doctorIds,
          })) || [];

        for (let index = 0; index < allDoctors.length; index++) {
          const doctor = await DoctorWrapper(allDoctors[index]);
          doctorData[doctor.getDoctorId()] = await doctor.getAllInfo();
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          reports: {
            ...reportData,
          },
          doctors: {
            ...doctorData,
          },
          upload_documents: {
            ...documentData,
          },
          report_ids: reportIds,
        },
        "Reports for patient fetched successfully"
      );
    } catch (error) {
      Logger.debug("getPatientReports 500 error", error);
      return raiseServerError(res);
    }
  };

  acceptPaymentsTerms = async (req, res) => {
    const { raiseClientError } = this;
    try {
      const {
        userDetails: { userId } = {},
        body: {
          acceptTerms,
          provider_terms_mapping_id = null,
          doctor_id = null,
        } = {},
      } = req;

      if (!acceptTerms) {
        return raiseClientError(
          res,
          422,
          {},
          "Cannot proceed further without accepting Terms of Payments"
        );
      }

      const patient = await patientService.getPatientByUserId(userId);

      const patientApiWrapper = await PatientWrapper(patient);
      const patientId = patientApiWrapper.getPatientId();

      const { id = null } =
        (await patientPaymentConsentMappingService.findOne({
          where: {
            patient_id: patientId,
            provider_terms_mapping_id,
            doctor_id,
          },
          attributes: ["id"],
        })) || {};

      let patientPaymentConsentApiData = {},
        userPaymentLinkDetails = {};

      if (id) {
        //update

        const record = await patientPaymentConsentMappingService.update(
          {
            payment_terms_accepted: acceptTerms,
          },
          id
        );

        const patientPaymentConsent = await PatientConsentMappingWrapper(
          null,
          id
        );
        patientPaymentConsentApiData[patientPaymentConsent.getId()] =
          await patientPaymentConsent.getBasicInfo();
      } else {
        //create

        const record = await patientPaymentConsentMappingService.create({
          provider_terms_mapping_id,
          patient_id: patientId,
          doctor_id,
          payment_terms_accepted: acceptTerms,
        });

        const patientPaymentConsent = await PatientConsentMappingWrapper(
          record
        );
        patientPaymentConsentApiData[patientPaymentConsent.getId()] =
          await patientPaymentConsent.getBasicInfo();
      }

      return this.raiseSuccess(
        res,
        200,
        {
          patient_payments_consent_mappings: {
            ...patientPaymentConsentApiData,
          },
        },
        "Payment terms changed successfully."
      );
    } catch (error) {
      Logger.debug("acceptPaymentsTerms 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };

  getAllRelatedDoctorPaymentLinks = async (req, res) => {
    const { raiseClientError } = this;
    try {
      const { userDetails: { userId } = {} } = req;
      let doctorIds = [];
      let doctorRoleIds = [];
      let providerTermsMapping = {};
      let paymentConsentsMapping = {};
      let providerApiData = {};
      let doctorData = {};
      let userIds = [];
      let patientId = null;
      let usersData = {};
      let userRoles = {};
      let paymentProducts = {};

      const paymentProductService = new PaymentProductService();

      const patientData = await patientService.getPatientByUserId(userId);
      if (patientData) {
        const patientApiWrapper = await PatientWrapper(patientData);
        patientId = patientApiWrapper.getPatientId();

        const careplanData = await carePlanService.getCarePlanByData({
          patient_id: patientId,
        });

        await careplanData.forEach(async (carePlan) => {
          const carePlanApiWrapper = await CarePlanWrapper(carePlan);
          doctorIds.push(carePlanApiWrapper.getDoctorId());
          doctorRoleIds.push(carePlanApiWrapper.getUserRoleId());
        });
      }

      for (const id of doctorRoleIds) {
        const userRoleDetailWrapper = await UserRolesWrapper(null, id);
        userRoles[userRoleDetailWrapper.getId()] =
          userRoleDetailWrapper.getBasicInfo();
      }

      if (doctorRoleIds && doctorRoleIds.length) {
        for (let index = 0; index < doctorRoleIds.length; index++) {
          const roleId = doctorRoleIds[index];
          const doctorPaymentProductData =
            await paymentProductService.getAllCreatorTypeProducts({
              creator_role_id: roleId,
              creator_type: [USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP],
              for_user_type: [USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP],
              for_user_role_id: roleId,
            });

          for (const paymentProduct of doctorPaymentProductData) {
            const doctorPaymentProductWrapper = await PaymentProductWrapper(
              paymentProduct
            );
            paymentProducts[doctorPaymentProductWrapper.getId()] =
              doctorPaymentProductWrapper.getBasicInfo();
          }

          const {
            [roleId]: {
              basic_info: { linked_id: providerId = null } = {},
            } = {},
          } = userRoles || {};
          if (providerId) {
            const providerWrapper = await ProviderWrapper(null, providerId);
            userIds.push(providerWrapper.getUserId());
            providerApiData[providerId] = await providerWrapper.getAllInfo();

            const providerUserRole = await userRolesService.getFirstUserRole(
              providerWrapper.getUserId()
            );
            let providerUserRoleId = null;
            if (providerUserRole) {
              const providerUserRoleWrapper = await UserRolesWrapper(
                providerUserRole
              );
              providerUserRoleId = await providerUserRoleWrapper.getId();

              userRoles[providerUserRoleId] =
                providerUserRoleWrapper.getBasicInfo();
            }
            const providerPaymentProductData =
              await paymentProductService.getAllCreatorTypeProducts({
                creator_role_id: providerUserRoleId, // change to provider roleId
                creator_type: USER_CATEGORY.PROVIDER,
                for_user_type: [USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP],
                for_user_role_id: roleId,
              });

            for (const paymentProduct of providerPaymentProductData) {
              const providerPaymentProductWrapper = await PaymentProductWrapper(
                paymentProduct
              );
              paymentProducts[providerPaymentProductWrapper.getId()] =
                providerPaymentProductWrapper.getBasicInfo();
            }

            const termsMapping =
              await providerTermsMappingService.getSingleEntityByData({
                provider_id: providerId,
              });

            if (termsMapping) {
              const providerTermsWrapper = await ProviderTermsMappingWrapper(
                termsMapping
              );

              providerTermsMapping[providerTermsWrapper.getId()] =
                providerTermsWrapper.getBasicInfo();
            }
          }
        }
      }

      if (doctorIds && doctorIds.length > 0) {
        const allDoctors =
          (await DoctorService.getAllDoctorByData({
            id: doctorIds,
          })) || [];

        for (let index = 0; index < allDoctors.length; index++) {
          const doctor = await DoctorWrapper(allDoctors[index]);
          doctorData[doctor.getDoctorId()] = await doctor.getAllInfo();
          userIds.push(doctor.getUserId());

          const paymentConsent =
            await patientPaymentConsentMappingService.getAllByData({
              doctor_id: doctor.getDoctorId(),
              patient_id: patientId,
            });

          for (const consent of paymentConsent) {
            const consentWrapper = await PatientConsentMappingWrapper(consent);
            paymentConsentsMapping[consentWrapper.getId()] =
              consentWrapper.getBasicInfo();
          }
        }
      }

      for (const id of userIds) {
        const userDetails = await userService.getUserById(id);

        if (userDetails) {
          const userDetailWrapper = await UserWrapper(userDetails);
          usersData[userDetailWrapper.getId()] =
            userDetailWrapper.getBasicInfo();
        }
      }

      return this.raiseSuccess(
        res,
        200,
        {
          users: usersData,
          user_roles: userRoles,
          doctors: doctorData,
          providers: providerApiData,
          provider_terms_mappings: providerTermsMapping,
          patient_payments_consent_mappings: paymentConsentsMapping,
          payment_products: paymentProducts,
        },
        "Payment links data fetched successfully."
      );
    } catch (error) {
      Logger.debug("getAllRelatedDoctorPaymentLinks 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };
}

export default new MPatientController();
