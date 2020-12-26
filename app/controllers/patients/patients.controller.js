import Controller from "../";

// SERVICES --------------------------------
import userService from "../../../app/services/user/user.service";
import patientService from "../../../app/services/patients/patients.service";
import doctorService from "../../../app/services/doctor/doctor.service";
import doctorsService from "../../../app/services/doctors/doctors.service";
import minioService from "../../../app/services/minio/minio.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import carePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
import templateMedicationService from "../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../services/templateAppointment/templateAppointment.service";
import medicineService from "../../services/medicine/medicine.service";
import SymptomService from "../../services/symptom/symptom.service";
import VitalService from "../../services/vitals/vital.service";
import appointmentService from "../../services/appointment/appointment.service";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
import otpVerificationService from "../../services/otpVerification/otpVerification.service";
import ConsentService from "../../services/consents/consent.service";

// WRAPPERS --------------------------------
import VitalWrapper from "../../ApiWrapper/web/vitals";
import UserWrapper from "../../ApiWrapper/web/user";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import MReminderWrapper from "../../ApiWrapper/web/medicationReminder";
import CarePlanTemplateWrapper from "../../ApiWrapper/web/carePlanTemplate";
import TemplateMedicationWrapper from "../../ApiWrapper/web/templateMedication";
import TemplateAppointmentWrapper from "../../ApiWrapper/web/templateAppointment";
import MedicineApiWrapper from "../../ApiWrapper/mobile/medicine";
import SymptomWrapper from "../../ApiWrapper/web/symptoms";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import ConsentWrapper from "../../ApiWrapper/web/consent";
import PatientWrapper from "../../ApiWrapper/web/patient";

import Log from "../../../libs/log";
import moment from "moment";
import {
  BODY_VIEW,
  CONSENT_TYPE,
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY
} from "../../../constant";
import generateOTP from "../../helper/generateOtp";
import { EVENTS, Proxy_Sdk } from "../../proxySdk";
import carePlan from "../../ApiWrapper/web/carePlan";

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
        const {medications} = await medicationWrapper.getAllInfo();
        medicationApiData = {...medicationApiData, ...medications};
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
    try {
      Logger.debug("4356457454625344574635235435464");
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

      let carePlanTemplateIds = [];

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
            // appointmentApiDetails[appointmentData.getAppointmentId()] = appointmentData.getBasicInfo();
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
            const {medications: medicationData} = await medicationWrapper.getAllInfo();
            medicationApiDetails = {...medicationApiDetails, ...medicationData};
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
          Logger.debug(`786534546789098765234569090114 ---> ${patient_id} All Careplan Templates`,carePlanTemplates);

          for (const carePlanTemplate of carePlanTemplates) {
            carePlanTemplateData = await CarePlanTemplateWrapper(
              carePlanTemplate
            );
            Logger.debug(`786534546789098765234569090114 ---> ${patient_id} CARE PLAN TEMP Data`,carePlanTemplate);

            const {
              care_plan_templates,
              template_appointments,
              template_medications,
              medicines
            } = await carePlanTemplateData.getReferenceInfo();


            carePlanTemplateIds = [...new Set([...carePlanTemplateIds, ...Object.keys(care_plan_templates)])];

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

        Logger.debug(`786534546789098765234569090114 ---> ${patient_id}`,carePlanTemplateIds);

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
      // Logger.debug("get careplan 500 error ---> ", error);
      console.log("GET PATIENT DETAILS ERROR careplan --> ", error);
      return this.raiseServerError(res);
    }
  };

  getPatientSymptoms = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("req.params ----->", req.params);
      const { params: { patient_id } = {}, userDetails: { userId } = {} } = req;

      const carePlanData = await carePlanService.getSingleCarePlanByData({
        patient_id
      });
      const carePlan = await CarePlanWrapper(carePlanData);

      const symptomData = await SymptomService.getAllByData({
        patient_id,
        care_plan_id: carePlan.getCarePlanId()
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
      Logger.debug("getPatientSymptoms 500 error", error);
      return raiseServerError(res);
    }
  };

  getPatientVitals = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("3455432134532476567897", req.params);
      const { params: { careplan_id } = {} } = req;

      const carePlan = await carePlanService.getSingleCarePlanByData({
        id: careplan_id
      });
      const allVitals = await VitalService.getAllByData({
        care_plan_id: carePlan.get("id")
      });
      Logger.debug("786768767876757687", allVitals);

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
      const { userDetails: { userId } = {} } = req;
      const { query: { value = "" } = {} } = req;

      const isNumber = !isNaN(value);
      let doctorData = {};
      const patientIdsForThisDoc = [];
      const userIdsForForPatientForDoc = [];
      const doctor = await doctorsService.getDoctorByUserId(parseInt(userId));
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

  patientConsentRequest = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        params: { id: patient_id } = {},
        userDetails: { userId } = {}
      } = req;

      const patient = await PatientWrapper(null, patient_id);

      const { users } = await patient.getReferenceInfo();
      const { basic_info: { mobile_number } = {} } = users[patient.getUserId()];

      Logger.debug("patient_id ---> ", mobile_number);

      const otp = generateOTP();

      await otpVerificationService.delete({
        user_id: patient.getUserId()
      });

      await otpVerificationService.create({
        user_id: patient.getUserId(),
        otp
      });

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

      const { params: { patient_id } = {}, userDetails: { userId } = {} } = req;

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
        doctor_id: doctor.get("id"),
        care_plan_template_id,
        details,
        created_at: moment()
      });

      const carePlanData = await CarePlanWrapper(carePlan);
      const care_plan_id = await carePlanData.getCarePlanId();
      let doctorData = {};
      const doctorIds = [];

      const carePlans = await carePlanService.getCarePlanByData({ patient_id });

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
}

export default new PatientController();
