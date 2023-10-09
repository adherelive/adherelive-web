import Controller from "../";

// SERVICES --------------------------------
import userService from "../../../app/services/user/user.service";
import patientService from "../../../app/services/patients/patients.service";
import doctorService from "../../../app/services/doctor/doctor.service";
import minioService from "../../../app/services/minio/minio.service";
import carePlanService from "../../services/carePlan/carePlan.service";
// import carePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";
// import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
// import templateMedicationService from "../../services/templateMedication/templateMedication.service";
// import templateAppointmentService from "../../services/templateAppointment/templateAppointment.service";
import medicineService from "../../services/medicine/medicine.service";
import getAge from "../../helper/getAge";
import SymptomService from "../../services/symptom/symptom.service";
import VitalService from "../../services/vitals/vital.service";
import appointmentService from "../../services/appointment/appointment.service";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
import otpVerificationService from "../../services/otpVerification/otpVerification.service";
import ConsentService from "../../services/consents/consent.service";
import ReportService from "../../services/reports/report.service";
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";
import conditionService from "../../services/condition/condition.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import doctorRegistrationService from "../../services/doctorRegistration/doctorRegistration.service";
import treatmentService from "../../services/treatment/treatment.service";
import doctorPatientWatchlistService from "../../services/doctorPatientWatchlist/doctorPatientWatchlist.service";
import userRolesService from "../../services/userRoles/userRoles.service";
import DietService from "../../services/diet/diet.service";
import PortionServiceService from "../../services/portions/portions.service";
import RepetitionService from "../../services/exerciseRepetitions/repetition.service";
import providerService from "../../services/provider/provider.service";
import ExerciseContentService from "../../services/exerciseContents/exerciseContent.service";
import WorkoutService from "../../services/workouts/workout.service";
import userPreferenceService from "../../services/userPreferences/userPreference.service";
import careplanSecondaryDoctorMappingService from "../../services/careplanSecondaryDoctorMappings/careplanSecondaryDoctorMappings.service";
// WRAPPERS --------------------------------
import ExerciseContentWrapper from "../../ApiWrapper/web/exerciseContents";
import UserRolesWrapper from "../../ApiWrapper/web/userRoles";
import VitalWrapper from "../../ApiWrapper/web/vitals";
import UserWrapper from "../../ApiWrapper/web/user";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import MReminderWrapper from "../../ApiWrapper/web/medicationReminder";
import CarePlanTemplateWrapper from "../../ApiWrapper/web/carePlanTemplate";
// import TemplateMedicationWrapper from "../../ApiWrapper/web/templateMedication";
// import TemplateAppointmentWrapper from "../../ApiWrapper/web/templateAppointment";
import MedicineApiWrapper from "../../ApiWrapper/mobile/medicine";
import SymptomWrapper from "../../ApiWrapper/web/symptoms";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import ConsentWrapper from "../../ApiWrapper/web/consent";
import PatientWrapper from "../../ApiWrapper/web/patient";
import ReportWrapper from "../../ApiWrapper/web/reports";
import ConditionWrapper from "../../ApiWrapper/web/conditions";
import QualificationWrapper from "../../ApiWrapper/web/doctorQualification";
import RegistrationWrapper from "../../ApiWrapper/web/doctorRegistration";
import DegreeWrapper from "../../ApiWrapper/web/degree";
import CouncilWrapper from "../../ApiWrapper/web/council";
import TreatmentWrapper from "../../ApiWrapper/web/treatments";
import DoctorPatientWatchlistWrapper from "../../ApiWrapper/web/doctorPatientWatchlist";
import DietWrapper from "../../ApiWrapper/web/diet";
import ProviderWrapper from "../../ApiWrapper/web/provider";
import PortionWrapper from "../../ApiWrapper/web/portions";
import WorkoutWrapper from "../../ApiWrapper/web/workouts";
import UserPreferenceWrapper from "../../ApiWrapper/web/userPreference";
import * as DietHelper from "../diet/dietHelper";
import Log from "../../../libs/log";
import moment from "moment";
import {
  BODY_VIEW,
  CONSENT_TYPE,
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY,
  S3_DOWNLOAD_FOLDER,
  PRESCRIPTION_PDF_FOLDER,
  DIAGNOSIS_TYPE,
  S3_DOWNLOAD_FOLDER_PROVIDER,
  ONBOARDING_STATUS,
  SIGN_IN_CATEGORY,
  PATIENT_MEAL_TIMINGS,
} from "../../../constant";

import { getSeparateName, getRoomId } from "../../helper/common";
import generateOTP from "../../helper/generateOtp";
import { EVENTS, Proxy_Sdk } from "../../proxySdk";
// import carePlan from "../../ApiWrapper/web/carePlan";
import generatePDF from "../../helper/generateCarePlanPdf";
import { downloadFileFromS3 } from "../user/userHelper";
import { getFilePath } from "../../helper/filePath";
import { checkAndCreateDirectory } from "../../helper/common";

// helpers
import bcrypt from "bcrypt";
import * as carePlanHelper from "../carePlans/carePlanHelper";
import { getDoctorCurrentTime } from "../../helper/getUserTime";

const path = require("path");

const Logger = new Log("WEB > PATIENTS > CONTROLLER");

class PatientController extends Controller {
  constructor() {
    super();
  }

