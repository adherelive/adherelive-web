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
import SymptomService from "../../services/symptom/symptom.service";
import VitalService from "../../services/vitals/vital.service";
import appointmentService from "../../services/appointment/appointment.service";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
import otpVerificationService from "../../services/otpVerification/otpVerification.service";
import ConsentService from "../../services/consents/consent.service";
import ReportService from "../../services/reports/report.service";
import conditionService from "../../services/condition/condition.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import doctorRegistrationService from "../../services/doctorRegistration/doctorRegistration.service";
import treatmentService from "../../services/treatment/treatment.service";
import doctorPatientWatchlistService from "../../services/doctorPatientWatchlist/doctorPatientWatchlist.service";


// WRAPPERS --------------------------------
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


import Log from "../../../libs/log";
import moment from "moment";
import {
  BODY_VIEW,
  CONSENT_TYPE,
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY,
  S3_DOWNLOAD_FOLDER,
  PRESCRIPTION_PDF_FOLDER, DIAGNOSIS_TYPE
} from "../../../constant";
import generateOTP from "../../helper/generateOtp";
import { EVENTS, Proxy_Sdk } from "../../proxySdk";
// import carePlan from "../../ApiWrapper/web/carePlan";
import generatePDF from "../../helper/generateCarePlanPdf";
import { downloadFileFromS3 } from "../user/userHelper";
import { getFilePath } from "../../helper/filePath";
import { checkAndCreateDirectory } from "../../helper/common";

