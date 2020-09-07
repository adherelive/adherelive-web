import Controller from "../../";
import userService from "../../../services/user/user.service";
import patientService from "../../../services/patients/patients.service";
import minioService from "../../../services/minio/minio.service";

import PatientWrapper from "../../../ApiWrapper/mobile/patient";

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
import moment from "moment";
import {BODY_VIEW} from "../../../../constant";

const Logger  = new Log("mobile patient controller");

class MPatientController extends Controller {
  constructor() {
    super();
  }

  mUpdatePatient = async (req, res) => {
    try {
      console.log("-------------- req.body ------------", req.body);
      const { userDetails, body } = req;
      const { profile_pic, name, email } = body || {};
      const { userId = "3" } = userDetails || {};

      if (email) {
        const updateUserDetails = await userService.updateEmail(email, userId);
      }

      const patientDetails = await patientService.getPatientByUserId(userId);
      const initialPatientData = await PatientWrapper(patientDetails);

      const splitName = name.split(" ");

      let profilePic = "";

      Logger.debug("error cause --> ", profile_pic.indexOf(";base64"));

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

        console.log("file ------> ", file);

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

      Logger.debug("18371823 profilePicUrl ---> ", profilePicUrl);

      // todo minio configure here

      const previousDetails = await initialPatientData.getDetails() || {};

      const patientData = {
        user_id: userId,
        first_name: splitName[0],
        middle_name: splitName.length > 2 ? splitName[2] : null,
        last_name: splitName.length > 1 ? splitName[1] : null,
        details: {
          // todo: profile_pic
          ...previousDetails,
          profile_pic: profilePicUrl,
        },
      };

      const updatedpatientDetails = await patientService.updatePatient(patientDetails, patientData);
        const updateUser = await userService.updateUser({onboarded: true, onboarding_status: null}, userId);

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
    const {raiseServerError, raiseSuccess} = this;
    try {
      const { params: { id } = {}, userDetails: { userId } = {} } = req;

      const appointmentList = await appointmentService.getAppointmentForPatient(
          id
      );
      // Logger.debug("appointmentList", appointmentList);

      // if (appointmentList.length > 0) {
      let appointmentApiData = {};
      let appointment_ids = [];

      for(const appointment of appointmentList) {
        const appointmentWrapper = await AppointmentWrapper(appointment);
        appointmentApiData[
            appointmentWrapper.getAppointmentId()
            ] = appointmentWrapper.getBasicInfo();
        appointment_ids.push(appointmentWrapper.getAppointmentId());
      }

      return raiseSuccess(
          res,
          200,
          {
            appointments: {
              ...appointmentApiData,
            },
            appointment_ids
          },
          `appointment data for patient: ${id} fetched successfully`
      );
    } catch(error) {
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

      for(const medication of medicationDetails) {
        const medicationWrapper = await MReminderWrapper(medication);
        medicationApiData[
            medicationWrapper.getMReminderId()
            ] = medicationWrapper.getBasicInfo();
        medicineId.push(medicationWrapper.getMedicineId());
      }

      Logger.debug(
          "medicineId",
          medicineId
      );

      const medicineData = await medicineService.getMedicineByData({
        id: medicineId
      });

      let medicineApiData = {};

      Logger.debug(
          "medicineData",
          medicineData
      );

      for(const medicine of medicineData) {
        const medicineWrapper = await MedicineApiWrapper(medicine);
        medicineApiData[medicineWrapper.getMedicineId()] = medicineWrapper.getBasicInfo();
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
    } catch(error) {
      Logger.debug("medication get 500 error ", error);
      return raiseServerError(res);
    }
  };

  getPatientCarePlanDetails = async (req, res) => {
    try {
      const { id: patient_id = 1 } = req.params;
      const { userDetails: {userId} = {} } = req;

      let show = false;

      let carePlan = await carePlanService.getSingleCarePlanByData({ patient_id });
      const carePlanData = await CarePlanWrapper(carePlan);

      let templateMedicationData = {};
      let template_medication_ids = [];

      let templateAppointmentData = {};
      let template_appointment_ids = [];
      let medicine_ids = [];

      const {treatment_id, severity_id, condition_id} = carePlanData.getCarePlanDetails();

      const carePlanTemplates = await carePlanTemplateService.getCarePlanTemplateData({
        treatment_id,
        severity_id,
        condition_id,
        user_id: userId
      });

      Logger.debug("carePlanTemplates ---> ", carePlanTemplates);


      let carePlanTemplateData = null;

      if(carePlanData.getCarePlanTemplateId()) {
        const carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateById(carePlanData.getCarePlanTemplateId());
        carePlanTemplateData = await CarePlanTemplateWrapper(carePlanTemplate);
        const medications = await templateMedicationService.getMedicationsByCarePlanTemplateId(carePlanData.getCarePlanTemplateId());

        for(const medication of medications) {
          const medicationData = await TemplateMedicationWrapper(medication);
          templateMedicationData[medicationData.getTemplateMedicationId()] = medicationData.getBasicInfo();
          template_medication_ids.push(medicationData.getTemplateMedicationId());
          medicine_ids.push(medicationData.getTemplateMedicineId());
        }

        const appointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(carePlanData.getCarePlanTemplateId());

        for(const appointment of appointments) {
          const appointmentData = await TemplateAppointmentWrapper(appointment);
          templateAppointmentData[appointmentData.getTemplateAppointmentId()] = appointmentData.getBasicInfo();
          template_appointment_ids.push(appointmentData.getTemplateAppointmentId());
        }
      }

      Logger.debug("187631631623 here 1", 1);

      let carePlanAppointmentData = {};
      let appointment_ids = [];

      let carePlanMedicationData = {};
      let medication_ids = [];


      const carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(carePlanData.getCarePlanId());

      Logger.debug("carePlanAppointments here 2", carePlanAppointments);

      for(const carePlanAppointment of carePlanAppointments) {
        appointment_ids.push(carePlanAppointment.get("appointment_id"));
      }

      let appointmentApiDetails = {};
      const appointments = await appointmentService.getAppointmentByData({id: appointment_ids});
      Logger.debug("187631631623 here 2", appointments);
      if(appointments.length > 0) {
        for(const appointment of appointments) {
          const appointmentData = await AppointmentWrapper(appointment);
          appointmentApiDetails[appointmentData.getAppointmentId()] = appointmentData.getBasicInfo();
        }
      }
      Logger.debug("187631631623 here 2", 2);
      const carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(carePlanData.getCarePlanId());

      for(const carePlanMedication of carePlanMedications) {
        medication_ids.push(carePlanMedication.get("medication_id"));
      }

      let medicationApiDetails = {};
      const medications = await medicationReminderService.getMedicationsForParticipant({id: medication_ids});
      if(medications.length > 0) {
        for(const medication of medications) {
          const medicationData = await MReminderWrapper(medication);
          medicationApiDetails[medicationData.getMReminderId()] = medicationData.getBasicInfo();
          medicine_ids.push(medicationData.getMedicineId());
        }
      }


      Logger.debug(
          "medicineId",
          medicine_ids
      );

      const medicineData = await medicineService.getMedicineByData({
        id: medicine_ids
      });

      let medicineApiData = {};

      Logger.debug(
          "medicineData",
          medicineData
      );

      for(const medicine of medicineData) {
        const medicineWrapper = await MedicineApiWrapper(medicine);
        medicineApiData[medicineWrapper.getMedicineId()] = medicineWrapper.getBasicInfo();
      }

      let otherCarePlanTemplates = {};
      const carePlanTemplateIds = [];

      if(carePlanTemplateData || carePlanTemplates.length > 0) {
        for(const carePlanTemplate of carePlanTemplates) {
          carePlanTemplateData = await CarePlanTemplateWrapper(carePlanTemplate);
          const {care_plan_templates, template_appointments, template_medications, medicines} = await carePlanTemplateData.getReferenceInfo();
          carePlanTemplateIds.push(...Object.keys(care_plan_templates));
          otherCarePlanTemplates = {...otherCarePlanTemplates, ...care_plan_templates};
          templateAppointmentData = {...templateAppointmentData, ...template_appointments};
          templateMedicationData = {...templateMedicationData, ...template_medications};
          medicineApiData = {...medicineApiData, ...medicines};
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

      const symptomData = await SymptomService.getAllByData({patient_id, care_plan_id: carePlanData.getCarePlanId()});

      let symptomDetails = {};
      let uploadDocumentData = {};

      if(symptomData.length > 0) {
        for(const data of symptomData) {
          const symptom = await SymptomWrapper({data});
          const {symptoms} = await symptom.getAllInfo();
          const {upload_documents} = await symptom.getReferenceInfo();
          symptomDetails = {...symptomDetails, ...symptoms};
          uploadDocumentData = {...uploadDocumentData, ...upload_documents};
        }
      }



      return this.raiseSuccess(res, 200, {
        // care_plans: { ...carePlanApiData },
        // show, medicationsOfTemplate, appointmentsOfTemplate, carePlanMedications, carePlanAppointments, carePlanTemplateId,
        care_plans: {
          [carePlanData.getCarePlanId()]: {
            ...carePlanData.getBasicInfo(),
            appointment_ids,
            medication_ids
          }
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
          ...symptomDetails,
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
        }
      }, "Patient care plan details fetched successfully");

    } catch (error) {
      Logger.debug("get careplan 500 error ---> ", error);
      console.log("GET PATIENT DETAILS ERROR --> ", error);
      return this.raiseServerError(res);
    }
  };

  getPatientSymptoms = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("req.params ----->", req.params);
      const {params: {patient_id} = {}, userDetails: {userId} = {}} = req;

      const symptomData = await SymptomService.getAllByData({patient_id});

      let uploadDocumentData = {};
      const dateWiseSymptoms = {};
      let partWiseSymptoms = {};

      const sideWiseParts = {};
      let symptomDates = [];
      let symptomParts = [];

      const frontPart = {};
      const backPart = {};

      if(symptomData.length > 0) {
        for(const data of symptomData) {
          const symptom = await SymptomWrapper({data});

          Logger.debug("symptom created date ---> ", symptom.getCreatedDate());

          // DATA FORMATTED FOR DATE ORDER
          const symptomDetails = await symptom.getDateWiseInfo();
          const {upload_documents} = await symptom.getReferenceInfo();
          symptomDates.push(symptom.getCreatedDate());
          uploadDocumentData = {...uploadDocumentData, ...upload_documents};
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
            const {createdAt: a} = activityA;
            const {createdAt: b} = activityB;
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
              symptom_dates: symptomDates,
              // symptom_part_ids: symptomParts
            },
            "Symptoms data fetched successfully"
        );
      } else {
        return raiseClientError(res, 422, {}, "Patient has not updated any symptoms yet for the treatment");
      }
    } catch(error) {
      Logger.debug("getPatientSymptoms 500 error", error);
      return raiseServerError(res);
    }
  };

  getPatientPartSymptoms = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      Logger.debug("req.params ----->", req.params);
      const {query: {duration = "5"} = {}, params: {patient_id} = {}, userDetails: {userId} = {}} = req;

      const currentTime = moment().utc().toISOString();
      const historyTime = moment().subtract(duration, "days").utc().toISOString();

      const symptomData = await SymptomService.getFilteredData({patient_id, start_time: historyTime, end_time: currentTime});

      let uploadDocumentData = {};

      const sideWiseParts = {};
      let symptomDates = [];
      let symptomParts = [];

      const frontPart = {};
      const backPart = {};

      if(symptomData.length > 0) {
        for(const data of symptomData) {
          const symptom = await SymptomWrapper({data});
          const symptomDetails = await symptom.getDateWiseInfo();

          // DATA FORMATTED FOR SIDE AND PART WISE ORDER

          if(symptom.getSide() === BODY_VIEW.FRONT) {
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

          const {upload_documents} = await symptom.getReferenceInfo();
          uploadDocumentData = {...uploadDocumentData, ...upload_documents};
          symptomDates.push(symptom.getCreatedDate());
          symptomParts.push(symptom.getPart());
        }

        for(const side of Object.values(BODY_VIEW)) {
          if(side === BODY_VIEW.FRONT) {
            sideWiseParts[side] = {...frontPart};
          } else {
            sideWiseParts[side] = {...backPart};
          }
        }

        Object.values(BODY_VIEW).forEach(side => {
          const sideData = sideWiseParts[side] || {};
          Object.keys(sideData).forEach(part => {
            const data = sideData[part] || [];
            data.sort((activityA, activityB) => {
              const {createdAt: a} = activityA;
              const {createdAt: b} = activityB;
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
              },
            },
            "Symptoms data fetched successfully"
        );
      } else {
        return raiseClientError(res, 422, {}, "Patient has not updated any symptoms yet for the treatment");
      }
    } catch(error) {
      Logger.debug("getPatientPartSymptoms 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new MPatientController();