  updatePatient = async (req, res) => {
    try {
      const { userDetails, body, file } = req;
      const { pid, profile_pic, name, email = "" } = body || {};
      const { userId = "3" } = userDetails || {};
      if (email) {
        const updateUserDetails = await userService.updateEmail(
          { email },
          userId
        );
      }
      const splitName = name.split(" ");
      // todo minio configure here
      if (profile_pic) {
        await minioService.createBucket();
        // var file = path.join(__dirname, "../../../report.xlsx");
        const fileStream = fs.createReadStream(profile_pic);

        let hash = md5.create();
        hash.update(userId);
        hash.hex();
        hash = String(hash);
        const folder = "patients";
        // const fileExt = "";
        const file_name = hash.substring(4) + "-Report." + fileExt;
        const metaData = {
          "Content-Type":
            "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };
        const fileUrl = folder + "/" + file_name;
        await minioService.saveBufferObject(fileStream, fileUrl, metaData);
      }

      const { first_name, middle_name, last_name } = getSeparateName(name);

      const patientData = {
        user_id: userId,
        first_name,
        middle_name,
        last_name,
        details: {
          // todo: profile_pic
        },
        uid: pid,
      };
      // add patient for userId
      const patientDetails = await patientService.update(patientData);

      return this.raiseSuccess(
        res,
        200,
        {
          patients: {
            [patientDetails.getId]: {
              ...patientDetails.getBasicInfo,
            },
          },
        },
        "patient details updated successfully"
      );
    } catch (error) {
      return this.raiseServerError(res, 500, error, error.getMessage());
    }
  };

  getPatientAppointments = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { params: { id } = {}, userDetails: { userId } = {} } = req;

      const appointmentList = await appointmentService.getAppointmentForPatient(
        id
      );
      // Logger.debug("appointmentList", appointmentList);

      // if (appointmentList.length > 0) {
      let appointmentApiData = {};
      let appointmentDocuments = {};
      let appointment_ids = [];

      for (const appointment of appointmentList) {
        const appointmentWrapper = await AppointmentWrapper(appointment);
        appointmentApiData[appointmentWrapper.getAppointmentId()] =
          appointmentWrapper.getBasicInfo();

        const { appointment_docs } =
          await appointmentWrapper.getReferenceInfo();

        appointmentDocuments = { ...appointmentDocuments, ...appointment_docs };
        appointment_ids.push(appointmentWrapper.getAppointmentId());
      }

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            ...appointmentApiData,
          },
          appointment_docs: {
            ...appointmentDocuments,
          },
          appointment_ids,
        },
        `appointment data for patient: ${id} fetched successfully`
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

      let medicationApiData = {};
      let medicineId = [];

      for (const medication of medicationDetails) {
        const medicationWrapper = await MReminderWrapper(medication);
        const { medications } = await medicationWrapper.getAllInfo();
        medicationApiData = { ...medicationApiData, ...medications };
        // medicationApiData[
        //   medicationWrapper.getMReminderId()
        // ] = medicationWrapper.getBasicInfo();
        medicineId.push(medicationWrapper.getMedicineId());
      }

      Logger.debug("medicineId", medicationDetails);

      const medicineData = await medicineService.getMedicineByData({
        id: medicineId,
      });

      let medicineApiData = {};

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
        },
        "Medications fetched successfully"
      );
    } catch (error) {
      Logger.debug("500 error ", error);
      return raiseServerError(res);
    }
  };

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


  // Care_plans seconday details iD start
  getPatientCarePlanSecondaryDocDetails = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { id: patient_id = 1 } = req.params;

      Logger.info(`params: patient_id = ${patient_id}`);
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

      const carePlans = (await carePlanService.getMultipleCarePlanByData({ id })) || [];

      if (carePlans.length > 0) {
        const { care_plans, care_plan_ids } =
          await carePlanHelper.getCareplanDataWithImp({
            carePlans,
            userCategory: category,
            doctorId: userCategoryId,
            userRoleId,
          });
      }

      return raiseSuccess(
        res,
        200,
        {
          care_plans: care_plans,
        },
        "Patient care plan details fetched successfully"
      );
    } catch (error) {
      // Logger.debug("get careplan 500 error ---> ", error);
      console.log(error);
      return raiseServerError(res);
    }
  };

  // careplan secondary details id end


  getPatientCarePlanDetails = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { id: patient_id = 1 } = req.params;

      Logger.info(`params: patient_id = ${patient_id}`);
      const {
        userDetails: {
          userRoleId = null,
          userId,
          userCategoryId,
          userData: { category } = {},
        } = {},
      } = req;

      // let newData = [];
      // if (req.userDetails.userCategoryData.care_plan_ids) {
      //   newData = req.userDetails.userCategoryData.care_plan_ids[userRoleId];
      // }
      if (!patient_id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct patient to continue"
        );
      }

      const carePlans =
        (await carePlanService.getMultipleCarePlanByData({
          patient_id,
          // user_role_id: userRoleId,
        })) || [];

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

      // for vitals
      let vitalTemplateData = {};
      let care_planss = null;
      if (carePlans.length > 0) {
        const { care_plans, care_plan_ids, current_careplan_id } =
          await carePlanHelper.getCareplanDataWithImp({
            carePlans,
            userCategory: category,
            doctorId: userCategoryId,
            userRoleId,
          });
        care_planss = care_plans;
        // care plan ids
        carePlanIds = [...care_plan_ids];

        // latest care plan id
        // latestCarePlanId = current_careplan_id;

        // get all treatment ids from careplan for templates
        Object.keys(care_plans).forEach((id) => {
          const { details: { treatment_id } = {} } = care_plans[id] || {};
          treatmentIds.push(treatment_id);
          let careplan = care_plans[id];
          if (
            (careplan["basic_info"]["patient_id"] == patient_id &&
              careplan["basic_info"]["user_role_id"] == userRoleId) ||
            (careplan["basic_info"]["patient_id"] == patient_id &&
              careplan["secondary_doctor_user_role_ids"].includes(userRoleId))
          ) {
            latestCarePlanId = id;
          }
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
      } else {
        carePlanTemplateIds.push("1");
        otherCarePlanTemplates["1"] = {
          basic_info: {
            id: "1",
            name: "Blank Template",
          },
        };
      }

      return raiseSuccess(
        res,
        200,
        {
          care_plans: care_planss,
          current_careplan_id: parseInt(latestCarePlanId),
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
        },
        "Patient care plan details fetched successfully"
      );
    } catch (error) {
      // Logger.debug("get careplan 500 error ---> ", error);
      console.log(error);
      return raiseServerError(res);
    }
  };

  getPatientSymptoms = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("req.params ----->", req.params);
      const {
        params: { patient_id } = {},
        userDetails: {
          userId,
          userRoleId = null,
          userData: { category } = {},
        } = {},
      } = req;

      const carePlanData = await carePlanService.getSingleCarePlanByData({
        patient_id,
        ...((category === USER_CATEGORY.DOCTOR ||
          category === USER_CATEGORY.HSP) && { user_role_id: userRoleId }),
      });
      const carePlan = await CarePlanWrapper(carePlanData);

      const symptomData = await SymptomService.getAllByData({
        patient_id,
        // care_plan_id: carePlan.getCarePlanId()
      });

      let uploadDocumentData = {};
      const dateWiseSymptoms = {};
      let symptomDates = [];

      if (symptomData.length > 0) {
        for (const data of symptomData) {
          const symptom = await SymptomWrapper({ data });

          Logger.debug("symptom created date ---> ", symptom.getCreatedDate());
          const symptomDetails = await symptom.getDateWiseInfo();
          if (dateWiseSymptoms.hasOwnProperty(symptom.getCreatedDate())) {
            dateWiseSymptoms[symptom.getCreatedDate()].push(symptomDetails);
          } else {
            dateWiseSymptoms[symptom.getCreatedDate()] = [];
            dateWiseSymptoms[symptom.getCreatedDate()].push(symptomDetails);
          }
          const { upload_documents } = await symptom.getReferenceInfo();
          uploadDocumentData = { ...uploadDocumentData, ...upload_documents };
          if (symptomDates.indexOf(symptom.getCreatedDate()) === -1) {
            symptomDates.push(symptom.getCreatedDate());
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
            upload_documents: {
              ...uploadDocumentData,
            },
            symptom_dates: symptomDates,
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
      Logger.debug(
        "getPatientSymptoms 500 error - patient not updated any symptoms",
        error
      );
      return raiseServerError(res);
    }
  };

  getPatientVitals = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("34554321345324", req.params);
      const { params: { careplan_id } = {} } = req;

      const { userDetails: { userRoleId = null } = {} } = req;
      let patient_id = null;

      const careplanWrapper = await CarePlanWrapper(null, careplan_id);
      if (careplanWrapper) {
        patient_id = await careplanWrapper.getPatientId();
      }

      const carePlans =
        (await carePlanService.getMultipleCarePlanByData({
          id: careplan_id,
        })) || [];

      const { care_plans } = await carePlanHelper.getCareplanDataWithImp({
        carePlans,
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
            care_plans,
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

  getPatientPartSymptoms = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("req.params ----->", req.params);
      const {
        query: { duration = "5" } = {},
        params: { patient_id } = {},
        userDetails: { userId } = {},
      } = req;

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
          if (sideData) {
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
          } else {
            sideWiseParts[side] = [];
          }
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

  searchPatient = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;

    try {
      Logger.info(`searchPatient request query : ${req.query.value}`);
      const { query: { value = "" } = {} } = req;
      const {
        userDetails: { userId, userRoleId, userData: { category } = {} } = {},
      } = req;
      let authDoctor = null;
      if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
        authDoctor = await doctorService.getDoctorByData({ user_id: userId });
      }
      const users = await userService.getPatientByMobile(value);
      if (users.length > 0) {
        let userDetails = {};
        let patientDetails = {};
        const patientIds = [];
        let isPatientAvailable = {};
        for (const userData of users) {
          let isPatientAvailableForDoctor = false;
          const user = await UserWrapper(userData.get());
          const { users, patients, patient_id } = await user.getReferenceInfo();
          patientIds.push(patient_id);

          let careplanData = await carePlanService.getCarePlanByData({
            doctor_id: authDoctor.get("id"),
            patient_id,
          });
          isPatientAvailableForDoctor = careplanData.length > 0;

          userDetails = {
            ...userDetails,
            ...users,
            // isPatientAvailableForDoctor,
          };

          if (!isPatientAvailableForDoctor) {
            let careplanData = await carePlanService.getCarePlanByData({
              patient_id,
            });
            for (let i = 0; i < careplanData.length; i++) {
              // getsecondary careplan mapping
              const carePlan = await CarePlanWrapper(careplanData[i]);
              let secondayDoctorMapping =
                await careplanSecondaryDoctorMappingService.findAndCountAll({
                  where: {
                    secondary_doctor_role_id: userRoleId,
                    care_plan_id: carePlan.getCarePlanId(),
                  },
                });

              if (secondayDoctorMapping.count > 0) {
                isPatientAvailableForDoctor = true;
                break;
              }
            }
          }

          isPatientAvailable[patient_id] = isPatientAvailableForDoctor;
          patientDetails = {
            ...patientDetails,
            ...patients,
            // isPatientAvailableForDoctor,
          };
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
            isPatientAvailable,
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

  /* TODO: This function has been removed in the recent code for
   * branch merge-2    
  searchPatientByName = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      Logger.info(`searchPatient request query : ${req.query.value}`);
      const { query: { value = "" } = {} } = req;
      const {
        userDetails: { userId, userRoleId, userData: { category } = {} } = {},
      } = req;
      let authDoctor = null;
      if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
        authDoctor = await doctorService.getDoctorByData({ user_id: userId });
      }
      const patients = await patientService.getPatientByName(value);
      if (patients.length > 0)
        return raiseSuccess(
          res,
          200,
          { patients },
          "Patients fetched successfully"
        );
      else
        return raiseSuccess(
          res,
          201,
          {},
          "No patient linked with the given phone number"
        );
    } catch (error) {
      Logger.debug("searchPatient 500 error", error);
      return raiseServerError(res);
    }
  };
  */

  searchPatientOld = async (req, res) => {
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
          Logger.debug("Search Patient Users", users);
          Logger.debug("Search Patient Patients", patients);
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

  searchPatientForDoctor = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails: { userRoleId = null, userId } = {} } = req;
      const { query: { value = "" } = {} } = req;

      const isNumber = !isNaN(value);
      let doctorData = {};
      const patientIdsForThisDoc = [];
      const userIdsForForPatientForDoc = [];
      const doctor = await doctorService.getDoctorByUserId(parseInt(userId));
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

  patientConsentRequest = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        params: { id: patient_id } = {},
        userDetails: { userId, userRoleId } = {},
      } = req;

      const patient = await PatientWrapper(null, patient_id);

      const { users } = await patient.getReferenceInfo();
      const { basic_info: { prefix, mobile_number, email } = {} } =
        users[patient.getUserId()];

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
          message: `Hello from AdhereLive! Your OTP for consent request is ${otp}`,
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
        userDetails: {
          userRoleId = null,
          userId,
          userData: { category } = {},
        } = {},
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
          authDoctor = await doctorService.getDoctorByData({ user_id: userId });
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
          const doctors = await doctorService.getAllDoctorByData({
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

  createNewCareplanforPatient = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        clinical_notes = "",
        follow_up_advise = "",
        diagnosis_type = "1",
        diagnosis_description = "",
        treatment_id,
        severity_id,
        condition_id,
        symptoms = "",
      } = req.body;

      const {
        params: { patient_id } = {},
        userDetails: { userRoleId = null, userId } = {},
      } = req;

      let userData = null;
      let patientData = null;
      let patientOtherDetails = {};
      let carePlanOtherDetails = {};

      if (clinical_notes) {
        carePlanOtherDetails["clinical_notes"] = clinical_notes;
      }
      if (follow_up_advise) {
        carePlanOtherDetails["follow_up_advise"] = follow_up_advise;
      }
      if (symptoms) {
        carePlanOtherDetails["symptoms"] = symptoms;
      }

      // if (clinical_notes) {
      //   carePlanOtherDetails["clinical_notes"] = clinical_notes;
      // }
      // if (symptoms) {
      //   carePlanOtherDetails["symptoms"] = symptoms;
      // }

      // if (clinical_notes) {
      //   carePlanOtherDetails["clinical_notes"] = clinical_notes;
      // }
      // if (symptoms) {
      //   carePlanOtherDetails["symptoms"] = symptoms;
      // }

      patientData = await PatientWrapper(null, patient_id);

      const doctor = await doctorService.getDoctorByData({ user_id: userId });
      const carePlanTemplate =
        await carePlanTemplateService.getCarePlanTemplateData({
          treatment_id,
          severity_id,
          condition_id,
          user_id: userId,
        });
      const care_plan_template_id = null;

      const details = {
        treatment_id,
        severity_id,
        condition_id,
        diagnosis: {
          type: diagnosis_type,
          description: diagnosis_description,
        },
        ...carePlanOtherDetails,
      };

      const carePlan = await carePlanService.addCarePlan({
        patient_id,
        user_role_id: userRoleId,
        doctor_id: doctor.get("id"),
        care_plan_template_id,
        details,
        created_at: moment(),
        channel_id: getRoomId(userRoleId, patient_id),
      });

      const carePlanData = await CarePlanWrapper(carePlan);
      const care_plan_id = await carePlanData.getCarePlanId();
      let doctorData = {};
      const doctorIds = [];

      const carePlans = await carePlanService.getCarePlanByData({
        patient_id,
        user_role_id: userRoleId,
      });

      if (carePlans.length > 0) {
        for (let i = 0; i < carePlans.length; i++) {
          const carePlan = await CarePlanWrapper(carePlans[i]);
          doctorIds.push(carePlan.getDoctorId());
        }
      }

      if (doctorIds.length > 0) {
        const doctors = await doctorService.getAllDoctorByData({
          id: doctorIds,
        });

        if (doctors.length > 0) {
          for (let i = 0; i < doctors.length; i++) {
            const doctor = await DoctorWrapper(doctors[i]);
            doctorData[doctor.getDoctorId()] = await doctor.getAllInfo();
          }
        }
      }

      return this.raiseSuccess(
        res,
        200,
        {
          care_plan_ids: [carePlanData.getCarePlanId()],
          care_plans: {
            [carePlanData.getCarePlanId()]: carePlanData.getBasicInfo(),
          },
          doctors: {
            ...doctorData,
          },
        },
        "Careplan added successfully"
      );
    } catch (error) {
      Logger.debug("ADD CAREPLAN PATIENT 500 ERROR", error);
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
      // web controller
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
          (await doctorService.getAllDoctorByData({
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

  generatePrescription = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { care_plan_id = null } = req.params;
      const {
        userDetails: {
          userId,
          userRoleId = null,
          userData: { category } = {},
        } = {},
        permissions = [],
      } = req;

      const dietService = new DietService();
      const workoutService = new WorkoutService();
      // const carePlanId = parseInt(care_plan_id);
      let doctor_id = "";
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
      if (!care_plan_id) {
        return raiseClientError(res, 422, {}, "Invalid Care Plan.");
      }
      const carePlan = await carePlanService.getCarePlanById(care_plan_id);
      const carePlanData = await CarePlanWrapper(carePlan);
      const { clinical_notes, follow_up_advise } =
        (await carePlanData.getCarePlanDetails()) || {};

      const curr_patient_id = carePlanData.getPatientId();
      const doctorUserRoleId = carePlanData.getUserRoleId();
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

          for (const medicine of medicineData) {
            const medicineWrapper = await MedicineApiWrapper(medicine);
            medicines = {
              ...medicines,
              ...{
                [medicineWrapper.getMedicineId()]: medicineWrapper.getAllInfo(),
              },
            };
          }

          let mediactionNewData = await medicationWrapper.getBasicInfo();

          medications = {
            ...medications,
            ...{ [medicationId]: await medicationWrapper.getBasicInfo() },
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
          const { organizer, provider_id } =
            await appointmentWrapper.getBasicInfo();
          const diff = startDateObj.diff(now);

          if (diff > 0) {
            if (!nextAppointment || nextAppointment.diff(startDateObj) > 0) {
              nextAppointment = startDateObj;
            }
          }

          const { type } = appointmentWrapper.getDetails() || {};

          // if (type !== CONSULTATION) {
          const {
            type_description = "",
            radiology_type = "",
            description = "",
            reason = ""
          } = appointmentWrapper.getDetails() || {};
          suggestedInvestigations.push({
            type,
            description,
            type_description,
            radiology_type,
            provider_id,
            start_date: startDate,
            organizer,
            reason
          });
          // }
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

      // Logger.debug(
      //   "98273917312 sortedInvestigations ",
      //   sortedInvestigations
      // );

      if (nextAppointment) {
        nextAppointmentDuration =
          nextAppointment.diff(now, "days") !== 0
            ? `${nextAppointment.diff(now, "days")} days`
            : `${nextAppointment.diff(now, "hours")} hours`;
      }

      let patient = null;

      if (category === USER_CATEGORY.DOCTOR) {
        patient = await patientService.getPatientById({ id: curr_patient_id });
        doctor_id = req.userDetails.userCategoryData.basic_info.id;
      } else if (category === USER_CATEGORY.HSP) {
        patient = await patientService.getPatientById({ id: curr_patient_id });
        ({ doctor_id } = await carePlanData.getReferenceInfo());
      } else {
        patient = await patientService.getPatientByUserId(userId);
        ({ doctor_id } = await carePlanData.getReferenceInfo());
      }

      const patientData = await PatientWrapper(patient);

      const timingPreference = await userPreferenceService.getPreferenceByData({
        user_id: patientData.getUserId(),
      });
      const userPrefOptions = await UserPreferenceWrapper(timingPreference);
      const { timings: userTimings = {} } = userPrefOptions.getAllDetails();
      const timings = DietHelper.getTimings(userTimings);

      // const { doctors, doctor_id } = await carePlanData.getReferenceInfo();
      const { doctors } = await carePlanData.getReferenceInfo();

      const {
        [doctor_id]: {
          basic_info: { signature_pic = "", full_name = "", profile_pic } = {},
        } = {},
      } = doctors;

      checkAndCreateDirectory(S3_DOWNLOAD_FOLDER);

      const doctorSignImage = `${S3_DOWNLOAD_FOLDER}/${full_name}.jpeg`;
      console.log("\n\n\n\n\n\n\n\n\n\n\n================================")
      console.log({ doctorSignImage })
      const downloadImage = await downloadFileFromS3(
        getFilePath(signature_pic),
        doctorSignImage
      );
      console.log("================================\n\n\n\n\n\n\n\n\n\n\n")

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

      let user_ids = [doctorUserId, userId];
      if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
        const curr_data = await patientData.getAllInfo();
        const { basic_info: { user_id: curr_p_user_id = "" } = {} } =
          curr_data || {};
        user_ids = [doctorUserId, curr_p_user_id];
      }

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
        // ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {
        //   medications,
        // }),
        // ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {
        //   medicines,
        // }),
        medications,
        clinical_notes,
        follow_up_advise,
        clinical_notes,
        follow_up_advise,
        medicines,
        care_plans: {
          [carePlanData.getCarePlanId()]: {
            ...carePlanData.getBasicInfo(),
          },
        },
        doctors,
        degrees,
        portions: { ...portionApiData },
        repetitions: { ...repetitionApiData },
        conditions,
        providers: providerData,
        providerIcon,
        providerPrescriptionDetails,
        doctor_id,
        registrations: registrationsData,
        creationDate: carePlanCreatedDate,
        nextAppointmentDuration,
        suggestedInvestigations: sortedInvestigations,
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
      console.log("\n\n\n\n\n\n\n\n\n\n\n================================")
      console.log({ doctorSignImage })
      console.log("================================\n\n\n\n\n\n\n\n\n\n\n")
      const pdfFileName = await generatePDF(dataForPdf, doctorSignImage);

      const pdfFile = `${pdfFileName}.pdf`;

      const options = {
        root: path.join(__dirname, `../../../${PRESCRIPTION_PDF_FOLDER}/`),
      };
      return res.sendFile(pdfFile, options);
    } catch (err) {
      Logger.debug("Error while generating the prescription: ", err);
      return raiseServerError(res);
    }
  };

  getAllPatientsPagination = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query, userDetails } = req;

      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryId,
      } = userDetails || {};

      let allPatientIds = [];

      const {
        offset = 0,
        sort_name = null,
        sort_createdAt = null,
        filter_treatment = null,
        filter_diagnosis = null,
        watchlist = 0,
      } = query || {};

      const limit = process.config.PATIENT_LIST_SIZE_LIMIT;
      // 0

      const offsetLimit = parseInt(limit, 10) * parseInt(offset, 10);
      const endLimit = parseInt(limit, 10);
      const getWatchListPatients = parseInt(watchlist, 10) === 0 ? 0 : 1;

      let patientsForDoctor = [];

      let rowData = [];

      let count = 0;
      let treatments = {};

      // careplan ids as secondary doctor
      const {
        count: careplansCount = 0,
        rows: careplanAsSecondaryDoctor = [],
      } = await careplanSecondaryDoctorMappingService.findAndCountAll({
        where: {
          secondary_doctor_role_id: userRoleId,
        },
      });

      let careplanIdsAsSecondaryDoctor = [];

      if (careplansCount) {
        for (let each of careplanAsSecondaryDoctor) {
          const { care_plan: { id = null, patient_id = null } = {} } =
            each || {};
          careplanIdsAsSecondaryDoctor.push(id);
        }
      }

      const secondary_careplan_ids = careplanIdsAsSecondaryDoctor.toString()
        ? careplanIdsAsSecondaryDoctor.toString()
        : null;

      if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
        let watchlistQuery = "";
        const doctor = await doctorService.getDoctorByData({
          user_id: userId,
        });

        if (doctor && getWatchListPatients) {
          const doctorData = await DoctorWrapper(doctor);
          const doctorAllInfo = await doctorData.getAllInfo();
          // let { watchlist_patient_ids = []} = doctorAllInfo || {};
          let watchlist_patient_ids = [];
          const watchlistRecords =
            await doctorPatientWatchlistService.getAllByData({
              user_role_id: userRoleId,
            });

          // watchlisted patient ids

          if (watchlistRecords && watchlistRecords.length) {
            for (let i = 0; i < watchlistRecords.length; i++) {
              const watchlistWrapper = await DoctorPatientWatchlistWrapper(
                watchlistRecords[i]
              );
              const patientId = await watchlistWrapper.getPatientId();
              watchlist_patient_ids.push(patientId);
            }
          }

          watchlist_patient_ids = watchlist_patient_ids.length
            ? watchlist_patient_ids
            : null; // if no patient id watchlisted , check patinetIds for (null) as watchlist_patient_ids=[]
          watchlistQuery = `AND (carePlan.user_role_id = ${userRoleId} OR carePlan.id in ( ${secondary_careplan_ids} ) ) AND carePlan.patient_id IN (${watchlist_patient_ids})`;
        }

        // filter to get name sorted paginated data
        if (sort_name) {
          const order = sort_name === "0" ? "ASC" : "DESC";
          [count, patientsForDoctor] =
            (await carePlanService.getPaginatedPatients({
              doctor_id: userCategoryId,
              user_role_id: userRoleId,
              order: `patient.first_name ${order}`,
              offset: offsetLimit,
              limit: endLimit,
              watchlist: watchlistQuery,
              // watchlistPatientIds,
              // watchlist: getWatchListPatients,
              secondary_careplan_ids,
            })) || [];
        } else if (sort_createdAt) {
          // filter to get date sorted paginated data

          const order = sort_createdAt === "0" ? "ASC" : "DESC";
          [count, patientsForDoctor] =
            (await carePlanService.getPaginatedPatients({
              doctor_id: userCategoryId,
              user_role_id: userRoleId,
              order: `patient.created_at ${order}`,
              offset: offsetLimit,
              limit: endLimit,
              watchlist: watchlistQuery,
              secondary_careplan_ids,
            })) || [];
        } else if (filter_treatment) {
          const allTreatments =
            (await treatmentService.searchByName(filter_treatment)) || [];

          // get all treatment
          if (allTreatments.length > 0) {
            for (let index = 0; index < allTreatments.length; index++) {
              const treatment = await TreatmentWrapper(allTreatments[index]);
              treatments = {
                ...treatments,
                [treatment.getTreatmentId()]: treatment.getBasicInfo(),
              };
            }

            const treatmentIds =
              allTreatments.map((treatment) => treatment.id) || [];
            [count, patientsForDoctor] =
              (await carePlanService.getPaginatedPatients({
                doctor_id: userCategoryId,
                filter: `JSON_VALUE(carePlan.details, '$.treatment_id') IN (${treatmentIds}) 
             
              `,
                offset: offsetLimit,
                limit: endLimit,
                watchlist: watchlistQuery,
                user_role_id: userRoleId,
                secondary_careplan_ids,
              })) || [];
          }
        } else if (filter_diagnosis) {
          // diagnosis filter

          let diagnosis_type = null;

          if (DIAGNOSIS_TYPE.FINAL.text.includes(filter_diagnosis)) {
            diagnosis_type = DIAGNOSIS_TYPE.FINAL.id;
          } else if (DIAGNOSIS_TYPE.PROBABLE.text.includes(filter_diagnosis)) {
            diagnosis_type = DIAGNOSIS_TYPE.PROBABLE.id;
          } else {
            diagnosis_type = null;
          }
          [count, patientsForDoctor] =
            (await carePlanService.getPaginatedPatients({
              doctor_id: userCategoryId,
              user_role_id: userRoleId,
              filter: `(JSON_VALUE(carePlan.details, '$.diagnosis.description') LIKE '${filter_diagnosis}%' OR
                JSON_VALUE(carePlan.details, '$.diagnosis.type') = ${diagnosis_type})`,
              // TODO: Duplicate user_role_id, commenting it
              //user_role_id: userRoleId,
              offset: offsetLimit,
              limit: endLimit,
              watchlist: watchlistQuery,
              secondary_careplan_ids,
            })) || [];
        }
        if (patientsForDoctor.length > 0) {
          for (let index = 0; index < patientsForDoctor.length; index++) {
            const {
              care_plan_id,
              care_plan_details,
              care_plan_created_at,
              care_plan_expired_on,
              care_plan_activated_on,
              ...patient
            } = patientsForDoctor[index] || {};
            patient["care_plan_id"] = care_plan_id;
            const { id = null } = { ...patient };

            if (allPatientIds.includes(id)) continue;

            allPatientIds.push(id);
            const patientData = await PatientWrapper(null, id);
            const { user_role_id = null } = await patientData.getAllInfo();
            patient["user_role_id"] = user_role_id;

            rowData.push({
              care_plans: {
                id: care_plan_id,
                details: care_plan_details,
                created_at: care_plan_created_at,
                expired_on: care_plan_expired_on,
                activated_on: care_plan_activated_on,
              },
              patients: {
                ...patient,
              },
            });
          }
        }
      }
      //count
      return raiseSuccess(
        res,
        200,
        {
          rowData,
          treatments,
          total: count,
        },
        "success"
      );
    } catch (error) {
      Logger.debug("getAllPatientsPagination 500", error);
      return raiseServerError(res);
    }
  };

  getAllPatientsPaginationBackup = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query, userDetails } = req;

      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryId,
      } = userDetails || {};

      let allPatientIds = [];

      /** TODO: Check if these are required now or not.
       userId (auth) [DOCTOR]
       
       SORT
       created_at [asc, desc]
       name [asc, desc]
       
       FILTER
       diagnosis [description, type]
       treatment
       
       doctors -> careplans -> patients
       */

      const {
        offset = 0,
        sort_name = null,
        sort_createdAt = null,
        filter_treatment = null,
        filter_diagnosis = null,
        watchlist = 0,
      } = query || {};

      const limit = process.config.PATIENT_LIST_SIZE_LIMIT;
      // 0

      const offsetLimit = parseInt(limit, 10) * parseInt(offset, 10);
      const endLimit = parseInt(limit, 10);
      const getWatchListPatients = parseInt(watchlist, 10) === 0 ? 0 : 1;

      let patientsForDoctor = [];

      let rowData = [];

      let count = 0;
      let treatments = {};

      // careplan ids as secondary doctor
      const {
        count: careplansCount = 0,
        rows: careplanAsSecondaryDoctor = [],
      } = await careplanSecondaryDoctorMappingService.findAndCountAll({
        where: {
          secondary_doctor_role_id: userRoleId,
        },
      });

      let careplanIdsAsSecondaryDoctor = [];

      if (careplansCount) {
        for (let each of careplanAsSecondaryDoctor) {
          const { care_plan: { id = null, patient_id = null } = {} } =
            each || {};
          careplanIdsAsSecondaryDoctor.push(id);
        }
      }

      const secondary_careplan_ids = careplanIdsAsSecondaryDoctor.toString()
        ? careplanIdsAsSecondaryDoctor.toString()
        : null;

      if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
        let watchlistQuery = "";
        const doctor = await doctorService.getDoctorByData({
          user_id: userId,
        });

        if (doctor && getWatchListPatients) {
          const doctorData = await DoctorWrapper(doctor);

          const doctorAllInfo = await doctorData.getAllInfo();
          // let { watchlist_patient_ids = []} = doctorAllInfo || {};
          let watchlist_patient_ids = [];
          const watchlistRecords =
            await doctorPatientWatchlistService.getAllByData({
              user_role_id: userRoleId,
            });

          // watchlisted patient ids

          if (watchlistRecords && watchlistRecords.length) {
            for (let i = 0; i < watchlistRecords.length; i++) {
              const watchlistWrapper = await DoctorPatientWatchlistWrapper(
                watchlistRecords[i]
              );
              const patientId = await watchlistWrapper.getPatientId();
              watchlist_patient_ids.push(patientId);
            }
          }
          watchlist_patient_ids = watchlist_patient_ids.length
            ? watchlist_patient_ids
            : null; // if no patient id watchlisted , check patinetIds for (null) as watchlist_patient_ids=[]
          watchlistQuery = `AND (carePlan.user_role_id = ${userRoleId} OR carePlan.id in ( ${secondary_careplan_ids} ) ) AND carePlan.patient_id IN (${watchlist_patient_ids})`;
          // let { watchlist_patient_ids = [] } = doctorAllInfo || {};
          // watchlist_patient_ids = watchlist_patient_ids.length
          //   ? watchlist_patient_ids
          //   : null; // if no patient id watchlisted , check patinetIds for (null) as watchlist_patient_ids=[]
          // watchlistQuery = `AND carePlan.doctor_id = ${userCategoryId} AND carePlan.patient_id IN (${watchlist_patient_ids})`;
        }

        // filter to get name sorted paginated data
        if (sort_name) {
          const order = sort_name === "0" ? "ASC" : "DESC";
          [count, patientsForDoctor] =
            (await carePlanService.getPaginatedPatients({
              doctor_id: userCategoryId,
              user_role_id: userRoleId,
              order: `patient.first_name ${order}`,
              offset: offsetLimit,
              limit: endLimit,
              watchlist: watchlistQuery,
              // watchlistPatientIds,
              // watchlist: getWatchListPatients,
              secondary_careplan_ids,
            })) || [];
        } else if (sort_createdAt) {
          // filter to get date sorted paginated data

          const order = sort_createdAt === "0" ? "ASC" : "DESC";
          [count, patientsForDoctor] =
            (await carePlanService.getPaginatedPatients({
              doctor_id: userCategoryId,
              user_role_id: userRoleId,
              order: `patient.created_at ${order}`,
              offset: offsetLimit,
              limit: endLimit,
              watchlist: watchlistQuery,
              secondary_careplan_ids,
            })) || [];
        } else if (filter_treatment) {
          const allTreatments =
            (await treatmentService.searchByName(filter_treatment)) || [];

          // get all treatment
          if (allTreatments.length > 0) {
            for (let index = 0; index < allTreatments.length; index++) {
              const treatment = await TreatmentWrapper(allTreatments[index]);
              treatments = {
                ...treatments,
                [treatment.getTreatmentId()]: treatment.getBasicInfo(),
              };
            }

            const treatmentIds =
              allTreatments.map((treatment) => treatment.id) || [];
            [count, patientsForDoctor] =
              (await carePlanService.getPaginatedPatients({
                doctor_id: userCategoryId,
                filter: `JSON_VALUE(carePlan.details, '$.treatment_id') IN (${treatmentIds}) 
             
              `,
                offset: offsetLimit,
                limit: endLimit,
                watchlist: watchlistQuery,
                user_role_id: userRoleId,
                secondary_careplan_ids,
              })) || [];
          }
        } else if (filter_diagnosis) {
          // diagnosis filter

          let diagnosis_type = null;

          if (DIAGNOSIS_TYPE.FINAL.text.includes(filter_diagnosis)) {
            diagnosis_type = DIAGNOSIS_TYPE.FINAL.id;
          } else if (DIAGNOSIS_TYPE.PROBABLE.text.includes(filter_diagnosis)) {
            diagnosis_type = DIAGNOSIS_TYPE.PROBABLE.id;
          } else {
            diagnosis_type = null;
          }
          [count, patientsForDoctor] =
            (await carePlanService.getPaginatedPatients({
              doctor_id: userCategoryId,
              user_role_id: userRoleId,
              filter: `(JSON_VALUE(carePlan.details, '$.diagnosis.description') LIKE '${filter_diagnosis}%' OR
                JSON_VALUE(carePlan.details, '$.diagnosis.type') = ${diagnosis_type})`,
              // TODO: Duplicate user_role_id, commenting it
              //user_role_id: userRoleId,
              offset: offsetLimit,
              limit: endLimit,
              watchlist: watchlistQuery,
              secondary_careplan_ids,
            })) || [];
        }
        if (patientsForDoctor.length > 0) {
          for (let index = 0; index < patientsForDoctor.length; index++) {
            const {
              care_plan_id,
              care_plan_details,
              care_plan_created_at,
              care_plan_expired_on,
              care_plan_activated_on,
              ...patient
            } = patientsForDoctor[index] || {};
            patient["care_plan_id"] = care_plan_id;
            const { id = null } = { ...patient };

            if (allPatientIds.includes(id)) {
              continue;
            }

            allPatientIds.push(id);
            const patientData = await PatientWrapper(null, id);
            const { user_role_id = null } = await patientData.getAllInfo();
            patient["user_role_id"] = user_role_id;

            rowData.push({
              care_plans: {
                id: care_plan_id,
                details: care_plan_details,
                created_at: care_plan_created_at,
                expired_on: care_plan_expired_on,
                activated_on: care_plan_activated_on,
              },
              patients: {
                ...patient,
              },
            });
          }
        }
      }
      //count
      return raiseSuccess(
        res,
        200,
        {
          rowData,
          treatments,
          total: count,
        },
        "success"
      );
    } catch (error) {
      Logger.debug("getAllPatientsPagination 500", error);
      return raiseServerError(res);
    }
  };

  acceptPaymentsTerms = async (req, res) => {
    const { raiseClientError } = this;
    try {
      const { userDetails: { userId } = {}, body: { acceptTerms } = {} } = req;

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
      const updatePatient = await patientService.update(
        {
          payment_terms_accepted: acceptTerms,
        },
        patientApiWrapper.getPatientId()
      );

      const updatePatientApiWrapper = await PatientWrapper(
        null,
        patientApiWrapper.getPatientId()
      );

      const dataToSend = {
        [updatePatientApiWrapper.getPatientId()]:
          updatePatientApiWrapper.getBasicInfo(),
      };

      return this.raiseSuccess(
        res,
        200,
        { patients: dataToSend },
        "Payment terms changed successfully."
      );
    } catch (error) {
      Logger.debug("acceptPaymentsTerms 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };

  getPatientById = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    const {
      params: { patient_id } = {},
      userDetails: { userCategoryId } = {},
    } = req;
    Logger.info(`params: patient_id = ${patient_id}`);

    if (!patient_id) {
      return raiseClientError(res, 422, {}, "Please select correct patient");
    }

    try {
      let patient = await patientService.getPatientById({ id: patient_id });
      let patientApiDetails = {};
      const patientWrapper = await PatientWrapper(patient);
      patientApiDetails[patientWrapper.getPatientId()] =
        await patientWrapper.getAllInfo();
      let userApiData = {};
      let apiUserDetails = {};

      const allUserData = await userService.getUserByData({
        id: patientWrapper.getUserId(),
      });

      await allUserData.forEach(async (user) => {
        apiUserDetails = await UserWrapper(user.get());

        userApiData[apiUserDetails.getId()] = apiUserDetails.getBasicInfo();
      });

      return this.raiseSuccess(
        res,
        200,
        { patients: { ...patientApiDetails }, users: { ...userApiData } },
        "Success."
      );
    } catch (error) {
      Logger.debug("getPatientReports 500 error", error);
      return raiseServerError(res);
    }
  };

  createPatient = async (req, res) => {
    try {
      const {
        mobile_number = "",
        name = "",
        patient_uid = "",
        gender = "",
        date_of_birth = "",
        prefix = "",
        comorbidities = "",
        allergies = "",
        clinical_notes = "",
        height = "",
        weight = "",
        symptoms = "",
        address = "",
      } = req.body;

      let { his_id } = req;

      if (
        patient_uid === null ||
        patient_uid === "" ||
        patient_uid === undefined
      ) {
        return raiseServerError(
          res,
          500,
          {},
          "please provide patient_ui as HIS Id."
        );
      }

      const userExists =
        (await userService.getPatientByMobile(mobile_number)) || [];

      const patientExistByHisId =
        (await patientService.getPatientByData({ uid: patient_uid })) || [];

      // TODO: add check his value.

      let userData = null;
      let patientData = null;
      let patientOtherDetails = {};
      let carePlanOtherDetails = {};

      if (comorbidities) {
        patientOtherDetails["comorbidities"] = comorbidities;
      }
      if (allergies) {
        patientOtherDetails["allergies"] = allergies;
      }
      if (clinical_notes) {
        carePlanOtherDetails["clinical_notes"] = clinical_notes;
      }
      if (symptoms) {
        carePlanOtherDetails["symptoms"] = symptoms;
      }

      const { first_name, middle_name, last_name } = getSeparateName(name);

      if (userExists.length > 0) {
        userData = await UserWrapper(userExists[0].get());
      }

      if (patientExistByHisId.length > 0) {
        let patientdetails = patientExistByHisId[0].get();
        let { user_id } = patientdetails;
        userData = await UserWrapper(null, user_id);
      }

      if (userExists.length > 0 || patientExistByHisId.length > 0) {
        const { patient_id } = await userData.getReferenceInfo();
        patientData = await PatientWrapper(null, patient_id);

        const previousDetails = patientData.getDetails();
        const updateResponse = await patientService.update(
          {
            height,
            weight,
            address,
            first_name,
            middle_name,
            last_name,
            gender,
            dob: date_of_birth,
            age: getAge(moment(date_of_birth)),
            details: { ...previousDetails, ...patientOtherDetails },
          },
          patient_id
        );

        patientData = await PatientWrapper(null, patient_id);
      } else {
        const password = process.config.DEFAULT_PASSWORD;
        const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
        const hash = await bcrypt.hash(password, salt);
        let useradddata = (useradddata = {
          prefix,
          mobile_number,
          password: hash,
          sign_in_type: SIGN_IN_CATEGORY.BASIC,
          category: USER_CATEGORY.PATIENT,
          onboarded: false,
          onboarding_status: ONBOARDING_STATUS.PATIENT.PROFILE_REGISTERED,
          verified: true,
          activated_on: moment().format(),
        });
        if (!(his_id == "" || his_id == undefined || his_id == null))
          useradddata = { ...useradddata, his_id };

        let user = await userService.addUser(useradddata);
        userData = await UserWrapper(user.get());

        if (clinical_notes) {
          carePlanOtherDetails["clinical_notes"] = clinical_notes;
        }
        if (symptoms) {
          carePlanOtherDetails["symptoms"] = symptoms;
        }

        let newUserId = userData.getId();
        // const uid = uuidv4();
        const birth_date = moment(date_of_birth);
        const age = getAge(date_of_birth);
        const patient = await patientService.addPatient({
          first_name,
          gender,
          middle_name,
          last_name,
          user_id: newUserId,
          birth_date,
          age,
          dob: date_of_birth,
          details: {
            ...patientOtherDetails,
          },
          height,
          weight,
          address,
        });
        const uid = patient_uid;

        const patientWrapper = await PatientWrapper(patient);
        const patientUserId = await patientWrapper.getUserId();
        const userRole = await userRolesService.create({
          user_identity: patientUserId,
        });
        const userRoleWrapper = await UserRoleWrapper(userRole);
        const newUserRoleId = await userRoleWrapper.getId();

        await userPreferenceService.addUserPreference({
          user_id: newUserId,
          details: {
            timings: PATIENT_MEAL_TIMINGS,
          },
          user_role_id: newUserRoleId,
        });
        await patientService.update({ uid }, patient.get("id"));
        patientData = await PatientWrapper(null, patient.get("id"));
      }

      const patient_id = patientData.getPatientId();

      return this.raiseSuccess(
        res,
        200,
        {
          patient_ids: [patient_id],
          users: {
            [userData.getId()]: userData.getBasicInfo(),
          },
          patients: {
            [patientData.getPatientId()]: {
              ...(await patientData.getAllInfo()),
            },
          },
        },
        "Patient added successfully"
      );
    } catch (error) {
      Logger.debug("ADD PATIENT 500 ERROR", error);
      return this.raiseServerError(res);
    }
  };
}

export default new PatientController();