// helpers
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

      console.log("\n\n PROFILE PIC FILE \n", req);

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
        // console.log("FIleStreammmmmmmmmmmmmHHH",fileStream);
        let hash = md5.create();
        hash.update(userId);
        hash.hex();
        hash = String(hash);
        const folder = "patients";
        // const fileExt = "";
        const file_name = hash.substring(4) + "-Report." + fileExt;
        const metaData = {
          "Content-Type":
            "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };
        const fileUrl = folder + "/" + file_name;
        await minioService.saveBufferObject(fileStream, fileUrl, metaData);

        console.log("file urlll: ", process.config.minio.MINI);
      }

      const patientData = {
        user_id: userId,
        first_name: splitName[0],
        middle_name: splitName.length > 2 ? splitName[2] : null,
        last_name: splitName.length > 1 ? splitName[1] : null,
        details: {
          // todo: profile_pic
        },
        uid: pid
      };
      // add patient for userId
      const patientDetails = await patientService.update(patientData);

      return this.raiseSuccess(
        res,
        200,
        {
          patients: {
            [patientDetails.getId]: {
              ...patientDetails.getBasicInfo
            }
          }
        },
        "patient details updated successfully"
      );
    } catch (error) {
      console.log("UPDATE PATIENT ERROR --> ", error);
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
        appointmentApiData[
          appointmentWrapper.getAppointmentId()
        ] = appointmentWrapper.getBasicInfo();

        const {
          appointment_docs
        } = await appointmentWrapper.getReferenceInfo();

        appointmentDocuments = { ...appointmentDocuments, ...appointment_docs };
        appointment_ids.push(appointmentWrapper.getAppointmentId());
      }

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            ...appointmentApiData
          },
          appointment_docs: {
            ...appointmentDocuments
          },
          appointment_ids
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
        id: medicineId
      });

      let medicineApiData = {};

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
          }
        },
        "Medications fetched successfully"
      );
    } catch (error) {
      Logger.debug("500 error ", error);
      return raiseServerError(res);
    }
  };

  getPatientCarePlanDetails = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { id: patient_id = 1 } = req.params;
      Logger.info(`params: patient_id = ${patient_id}`);
      const {
        userDetails: {
          userRoleId = null ,
          userId,
          userCategoryId,
          userData: { category } = {}
        } = {}
      } = req;

      if (!patient_id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct patient to continue"
        );
      }

      // get all careplans attached to patient
      const carePlans =
        (await carePlanService.getMultipleCarePlanByData({
          patient_id
        })) || [];

      let treatmentIds = [];

      let carePlanApiDetails = {};
      let carePlanIds = [];
      let latestCarePlanId = null;

      let doctorData = {};

      let appointmentApiDetails = {};
      let medicationApiDetails = {};
      let scheduleEventData = {};

      let templateMedicationData = {};

      let templateAppointmentData = {};

      let otherCarePlanTemplates = {};
      let medicineApiData = {};
      let carePlanTemplateIds = [];

      // for care plan templates
      let templateVitalData = {};

      // for vitals
      let vitalTemplateData = {};

      if (carePlans.length > 0) {
        const {
          care_plans,
          medicines,
            medications,
            appointments,
            doctors,
            schedule_events,
            care_plan_ids,
            current_careplan_id
        } = await carePlanHelper.getCareplanData({
          carePlans,
          userCategory: category,
          doctorId: userCategoryId,
          userRoleId
        });


        // care plans
        carePlanApiDetails = {...carePlanApiDetails, ...care_plans};

        // care plan ids
        carePlanIds = [...care_plan_ids];

        // latest care plan id
        latestCarePlanId = current_careplan_id;

        // doctors
        doctorData = {...doctorData, ...doctors};

        // appointments
        appointmentApiDetails = {...appointmentApiDetails, ...appointments};

        // medications
        medicationApiDetails = {...medicationApiDetails, ...medications};

        // schedule events
        scheduleEventData = {...scheduleEventData, ...schedule_events};

        // medicines
        medicineApiData = { ...medicineApiData, ...medicines };

        // get all treatment ids from careplan for templates
        Object.keys(care_plans).forEach(id => {
          const { details: { treatment_id } = {} } = care_plans[id] || {};
          treatmentIds.push(treatment_id);
        });
      }

      // get all careplan templates for user(doctor)
      const carePlanTemplates =
        (await carePlanTemplateService.getCarePlanTemplateData({
          user_id: userId,
          treatment_id: treatmentIds
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
              vital_templates,
            medicines
          } = await carePlanTemplate.getReferenceInfo();

          carePlanTemplateIds = [
            ...new Set([
              ...carePlanTemplateIds,
              ...Object.keys(care_plan_templates)
            ])
          ];

          // carePlanTemplateIds.push(...Object.keys(care_plan_templates));
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

          templateVitalData = {
            ...templateVitalData,
            ...template_vitals
          };

          vitalTemplateData = {
            ...vitalTemplateData,
            ...vital_templates
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

      // for (const carePlan of carePlans) {
      //   const carePlanData = await CarePlanWrapper(carePlan);
      //   const { doctors, doctor_id } = await carePlanData.getReferenceInfo();
      //   doctorData = { ...doctorData, ...doctors };
      //   if (category === USER_CATEGORY.DOCTOR && doctor_id === userCategoryId) {
      //     if (
      //       moment(carePlanData.getCreatedAt()).diff(
      //         moment(latestCarePlan),
      //         "minutes"
      //       ) > 0
      //     ) {
      //       latestCarePlan = carePlanData.getCreatedAt();
      //       latestCarePlanId = carePlanData.getCarePlanId();
      //     }
      //
      //     if (latestCarePlan === null) {
      //       latestCarePlan = carePlanData.getCreatedAt();
      //       latestCarePlanId = carePlanData.getCarePlanId();
      //     }
      //   }
      //
      //   const {
      //     treatment_id,
      //   } = carePlanData.getCarePlanDetails();
      //
      //   treatmentIds.push(treatment_id);
      //
      //   // const carePlanTemplates = await carePlanTemplateService.getCarePlanTemplateData(
      //   //     {
      //   //       treatment_id,
      //   //       severity_id,
      //   //       condition_id,
      //   //       user_id: userId
      //   //     }
      //   // );
      //
      //   let carePlanTemplateData = null;
      //
      //   Logger.info(`care plan template ---> ${carePlanData.getCarePlanTemplateId()}`);
      //   if (carePlanData.getCarePlanTemplateId()) {
      //     const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateById(
      //       carePlanData.getCarePlanTemplateId()
      //     );
      //     carePlanTemplateData = await CarePlanTemplateWrapper(
      //       carePlanTemplate
      //     );
      //
      //     // get template attached to careplan
      //     const {
      //       care_plan_templates,
      //       template_appointments,
      //       template_medications,
      //       medicines
      //     } = await carePlanTemplateData.getReferenceInfo();
      //
      //
      //     carePlanTemplateIds = [...new Set([...carePlanTemplateIds, ...Object.keys(care_plan_templates)])];
      //
      //     // carePlanTemplateIds.push(...Object.keys(care_plan_templates));
      //     otherCarePlanTemplates = {
      //       ...otherCarePlanTemplates,
      //       ...care_plan_templates
      //     };
      //     templateAppointmentData = {
      //       ...templateAppointmentData,
      //       ...template_appointments
      //     };
      //     templateMedicationData = {
      //       ...templateMedicationData,
      //       ...template_medications
      //     };
      //     medicineApiData = { ...medicineApiData, ...medicines };
      //
      //     // const medications = await templateMedicationService.getMedicationsByCarePlanTemplateId(
      //     //   carePlanData.getCarePlanTemplateId()
      //     // );
      //     //
      //     // for (const medication of medications) {
      //     //   const medicationData = await TemplateMedicationWrapper(medication);
      //     //   templateMedicationData[
      //     //     medicationData.getTemplateMedicationId()
      //     //   ] = medicationData.getBasicInfo();
      //     //   template_medication_ids.push(
      //     //     medicationData.getTemplateMedicationId()
      //     //   );
      //     //   medicine_ids.push(medicationData.getTemplateMedicineId());
      //     // }
      //     //
      //     // const appointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(
      //     //   carePlanData.getCarePlanTemplateId()
      //     // );
      //     //
      //     // for (const appointment of appointments) {
      //     //   const appointmentData = await TemplateAppointmentWrapper(
      //     //     appointment
      //     //   );
      //     //   templateAppointmentData[
      //     //     appointmentData.getTemplateAppointmentId()
      //     //   ] = appointmentData.getBasicInfo();
      //     //   template_appointment_ids.push(
      //     //     appointmentData.getTemplateAppointmentId()
      //     //   );
      //     // }
      //   }
      //
      //   const carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(
      //     carePlanData.getCarePlanId()
      //   );
      //
      //   for (const carePlanAppointment of carePlanAppointments) {
      //     appointment_ids.push(carePlanAppointment.get("appointment_id"));
      //   }
      //
      //   const appointments = await appointmentService.getAppointmentByData({
      //     id: appointment_ids
      //   });
      //   if (appointments.length > 0) {
      //     for (const appointment of appointments) {
      //       const appointmentData = await AppointmentWrapper(appointment);
      //
      //       const {
      //         appointments,
      //         schedule_events
      //       } = await appointmentData.getReferenceInfo();
      //       appointmentApiDetails = {
      //         ...appointmentApiDetails,
      //         ...appointments
      //       };
      //       scheduleEventData = { ...scheduleEventData, ...schedule_events };
      //       // appointmentApiDetails[appointmentData.getAppointmentId()] = appointmentData.getBasicInfo();
      //     }
      //   }
      //   const carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(
      //     carePlanData.getCarePlanId()
      //   );
      //
      //   for (const carePlanMedication of carePlanMedications) {
      //     medication_ids.push(carePlanMedication.get("medication_id"));
      //   }
      //
      //   const medications = await medicationReminderService.getMedicationsForParticipant(
      //     { id: medication_ids }
      //   );
      //   if (medications.length > 0) {
      //     for (const medication of medications) {
      //       const medicationWrapper = await MReminderWrapper(medication);
      //       const {medications: medicationData} = await medicationWrapper.getAllInfo();
      //       medicationApiDetails = {...medicationApiDetails, ...medicationData};
      //       medicine_ids.push(medicationWrapper.getMedicineId());
      //     }
      //   }
      //
      //   const medicineData = await medicineService.getMedicineByData({
      //     id: medicine_ids
      //   });
      //
      //   for (const medicine of medicineData) {
      //     const medicineWrapper = await MedicineApiWrapper(medicine);
      //     medicineApiData[
      //       medicineWrapper.getMedicineId()
      //     ] = medicineWrapper.getBasicInfo();
      //   }
      //
      //   if (carePlanTemplateData || carePlanTemplates.length > 0) {
      //     // Logger.debug(`786534546789098765234569090114 ---> ${patient_id} All Careplan Templates`,carePlanTemplates);
      //     //
      //     // for (const carePlanTemplate of carePlanTemplates) {
      //     //   carePlanTemplateData = await CarePlanTemplateWrapper(
      //     //     carePlanTemplate
      //     //   );
      //     //   Logger.debug(`786534546789098765234569090114 ---> ${patient_id} CARE PLAN TEMP Data`,carePlanTemplate);
      //     //
      //     //   const {
      //     //     care_plan_templates,
      //     //     template_appointments,
      //     //     template_medications,
      //     //     medicines
      //     //   } = await carePlanTemplateData.getReferenceInfo();
      //     //
      //     //
      //     //   carePlanTemplateIds = [...new Set([...carePlanTemplateIds, ...Object.keys(care_plan_templates)])];
      //     //
      //     //   // carePlanTemplateIds.push(...Object.keys(care_plan_templates));
      //     //   otherCarePlanTemplates = {
      //     //     ...otherCarePlanTemplates,
      //     //     ...care_plan_templates
      //     //   };
      //     //   templateAppointmentData = {
      //     //     ...templateAppointmentData,
      //     //     ...template_appointments
      //     //   };
      //     //   templateMedicationData = {
      //     //     ...templateMedicationData,
      //     //     ...template_medications
      //     //   };
      //     //   medicineApiData = { ...medicineApiData, ...medicines };
      //     // }
      //   } else {
      //     carePlanTemplateIds.push("1");
      //     otherCarePlanTemplates["1"] = {
      //       basic_info: {
      //         id: "1",
      //         name: "Blank Template"
      //       }
      //     };
      //   }
      //
      //   Logger.debug(`786534546789098765234569090114 ---> ${patient_id}`,carePlanTemplateIds);
      //
      //   carePlanApiDetails[
      //     carePlanData.getCarePlanId()
      //   ] = await carePlanData.getAllInfo();
      //   carePlanIds.push(carePlanData.getCarePlanId());
      // }

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

      return raiseSuccess(
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
          template_vitals: {
            ...templateVitalData,
          },
          vital_templates: {
            ...vitalTemplateData,
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
      // Logger.debug("get careplan 500 error ---> ", error);
      console.log("GET PATIENT DETAILS ERROR careplan --> ", error);
      return raiseServerError(res);
    }
  };

  getPatientSymptoms = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("req.params ----->", req.params);
      const { params: { patient_id } = {}, userDetails: { userId ,userRoleId = null ,userData: { category } = {} } = {} } = req;

      const carePlanData = await carePlanService.getSingleCarePlanByData({
        patient_id,
        [category === USER_CATEGORY.DOCTOR && 'user_role_id'] : category === USER_CATEGORY.DOCTOR && userRoleId
      });
      const carePlan = await CarePlanWrapper(carePlanData);

      const symptomData = await SymptomService.getAllByData({
        patient_id
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
          symptomDates.push(symptom.getCreatedDate());
        }

        symptomDates.sort((a, b) => {
          if (moment(a).isBefore(moment(b))) return 1;

          if (moment(a).isAfter(moment(b))) return -1;

          return 0;
        });
        // console.log("incident=============>", incidentLogs);
        // console.log("medicationLogs=============>", medicationLogs);
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
            upload_documents: {
              ...uploadDocumentData
            },
            symptom_dates: symptomDates
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
      Logger.debug("76235274523754328648273947293 getPatientSymptoms 500 error", error);
      return raiseServerError(res);
    }
  };

  getPatientVitals = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("3455432134532476567897", req.params);
      const {userDetails = {}} = req;
      const { params: { careplan_id } = {} ,userDetails : { userData: { category } = {}  } } = req;
      const {userRoleId = null } = userDetails  ; 

      let carePlan =null;
      let allVitals = [];
      carePlan = await carePlanService.getSingleCarePlanByData({
        id: careplan_id,
        [category === USER_CATEGORY.DOCTOR && 'user_role_id' ] : category === USER_CATEGORY.DOCTOR && userRoleId 
      });

      if(carePlan){
        
        allVitals = await VitalService.getAllByData({
          care_plan_id: carePlan.get("id")
        });
        
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

  getPatientPartSymptoms = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("req.params ----->", req.params);
      const {
        query: { duration = "5" } = {},
        params: { patient_id } = {},
        userDetails: { userId } = {}
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

        Object.values(BODY_VIEW).forEach(side => {
          const sideData = sideWiseParts[side] || {};
          if (sideData) {
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
          } else {
            sideWiseParts[side] = [];
          }
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
          Logger.debug("232323num", users);
          Logger.debug("232323num", patients);
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

  searchPatientForDoctor = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails: { userRoleId = null , userId } = {} } = req;
      const { query: { value = "" } = {} } = req;

      const isNumber = !isNaN(value);
      let doctorData = {};
      const patientIdsForThisDoc = [];
      const userIdsForForPatientForDoc = [];
      const doctor = await doctorService.getDoctorByUserId(parseInt(userId));
      const doctorDetails = await DoctorWrapper(doctor);
      doctorData[
        doctorDetails.getDoctorId()
      ] = await doctorDetails.getAllInfo();
      const { care_plan_ids : all_care_plan_ids = [] } = doctorData[doctorDetails.getDoctorId()];
      const care_plan_ids = all_care_plan_ids[userRoleId.toString()] || [];

      // console.log("32894723648723648726348762387462837462873462783",{care_plan_ids});

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

  patientConsentRequest = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        params: { id: patient_id } = {},
        userDetails: { userId, userRoleId } = {}
      } = req;

      const patient = await PatientWrapper(null, patient_id);

      const { users } = await patient.getReferenceInfo();
      const { basic_info: { prefix, mobile_number, email } = {} } = users[
        patient.getUserId()
      ];

      Logger.debug("patient_id ---> ", mobile_number);

      const otp = generateOTP();

      await otpVerificationService.delete({
        user_id: patient.getUserId()
      });

      await otpVerificationService.create({
        user_id: patient.getUserId(),
        otp
      });

      if (process.config.app.env === "development") {
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
        if (email) {
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
        userDetails: { userRoleId = null , userId, userData: { category } = {} } = {}
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
          patient_id,
          user_role_id: userRoleId
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

  createNewCareplanforPatient = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        clinical_notes = "",
        diagnosis_type = "1",
        diagnosis_description = "",
        treatment_id,
        severity_id,
        condition_id,
        symptoms = ""
      } = req.body;

      const { params: { patient_id } = {}, userDetails: { userRoleId = null ,  userId } = {} } = req;


      let userData = null;
      let patientData = null;
      let patientOtherDetails = {};
      let carePlanOtherDetails = {};

      if (clinical_notes) {
        carePlanOtherDetails["clinical_notes"] = clinical_notes;
      }
      if (symptoms) {
        carePlanOtherDetails["symptoms"] = symptoms;
      }

      if (clinical_notes) {
        carePlanOtherDetails["clinical_notes"] = clinical_notes;
      }
      if (symptoms) {
        carePlanOtherDetails["symptoms"] = symptoms;
      }

      patientData = await PatientWrapper(null, patient_id);

      const doctor = await doctorService.getDoctorByData({ user_id: userId });
      const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateData(
        {
          treatment_id,
          severity_id,
          condition_id,
          user_id: userId
        }
      );
      const care_plan_template_id = null;

      const details = {
        treatment_id,
        severity_id,
        condition_id,
        diagnosis: {
          type: diagnosis_type,
          description: diagnosis_description
        },
        ...carePlanOtherDetails
      };

      const carePlan = await carePlanService.addCarePlan({
        patient_id,
        user_role_id:userRoleId,
        doctor_id: doctor.get("id"),
        care_plan_template_id,
        details,
        created_at: moment()
      });

      const carePlanData = await CarePlanWrapper(carePlan);
      const care_plan_id = await carePlanData.getCarePlanId();
      let doctorData = {};
      const doctorIds = [];

      const carePlans = await carePlanService.getCarePlanByData({ 
        patient_id,
        user_role_id:userRoleId
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
          }
        }
      }

      return this.raiseSuccess(
        res,
        200,
        {
          care_plan_ids: [carePlanData.getCarePlanId()],
          care_plans: {
            [carePlanData.getCarePlanId()]: carePlanData.getBasicInfo()
          },
          doctors: {
            ...doctorData
          }
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
        userDetails: { userCategoryId } = {}
      } = req;
      Logger.info(`params: patient_id = ${patient_id}`);

      if (!patient_id) {
        return raiseClientError(res, 422, {}, "Please select correct patient");
      }

      const reportService = new ReportService();
      const allReports =
        (await reportService.getAllReportByData({
          patient_id
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
          report.getUploaderType() === USER_CATEGORY.DOCTOR &&
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
            id: doctorIds
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
            ...reportData
          },
          doctors: {
            ...doctorData
          },
          upload_documents: {
            ...documentData
          },
          report_ids: reportIds
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
      const { userDetails: { userData: { category } = {} } = {} } = req;

      const { userDetails: { userId = null } = {} } = req;

      // const carePlanId = parseInt(care_plan_id);

      let dataForPdf = {};

      let usersData = {};
      let qualifications = {};
      let degrees = {};
      let registrationsData = {};
      let conditions = {};
      let medications = {};
      let medicines = {};
      let nextAppointmentDuration = null;

      if (!care_plan_id) {
        return raiseClientError(res, 422, {}, "Invalid Care plan.");
      }

      const carePlan = await carePlanService.getCarePlanById(care_plan_id);
      const carePlanData = await CarePlanWrapper(carePlan);
      const curr_patient_id = carePlanData.getPatientId();

      Logger.info(`98172712983 curr_patient_id : ${curr_patient_id}`);

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

      let patient = null;

      if (category === USER_CATEGORY.DOCTOR) {
        patient = await patientService.getPatientById({id:curr_patient_id});
      } else {
        patient = await patientService.getPatientByUserId(userId);
      }

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

      let user_ids = [doctorUserId, userId];
      if (category === USER_CATEGORY.DOCTOR) {
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
        },
        currentTime: getDoctorCurrentTime(doctorUserId).format(
          "Do MMMM YYYY, hh:mm a"
        )
      };

      checkAndCreateDirectory(PRESCRIPTION_PDF_FOLDER);
      const pdfFileName = await generatePDF(dataForPdf, doctorSignImage);
      const pdfFile = `${pdfFileName}.pdf`;

      const options = {
        root: path.join(__dirname, `../../../${PRESCRIPTION_PDF_FOLDER}/`)
      };
      return res.sendFile(pdfFile, options);
    } catch (err) {
      Logger.debug(
        "3467238468327462387463287 Error got in the generate prescription: ",
        err
      );
      return raiseServerError(res);
    }
  };

  getAllPatientsPagination = async (req, res) => {
    const {raiseSuccess, raiseClientError, raiseServerError} = this;
    try {
      const {query, userDetails} = req;

      const {userId, userRoleId, userData: {category} = {}, userCategoryId} = userDetails || {};

       /*
      
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
        offset=0, 
        sort_name = null,
        sort_createdAt = null,
         filter_treatment = null,
         filter_diagnosis = null,
         watchlist = 0,
      } = query || {};


      const limit = process.config.PATIENT_LIST_SIZE_LIMIT;
      const offsetLimit = parseInt(limit, 10) * parseInt(offset, 10);
      const endLimit = parseInt(limit, 10);
      const getWatchListPatients = parseInt(watchlist, 10) === 0? 0: 1;




      

       let patientsForDoctor = [];

       let rowData = [];

       let count = null;
       let treatments = {};

      if(category === USER_CATEGORY.DOCTOR) {
        let watchlistQuery = "";
        const doctor = await doctorService.getDoctorByData({
          user_id: userId
        });

        if(doctor && getWatchListPatients)
        {
          const doctorData = await DoctorWrapper(doctor);


          const doctorAllInfo = await doctorData.getAllInfo();
          // let { watchlist_patient_ids = []} = doctorAllInfo || {};
          let watchlist_patient_ids = [];
          const watchlistRecords = await doctorPatientWatchlistService.getAllByData({user_role_id:userRoleId});
          if(watchlistRecords && watchlistRecords.length){
            for(let i = 0 ; i<watchlistRecords.length ; i++){
              const watchlistWrapper = await DoctorPatientWatchlistWrapper(watchlistRecords[i]);
              const patientId = await watchlistWrapper.getPatientId();
              watchlist_patient_ids.push(patientId);
            }
          }
          watchlist_patient_ids = watchlist_patient_ids.length ? watchlist_patient_ids : null; // if no patient id watchlisted , check patinetIds for (null) as watchlist_patient_ids=[]
          watchlistQuery = `AND carePlan.user_role_id = ${userRoleId} AND carePlan.patient_id IN (${watchlist_patient_ids})`;
        }

        if(sort_name) {
          const order = sort_name === "0" ? "ASC" : "DESC";
          [count, patientsForDoctor] = await carePlanService.getPaginatedPatients({
            doctor_id: userCategoryId,
            user_role_id: userRoleId,
            order: `patient.first_name ${order}`,
            offset: offsetLimit,
            limit: endLimit,
            watchlist: watchlistQuery,
            // watchlistPatientIds,
            // watchlist: getWatchListPatients
          }) || [];

        } else if(sort_createdAt) {
          const order = sort_createdAt === "0" ? "ASC" : "DESC";
          [count, patientsForDoctor] = await carePlanService.getPaginatedPatients({
            doctor_id: userCategoryId,
            user_role_id: userRoleId,
            order: `patient.created_at ${order}`,
            offset: offsetLimit,
            limit: endLimit,
            watchlist: watchlistQuery,
          }) || [];
        } else if(filter_treatment) {
          const allTreatments = await treatmentService.searchByName(filter_treatment) || [];

          // get all treatment
          if(allTreatments.length > 0) {
            for(let index = 0; index < allTreatments.length; index++) {
              const treatment = await TreatmentWrapper(allTreatments[index]);
              treatments = {...treatments, [treatment.getTreatmentId()]: treatment.getBasicInfo()};
            }

            const treatmentIds = allTreatments.map(treatment => treatment.id) || [];
            [count, patientsForDoctor] = await carePlanService.getPaginatedPatients({
              doctor_id: userCategoryId,
              filter: `JSON_VALUE(carePlan.details, '$.treatment_id') IN (${treatmentIds}) AND carePlan.user_role_id = ${userRoleId}`,
              offset: offsetLimit,
              limit: endLimit,
              watchlist: watchlistQuery,
            }) || [];
          }
        } else if(filter_diagnosis) {

          let diagnosis_type = null;

          if(DIAGNOSIS_TYPE.FINAL.text.includes(filter_diagnosis)) {
            diagnosis_type = DIAGNOSIS_TYPE.FINAL.id;
          }else if(DIAGNOSIS_TYPE.PROBABLE.text.includes(filter_diagnosis)) {
            diagnosis_type = DIAGNOSIS_TYPE.PROBABLE.id;
          }  else {
            diagnosis_type =null;
          }
          [count, patientsForDoctor] = await carePlanService.getPaginatedPatients({
            doctor_id: userCategoryId,
            user_role_id: userRoleId,
            filter:
                `(JSON_VALUE(carePlan.details, '$.diagnosis.description') LIKE '${filter_diagnosis}%' OR
                JSON_VALUE(carePlan.details, '$.diagnosis.type') = ${diagnosis_type}) AND carePlan.user_role_id = ${userRoleId} `,

            offset: offsetLimit,
            limit: endLimit,
            watchlist: watchlistQuery,
          }) || [];
        }

        Logger.debug("28346235423648762384762387462836487", {patientsForDoctor,count});

        if(patientsForDoctor.length > 0) {
          for(let index = 0; index < patientsForDoctor.length; index++) {
            const {care_plan_id, care_plan_details, care_plan_created_at, care_plan_expired_on,care_plan_activated_on, ...patient} = patientsForDoctor[index] || {};
            patient["care_plan_id"]=care_plan_id;

            // Logger.debug("7394246723647263472364239741",{patient:{...patient}});

            rowData.push({
              care_plans: {
                id: care_plan_id,
                details: care_plan_details,
                created_at: care_plan_created_at,
                expired_on: care_plan_expired_on,
                activated_on:care_plan_activated_on
              },
              patients: {
                ...patient
                
              },
            });
          }
        }
      }

      return raiseSuccess(res, 200, {
        rowData,
        treatments,
        total:count
      }, "success");

    } catch(error) {
      Logger.debug("getAllPatientsPagination 500", error);
      return raiseServerError(res);
    }
  };
}

export default new PatientController();
