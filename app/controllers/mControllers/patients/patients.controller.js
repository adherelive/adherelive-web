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

// WRAPPERS ------------
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
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import UserWrapper from "../../../ApiWrapper/mobile/user";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import CarePlanTemplateWrapper from "../../../ApiWrapper/mobile/carePlanTemplate";
import AppointmentWrapper from "../../../ApiWrapper/mobile/appointments";
import TemplateMedicationWrapper from "../../../ApiWrapper/mobile/templateMedication";
import TemplateAppointmentWrapper from "../../../ApiWrapper/mobile/templateAppointment";
import SymptomWrapper from "../../../ApiWrapper/mobile/symptoms";

import templateMedicationService from "../../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../../services/templateAppointment/templateAppointment.service";
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
  PRESCRIPTION_PDF_FOLDER
} from "../../../../constant";
import generateOTP from "../../../helper/generateOtp";
import otpVerificationService from "../../../services/otpVerification/otpVerification.service";
import { EVENTS, Proxy_Sdk } from "../../../proxySdk";
import doctorService from "../../../services/doctor/doctor.service";
import generatePDF from "../../../helper/generateCarePlanPdf";
import { downloadFileFromS3 } from "../user/userHelper";
import { getFilePath } from "../../../helper/filePath";
import { checkAndCreateDirectory } from "../../../helper/common";

const path = require("path");

const Logger = new Log("mobile patient controller");

class MPatientController extends Controller {
  constructor() {
    super();
  }

  mUpdatePatient = async (req, res) => {
    try {
      // console.log("-------------- req.body ------------", req.body);
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
        const { value } = timings["1"];
        const prevUserPreference = await UserPreferenceService.getPreferenceByData(
          { user_id: userId }
        );
        let addTimingPreference = null;
        if (!prevUserPreference) {
          addTimingPreference = await UserPreferenceService.addUserPreference({
            user_id: userId,
            details: {
              timings
            }
          });
        } else {
          const userPreferenceWrapper = await UserPreferenceWrapper(
            prevUserPreference
          );
          const userPreferenceId = userPreferenceWrapper.getUserPreferenceId();
          addTimingPreference = await UserPreferenceService.updateUserPreferenceData(
            {
              user_id: userId,
              details: {
                timings
              }
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

      const patientData = {
        user_id: userId,
        first_name: splitName[0],
        middle_name: splitName.length > 2 ? splitName[2] : "",
        last_name: splitName.length > 1 ? splitName[1] : "",
        ...prevBasicInfo,
        details: {
          // todo: profile_pic
          ...previousDetails,
          profile_pic: profilePicUrl
        }
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
            [updatedUserDetails.getId()]: updatedUserDetails.getBasicInfo()
          },
          patients: {
            [patientApiWrapper.getPatientId()]: {
              ...patientApiWrapper.getBasicInfo()
            }
          }
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
      const { params: { id } = {}, userDetails: { userId } = {} } = req;

      const appointmentList = await appointmentService.getAppointmentForPatient(
        id
      );

      let appointmentApiData = {};
      let scheduleEventData = {};
      let appointmentDocuments = {};
      let appointment_ids = [];

      for (const appointment of appointmentList) {
        const appointmentWrapper = await AppointmentWrapper(appointment);

        const {
          appointments,
          schedule_events,
          appointment_docs
        } = await appointmentWrapper.getReferenceInfo();
        appointmentApiData = { ...appointmentApiData, ...appointments };
        scheduleEventData = { ...scheduleEventData, ...schedule_events };
        appointmentDocuments = { ...appointmentDocuments, ...appointment_docs };
      }

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            ...appointmentApiData
          },
          schedule_events: {
            ...scheduleEventData
          },
          appointment_docs: {
            ...appointmentDocuments
          },
          appointment_ids: Object.keys(appointmentApiData)
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

      const medicationDetails = await medicationReminderService.getMedicationsForParticipant(
        { participant_id: id }
      );

      // console.log("712367132 medicationDetails --> ", medicationDetails);
      // Logger.debug("medication details", medicationDetails);

      let medicationApiData = {};
      let scheduleEventApiData = {};
      let medicineId = [];

      for (const medication of medicationDetails) {
        const medicationWrapper = await MReminderWrapper(medication);
        const {
          medications,
          schedule_events
        } = await medicationWrapper.getReferenceInfo();
        medicationApiData = {
          ...medicationApiData,
          ...{ [medicationWrapper.getMReminderId()]: medications }
        };
        scheduleEventApiData = { ...scheduleEventApiData, ...schedule_events };
        medicineId.push(medicationWrapper.getMedicineId());
      }

      Logger.debug("medicineId", medicineId);

      const medicineData = await medicineService.getMedicineByData({
        id: medicineId
      });

      let medicineApiData = {};

      Logger.debug("medicineData", medicineData);

      for (const medicine of medicineData) {
        const medicineWrapper = await MedicineApiWrapper(medicine);
        medicineApiData[
          medicineWrapper.getMedicineId()
        ] = medicineWrapper.getBasicInfo();
      }

      Logger.debug("medicineData", medicineData);

      return raiseSuccess(
        res,
        200,
        {
          medications: {
            ...medicationApiData
          },
          medicines: {
            ...medicineApiData
          },
          schedule_events: {
            ...scheduleEventApiData
          }
        },
        "Medications fetched successfully"
      );
    } catch (error) {
      Logger.debug("medication get 500 error ", error);
      return raiseServerError(res);
    }
  };

  getPatientCarePlanDetails = async (req, res) => {
    try {
      const { id: patient_id = 1 } = req.params;
      const {
        userDetails: {
          userId,
          userCategoryId,
          userData: { category } = {}
        } = {}
      } = req;

      let show = false;

      let doctorData = {};

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

      const carePlanTemplateIds = [];

      let latestCarePlan = null;
      let latestCarePlanId = null;

      const carePlanIds = [];

      const carePlans = await carePlanService.getMultipleCarePlanByData({
        patient_id
      });
      for (const carePlan of carePlans) {
        const carePlanData = await CarePlanWrapper(carePlan);
        const { doctors, doctor_id } = await carePlanData.getReferenceInfo();
        doctorData = { ...doctorData, ...doctors };

        if (category === USER_CATEGORY.DOCTOR && doctor_id === userCategoryId) {
          if (
            moment(carePlanData.getCreatedAt()).diff(
              moment(latestCarePlan),
              "minutes"
            ) > 0
          ) {
            latestCarePlan = carePlanData.getCreatedAt();
            latestCarePlanId = carePlanData.getCarePlanId();
          }

          if (latestCarePlan === null) {
            latestCarePlan = carePlanData.getCreatedAt();
            latestCarePlanId = carePlanData.getCarePlanId();
          }
        }

        const {
          treatment_id,
          severity_id,
          condition_id
        } = carePlanData.getCarePlanDetails();

        const carePlanTemplates = await carePlanTemplateService.getCarePlanTemplateData(
          {
            treatment_id,
            severity_id,
            condition_id,
            user_id: userId
          }
        );

        let carePlanTemplateData = null;

        if (carePlanData.getCarePlanTemplateId()) {
          const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateById(
            carePlanData.getCarePlanTemplateId()
          );
          carePlanTemplateData = await CarePlanTemplateWrapper(
            carePlanTemplate
          );
          const medications = await templateMedicationService.getMedicationsByCarePlanTemplateId(
            carePlanData.getCarePlanTemplateId()
          );

          for (const medication of medications) {
            const medicationData = await TemplateMedicationWrapper(medication);
            templateMedicationData[
              medicationData.getTemplateMedicationId()
            ] = medicationData.getBasicInfo();
            template_medication_ids.push(
              medicationData.getTemplateMedicationId()
            );
            medicine_ids.push(medicationData.getTemplateMedicineId());
          }

          const appointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(
            carePlanData.getCarePlanTemplateId()
          );

          for (const appointment of appointments) {
            const appointmentData = await TemplateAppointmentWrapper(
              appointment
            );
            templateAppointmentData[
              appointmentData.getTemplateAppointmentId()
            ] = appointmentData.getBasicInfo();
            template_appointment_ids.push(
              appointmentData.getTemplateAppointmentId()
            );
          }
        }

        const carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(
          carePlanData.getCarePlanId()
        );

        for (const carePlanAppointment of carePlanAppointments) {
          appointment_ids.push(carePlanAppointment.get("appointment_id"));
        }

        const appointments = await appointmentService.getAppointmentByData({
          id: appointment_ids
        });
        if (appointments.length > 0) {
          for (const appointment of appointments) {
            const appointmentData = await AppointmentWrapper(appointment);

            const {
              appointments,
              schedule_events
            } = await appointmentData.getReferenceInfo();
            appointmentApiDetails = {
              ...appointmentApiDetails,
              ...appointments
            };
            scheduleEventData = { ...scheduleEventData, ...schedule_events };
            // appointmentApiDetails[
            //   appointmentData.getAppointmentId()
            // ] = appointmentData.getBasicInfo();
          }
        }
        const carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(
          carePlanData.getCarePlanId()
        );

        for (const carePlanMedication of carePlanMedications) {
          medication_ids.push(carePlanMedication.get("medication_id"));
        }

        const medications = await medicationReminderService.getMedicationsForParticipant(
          { id: medication_ids }
        );
        if (medications.length > 0) {
          for (const medication of medications) {
            const medicationWrapper = await MReminderWrapper(medication);
            const {
              medications: medicationData,
              schedule_events
            } = await medicationWrapper.getReferenceInfo();
            medicationApiDetails = {
              ...medicationApiDetails,
              ...medicationData
            };
            scheduleEventData = { ...scheduleEventData, ...schedule_events };
            medicine_ids.push(medicationWrapper.getMedicineId());
          }
        }

        const medicineData = await medicineService.getMedicineByData({
          id: medicine_ids
        });

        for (const medicine of medicineData) {
          const medicineWrapper = await MedicineApiWrapper(medicine);
          medicineApiData[
            medicineWrapper.getMedicineId()
          ] = medicineWrapper.getBasicInfo();
        }

        if (carePlanTemplateData || carePlanTemplates.length > 0) {
          for (const carePlanTemplate of carePlanTemplates) {
            carePlanTemplateData = await CarePlanTemplateWrapper(
              carePlanTemplate
            );
            const {
              care_plan_templates,
              template_appointments,
              template_medications,
              medicines
            } = await carePlanTemplateData.getReferenceInfo();
            carePlanTemplateIds.push(...Object.keys(care_plan_templates));
            otherCarePlanTemplates = {
              ...otherCarePlanTemplates,
              ...care_plan_templates
            };
            templateAppointmentData = {
              ...templateAppointmentData,
              ...template_appointments
            };
            templateMedicationData = {
              ...templateMedicationData,
              ...template_medications
            };
            medicineApiData = { ...medicineApiData, ...medicines };
          }
        } else {
          carePlanTemplateIds.push("1");
          otherCarePlanTemplates["1"] = {
            basic_info: {
              id: "1",
              name: "Blank Template"
            }
          };
        }

        carePlanApiDetails[
          carePlanData.getCarePlanId()
        ] = await carePlanData.getAllInfo();
        carePlanIds.push(carePlanData.getCarePlanId());
      }

      const symptomData = await SymptomService.getAllByData({ patient_id });

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

      return this.raiseSuccess(
        res,
        200,
        {
          current_careplan_id: latestCarePlanId,
          care_plan_ids: carePlanIds,
          doctors: {
            ...doctorData
          },
          care_plans: {
            ...carePlanApiDetails
          },
          care_plan_template_ids: [...carePlanTemplateIds],
          care_plan_templates: {
            ...otherCarePlanTemplates
          },
          appointments: {
            ...appointmentApiDetails
          },
          medications: {
            ...medicationApiDetails
          },
          symptoms: {
            ...symptomDetails
          },
          upload_documents: {
            ...uploadDocumentData
          },
          template_appointments: {
            ...templateAppointmentData
          },
          template_medications: {
            ...templateMedicationData
          },
          medicines: {
            ...medicineApiData
          },
          schedule_events: {
            ...scheduleEventData
          }
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
          symptomDates.push(symptom.getCreatedDate());
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
        symptomDates.forEach(date => {
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
              ...dateWiseSymptoms
            },
            // symptom_parts: {
            //   ...sideWiseParts
            // },
            upload_documents: {
              ...uploadDocumentData
            },
            symptom_dates: symptomDates
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
      const {
        query: { duration = "5" } = {},
        params: { patient_id } = {}
      } = req;

      const currentTime = moment()
        .utc()
        .toISOString();
      const historyTime = moment()
        .subtract(duration, "days")
        .utc()
        .toISOString();

      const symptomData = await SymptomService.getFilteredData({
        patient_id,
        start_time: historyTime,
        end_time: currentTime
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

        Object.values(BODY_VIEW).forEach(side => {
          const sideData = sideWiseParts[side] || {};
          Object.keys(sideData).forEach(part => {
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
              ...sideWiseParts
            },
            upload_documents: {
              ...uploadDocumentData
            }
          },
          "Symptoms data fetched successfully"
        );
      } else {
        Object.values(BODY_VIEW).forEach(side => {
          sideWiseParts[side] = [];
        });
        return raiseSuccess(
          res,
          200,
          {
            symptom_parts: {
              ...sideWiseParts
            },
            upload_documents: {
              ...uploadDocumentData
            }
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
        patient_id
      });

      let allVitals = [];

      for (const carePlan of carePlans) {
        const vitals = await VitalService.getAllByData({
          care_plan_id: carePlan.get("id")
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
          const {
            vital_templates,
            care_plans
          } = await vital.getReferenceInfo();

          vitalDetails = { ...vitalDetails, ...vitals };

          vitalTemplateDetails = {
            ...vitalTemplateDetails,
            ...vital_templates
          };
          carePlanTemplateDetails = {
            ...carePlanTemplateDetails,
            ...care_plans
          };
        }

        return raiseSuccess(
          res,
          200,
          {
            vitals: {
              ...vitalDetails
            },
            vital_templates: {
              ...vitalTemplateDetails
            },
            care_plans: {
              ...carePlanTemplateDetails
            },
            vital_ids: Object.keys(vitalDetails)
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
              ...userDetails
            },
            patients: {
              ...patientDetails
            },
            patient_ids: patientIds
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
      const {
        params: { id: patient_id } = {},
        userDetails: { userId } = {}
      } = req;

      const patient = await PatientWrapper(null, patient_id);

      // const { users } = await patient.getReferenceInfo();
      const users = await UserWrapper(null, patient.getUserId());

      const { basic_info: { prefix, mobile_number, email } = {} } = users.getBasicInfo();

      Logger.debug("patient_id ---> ", mobile_number);

      const otp = generateOTP();

      await otpVerificationService.delete({
        user_id: patient.getUserId()
      });

      await otpVerificationService.create({
        user_id: patient.getUserId(),
        otp
      });

      if(process.config.app.env === "development") {
        const emailPayload = {
          title: "OTP Consent verification for patient",
          toAddress: process.config.app.developer_email,
          templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
          templateData: {
            title: "Patient",
            mainBodyText: "OTP for adhere patient consent is",
            subBodyText: otp,
            host: process.config.WEB_URL,
            contactTo: process.config.app.support_email
          }
        };
        Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
      } else {

        if(email) {
          const emailPayload = {
            title: "OTP Consent verification for patient",
            toAddress: email,
            templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
            templateData: {
              title: "Patient",
              mainBodyText: "OTP for adhere patient consent is",
              subBodyText: otp,
              host: process.config.WEB_URL,
              contactTo: process.config.app.support_email
            }
          };
          Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
        }

        const smsPayload = {
          // countryCode: prefix,
          phoneNumber: `+${prefix}${mobile_number}`, // mobile_number
          message: `Hello from Adhere! Your OTP for Consent Request is ${otp}`
        };

        Proxy_Sdk.execute(EVENTS.SEND_SMS, smsPayload);
      }

      return raiseSuccess(
        res,
        200,
        {
          user_id: patient.getUserId()
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
        userDetails: { userId, userData: { category } = {} } = {}
      } = req;

      // service instance
      const consentService = new ConsentService();

      const otpVerification = await otpVerificationService.getOtpByData({
        otp,
        user_id
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

        if (category === USER_CATEGORY.DOCTOR) {
          authDoctor = await doctorService.getDoctorByData({ user_id: userId });
        }

        const consentData = await consentService.create({
          type: CONSENT_TYPE.CARE_PLAN,
          doctor_id: authDoctor.get("id"),
          patient_id
        });
        const consents = await ConsentWrapper({ data: consentData });

        const carePlans = await carePlanService.getCarePlanByData({
          patient_id
        });

        if (carePlans.length > 0) {
          for (let i = 0; i < carePlans.length; i++) {
            const carePlan = await CarePlanWrapper(carePlans[i]);
            doctorIds.push(carePlan.getDoctorId());
          }
        }

        if (doctorIds.length > 0) {
          const doctors = await doctorService.getAllDoctorByData({
            id: doctorIds
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
              ...doctorData
            },
            patients: {
              [patient.getPatientId()]: {
                ...patient.getBasicInfo(),
                consent_ids: [consents.getConsentId()]
              }
            },
            consents: {
              [consents.getConsentId()]: consents.getBasicInfo()
            }
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
      const { userDetails: { userId } = {} } = req;
      const { query: { value = "" } = {} } = req;

      const isNumber = !isNaN(value);
      let doctorData = {};
      const patientIdsForThisDoc = [];
      const userIdsForForPatientForDoc = [];
      const doctor = await DoctorService.getDoctorByUserId(parseInt(userId));
      const doctorDetails = await DoctorWrapper(doctor);
      doctorData[
        doctorDetails.getDoctorId()
      ] = await doctorDetails.getAllInfo();
      const { care_plan_ids = [] } = doctorData[doctorDetails.getDoctorId()];

      for (const each_id of care_plan_ids) {
        let thisCarePlanData = await userService.getCarePlanData(each_id);
        const { dataValues: { patient_id = null } = {} } = thisCarePlanData;
        patientIdsForThisDoc.push(patient_id);
        const {
          dataValues: { user_id = null } = {}
        } = await patientService.getPatientByIdForPatientSearch(patient_id);
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
            const {
              basic_info: { id: current_patient_id = null } = {}
            } = Object.values(patients)[0];
            patientIds.push(current_patient_id);
            userDetails = { ...userDetails, ...users };
            patientDetails = { ...patientDetails, ...patients };
          }

          return raiseSuccess(
            res,
            200,
            {
              users: {
                ...userDetails
              },
              patients: {
                ...patientDetails
              },
              patient_ids: patientIds
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

            const {
              users,
              patients,
              patient_id
            } = await user.getReferenceInfo();
            patientIds.push(patient_id);
            userDetails = { ...userDetails, ...users };
            patientDetails = { ...patientDetails, ...patients };
          }

          return raiseSuccess(
            res,
            200,
            {
              users: {
                ...userDetails
              },
              patients: {
                ...patientDetails
              },
              patient_ids: patientIds
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
      const { userDetails: { userId = null } = {} } = req;

      const carePlanId = parseInt(care_plan_id);

      let dataForPdf = {};

      let usersData = {};
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

      const carePlan = await carePlanService.getCarePlanById(carePlanId);
      const carePlanData = await CarePlanWrapper(carePlan);

      const carePlanCreatedDate = carePlanData.getCreatedAt();

      const {
        details: { condition_id = null } = {},
        medication_ids = [],
        appointment_ids = []
      } = await carePlanData.getAllInfo();

      const conditionData = await conditionService.getByData({
        id: condition_id
      });
      if (conditionData) {
        const condition = await ConditionWrapper(conditionData);
        conditions[condition_id] = condition.getBasicInfo();
      }

      for (const medicationId of medication_ids) {
        const medication = await medicationReminderService.getMedication({
          id: medicationId
        });

        if (medication) {
          const medicationWrapper = await MReminderWrapper(medication);
          const medicineId = medicationWrapper.getMedicineId();
          const medicineData = await medicineService.getMedicineByData({
            id: medicineId
          });

          for (const medicine of medicineData) {
            const medicineWrapper = await MedicineApiWrapper(medicine);
            medicines = {
              ...medicines,
              ...{
                [medicineWrapper.getMedicineId()]: medicineWrapper.getBasicInfo()
              }
            };
          }
          medications = {
            ...medications,
            ...{ [medicationId]: medicationWrapper.getBasicInfo() }
          };
        }
      }

      const now = moment();
      let nextAppointment = null;
      for (const appointmentId of appointment_ids) {
        const appointment = await appointmentService.getAppointmentById(
          appointmentId
        );

        if (appointment) {
          const appointmentWrapper = await AppointmentWrapper(appointment);

          const startDate = appointmentWrapper.getStartTime();
          const startDateObj = moment(startDate);

          const diff = startDateObj.diff(now);

          if (diff > 0) {
            if (!nextAppointment || nextAppointment.diff(startDateObj) > 0) {
              nextAppointment = startDateObj;
            }
          }
        }
      }

      if (nextAppointment) {
        nextAppointmentDuration =
          nextAppointment.diff(now, "days") !== 0
            ? `${nextAppointment.diff(now, "days")} days`
            : `${nextAppointment.diff(now, "hours")} hours`;
      }

      const patient = await patientService.getPatientByUserId(userId);

      const patientData = await PatientWrapper(patient);

      const { doctors, doctor_id } = await carePlanData.getReferenceInfo();

      const {
        [doctor_id]: {
          basic_info: { signature_pic = "", full_name = "" } = {}
        } = {}
      } = doctors;

      checkAndCreateDirectory(S3_DOWNLOAD_FOLDER);

      const doctorSignImage = `${S3_DOWNLOAD_FOLDER}/${full_name}.jpeg`;

      const downloadImage = await downloadFileFromS3(
        getFilePath(signature_pic),
        doctorSignImage
      );

      const doctorQualifications = await qualificationService.getQualificationsByDoctorId(
        doctor_id
      );

      await doctorQualifications.forEach(async doctorQualification => {
        const doctorQualificationWrapper = await QualificationWrapper(
          doctorQualification
        );
        const degreeId = doctorQualificationWrapper.getDegreeId();
        const degreeWrapper = await DegreeWrapper(null, degreeId);
        degrees[degreeId] = degreeWrapper.getBasicInfo();
      });

      const doctorRegistrations = await doctorRegistrationService.getRegistrationByDoctorId(
        doctor_id
      );

      for (const doctorRegistration of doctorRegistrations) {
        const registrationData = await RegistrationWrapper(doctorRegistration);
        const council_id = registrationData.getCouncilId();
        const councilWrapper = await CouncilWrapper(null, council_id);

        const regData = registrationData.getBasicInfo();
        const { basic_info: { number = "" } = {} } = regData;
        registrationsData[registrationData.getDoctorRegistrationId()] = {
          number,
          council: councilWrapper.getBasicInfo()
        };
      }

      const {
        [`${doctor_id}`]: { basic_info: { user_id: doctorUserId = null } = {} }
      } = doctors;

      const user_ids = [doctorUserId, userId];
      for (const id of user_ids) {
        const intId = parseInt(id);
        const user = await userService.getUserById(intId);

        if (user) {
          const userWrapper = await UserWrapper(user.get());
          usersData = { ...usersData, ...{ [id]: userWrapper.getBasicInfo() } };
        }
      }

      dataForPdf = {
        users: { ...usersData },
        medications,
        medicines,
        care_plans: {
          [carePlanData.getCarePlanId()]: {
            ...carePlanData.getBasicInfo()
          }
        },
        doctors,
        degrees,
        conditions,
        registrations: registrationsData,
        creationDate: carePlanCreatedDate,
        nextAppointmentDuration,
        patients: {
          ...{ [patientData.getPatientId()]: patientData.getBasicInfo() }
        }
      };

      checkAndCreateDirectory(PRESCRIPTION_PDF_FOLDER);
      const pdfFileName = await generatePDF(dataForPdf, doctorSignImage);
      const pdfFile = `${pdfFileName}.pdf`;

      const options = {
        root: path.join(__dirname, `../../../../${PRESCRIPTION_PDF_FOLDER}/`)
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
        user_id: userId
      });
      const userPreferenceWrapper = await UserPreferenceWrapper(userPreference);
      const userPreferenceData = userPreferenceWrapper.getBasicInfo();
      return raiseSuccess(
        res,
        201,
        {
          user_preference: {
            ...userPreferenceData
          }
        },
        "User preference fetched successfully."
      );
    } catch (err) {
      Logger.debug("Error got in the get patient timings: ", err);
      return raiseServerError(res);
    }
  };
}

export default new MPatientController();
