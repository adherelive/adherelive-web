import Controller from "../";
import patientService from "../../../app/services/patients/patients.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import appointmentService from "../../services/appointment/appointment.service";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
import templateMedicationService from "../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../services/templateAppointment/templateAppointment.service";
import medicineService from "../../services/medicine/medicine.service";
import carePlanSecondaryDoctorMappingService from "../../services/careplanSecondaryDoctorMappings/careplanSecondaryDoctorMappings.service";
import twilioService from "../../services/twilio/twilio.service";

import {
  getCarePlanAppointmentIds,
  getCarePlanMedicationIds,
  getCarePlanSeverityDetails
} from "./carePlanHelper";
import {
  EVENT_LONG_TERM_VALUE,
  EVENT_STATUS,
  EVENT_TYPE,
  USER_CATEGORY
} from "../../../constant";
import UserRoleWrapper from "../../ApiWrapper/web/userRoles";
import doctorService from "../../services/doctor/doctor.service";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
// import MedicationWrapper from "../../ApiWrapper/web/medicationReminder";
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
import CarePlanTemplateWrapper from "../../ApiWrapper/web/carePlanTemplate";
import Logger from "../../../libs/log";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import moment from "moment";
import queueService from "../../services/awsQueue/queue.service";

import * as carePlanHelper from "./carePlanHelper";
import MedicationWrapper from "../../ApiWrapper/web/medicationReminder";

import PERMISSIONS from "../../../config/permissions";

const Log = new Logger("WEB > CAREPLAN > CONTROLLER");

class CarePlanController extends Controller {
  constructor() {
    super();
  }

  createFromTemplate = async (req, res) => {
    try {
      const { carePlanId: care_plan_id } = req.params;
      const {
        medicationsData,
        appointmentsData,
        vitalData,
        dietData,
        workoutData,
        treatment_id,
        condition_id,
        severity_id,
        name: newTemplateName,
        createTemplate = false
      } = req.body;

      const { userDetails, permissions = [] } = req;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData
      } = userDetails || {};

      if (!care_plan_id) {
        return this.raiseClientError(
          res,
          422,
          {},
          `Please select a treatment plan to continue`
        );
      }

      const QueueService = new queueService();

      const templateNameCheck = await carePlanTemplateService.getSingleTemplateByData(
        {
          name: newTemplateName,
          user_id: userId
        }
      );

      if (templateNameCheck) {
        return this.raiseClientError(
          res,
          422,
          {},
          `A template exists with name ${newTemplateName}`
        );
      }

      const id = parseInt(care_plan_id);

      const carePlan = await carePlanService.getCarePlanById(id);
      let carePlanData = await CarePlanWrapper(carePlan);

      const patient_id = carePlan.get("patient_id");

      let appointmentsArr = [];
      let medicationsArr = [];
      const eventScheduleData = [];

      let appointmentApiDetails = {};
      let appointment_ids = [];

      // appointments ---------------------------------
      if (appointmentsData.length > 0) {
        for (let i = 0; i < appointmentsData.length; i++) {
          const {
            schedule_data: {
              description = "",
              start_time,
              end_time,
              organizer = {},
              type = "",
              type_description = "",
              radiology_type = "",
              treatment_id = "",
              participant_two = {},
              date = ""
            } = {},
            reason = "",
            time_gap = "",
            provider_id = null,
            provider_name = null,
            critical = false
          } = appointmentsData[i] || {};

          const { id: participant_two_id, category: participant_two_type } =
            participant_two || {};

          let userCategoryId = null;
          let participantTwoId = null;

          switch (category) {
            case USER_CATEGORY.DOCTOR:
              const doctor = await doctorService.getDoctorByData({
                user_id: userId
              });
              const doctorData = await DoctorWrapper(doctor);
              userCategoryId = doctorData.getDoctorId();
              participantTwoId = doctorData.getUserId();
              break;
            case USER_CATEGORY.HSP:
              const hspDoctor = await doctorService.getDoctorByData({
                user_id: userId
              });
              const hspDoctorData = await DoctorWrapper(hspDoctor);
              userCategoryId = hspDoctorData.getDoctorId();
              participantTwoId = hspDoctorData.getUserId();
              break;
            default:
              break;
          }

          const appointment_data = {
            participant_one_type: category,
            participant_one_id: userCategoryId,
            participant_two_type,
            participant_two_id,
            provider_id,
            provider_name,
            organizer_type: category,
            organizer_id: userCategoryId,
            description,
            start_date: date,
            end_date: date,
            start_time: null,
            end_time: null,
            details: {
              treatment_id,
              reason,
              type,
              type_description,
              radiology_type,
              critical
            }
          };

          const baseAppointment = await appointmentService.addAppointment(
            appointment_data
          );

          const newAppointment = await carePlanAppointmentService.addCarePlanAppointment(
            {
              care_plan_id,
              appointment_id: baseAppointment.get("id")
            }
          );

          const appointmentData = await AppointmentWrapper(baseAppointment);
          appointmentApiDetails[
            appointmentData.getAppointmentId()
          ] = appointmentData.getBasicInfo();
          appointment_ids.push(appointmentData.getAppointmentId());

          appointmentsArr.push({
            reason,
            time_gap,
            provider_id,
            // care_plan_template_id: carePlanTemplate.getCarePlanTemplateId(),
            details: {
              date,
              description,
              type_description,
              radiology_type,
              critical,
              appointment_type: type
            }
          });

          eventScheduleData.push({
            type: EVENT_TYPE.APPOINTMENT_TIME_ASSIGNMENT,
            event_id: appointmentData.getAppointmentId(),
            user_role_id: userRoleId,
            start_time,
            end_time
          });
        }
      }

      const carePlanStartTime = new moment.utc();
      const carePlanEndTime = new moment.utc(carePlanStartTime).add(2, "hours");
      const patient = await PatientWrapper(null, patient_id);
      const { user_role_id: patientRoleId } = await patient.getAllInfo();

      let carePlanScheduleData = {};
      if (permissions.includes(PERMISSIONS.MEDICATIONS.ADD)) {
        carePlanScheduleData = {
          type: EVENT_TYPE.CARE_PLAN_ACTIVATION,
          event_id: care_plan_id,
          critical: false,
          start_time: carePlanStartTime,
          end_time: carePlanEndTime,
          details: JSON.stringify(medicationsData),
          participants: [userId, patient.getUserId()],
          actor: {
            id: userId,
            user_role_id: userRoleId,
            category
          }
        };
      }

      // const sqsResponseForCarePlan = await QueueService.sendMessage(
      //   carePlanScheduleData
      // );
      //
      // Log.debug("sqsResponse for care plan---> ", sqsResponseForCarePlan);

      let medicationApiDetails = {};
      let medicineApiDetails = {};
      let medication_ids = [];

      // medications ---------------------------------
      if (
        permissions.includes(PERMISSIONS.MEDICATIONS.ADD) &&
        medicationsData.length > 0
      ) {
        for (const medication of medicationsData) {
          const {
            schedule_data: {
              end_date = "",
              description = "",
              start_date = "",
              unit = "",
              when_to_take = "",
              repeat = "",
              quantity = "",
              repeat_days = [],
              strength = "",
              start_time = "",
              repeat_interval = "",
              medication_stage = "",
              critical = false
            } = {},
            medicine_id = "",
            medicine_type = "1"
          } = medication;

          // add medication

          const dataToSave = {
            participant_id: patient_id,
            organizer_type: category,
            organizer_id: userId,
            medicine_id,
            description,
            start_date,
            end_date,
            details: {
              medicine_id,
              medicine_type,
              start_time: start_time ? start_time : moment(),
              end_time: start_time ? start_time : moment(),
              repeat,
              repeat_days,
              repeat_interval,
              quantity,
              strength,
              unit,
              when_to_take,
              medication_stage,
              critical
            }
          };

          const mReminderDetails = await medicationReminderService.addMReminder(
            dataToSave
          );

          const medicationWrapper = await MedicationWrapper(mReminderDetails);

          const data_to_create = {
            care_plan_id,
            medication_id: medicationWrapper.getMReminderId()
          };

          let newMedication = await carePlanMedicationService.addCarePlanMedication(
            data_to_create
          );

          const {
            medications,
            medicines
          } = await medicationWrapper.getReferenceInfo();
          medicationApiDetails = { ...medicationApiDetails, ...medications };
          medicineApiDetails = { ...medicineApiDetails, ...medicines };

          medication_ids.push(medicationWrapper.getMReminderId());

          medicationsArr.push({
            medicine_id,
            schedule_data: {
              critical,
              unit,
              repeat,
              quantity,
              strength,
              repeat_days,
              when_to_take,
              description,
              repeat_interval,
              medicine_type,
              duration: end_date
                ? moment(end_date).diff(moment(start_date), "days")
                : EVENT_LONG_TERM_VALUE
            }
          });
        }
      }

      // eventScheduleData.push({
      //   ...carePlanScheduleData,
      //   medication_ids
      // });

      carePlanScheduleData = {
        ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD) && {
          ...carePlanScheduleData,
          medication_ids
        })
      };

      // vitals ----------------------------------------
      const {
        vitals,
        vital_ids,
        vital_templates,
        vitalEventsData = [],
        carePlanTemplateVitals = []
      } = await carePlanHelper.createVitals({
        data: vitalData,
        carePlanId: care_plan_id,
        authUser: { category, userId, userCategoryData, userRoleId },
        patientId: carePlanData.getPatientId()
      });

      // diets ----------------------------------------
      const {
        diets,
        food_groups,
        food_items,
        food_item_details,
        portions,
        diet_ids,
        dietEventData,
        carePlanTemplateDiets
      } = await carePlanHelper.createDiet({
        data: dietData,
        carePlanId: care_plan_id,
        authUser: { category, userId, userCategoryData, userRoleId },
        patientId: carePlanData.getPatientId()
      });

      // workouts ----------------------------------------
      const {
        workouts,
        exercise_groups,
        exercises,
        exercise_details,
        repetitions,
        workout_ids,
        workoutEventData,
        carePlanTemplateWorkouts
      } = await carePlanHelper.createWorkout({
        data: workoutData,
        carePlanId: care_plan_id,
        authUser: { category, userId, userCategoryData, userRoleId },
        patientId: carePlanData.getPatientId()
      });

      // careplan template -------------------------------
      let carePlanTemplate = null;

      if (createTemplate) {
        const createCarePlanTemplate = await carePlanTemplateService.create({
          name: newTemplateName,
          treatment_id,
          severity_id: severity_id ? severity_id : null,
          condition_id: condition_id ? condition_id : null,
          user_id: userId,
          template_appointments: [...appointmentsArr],
          ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD) && {
            template_medications: [...medicationsArr]
          }),
          template_vitals: [...carePlanTemplateVitals],
          template_diets: [...carePlanTemplateDiets],
          template_workouts: [...carePlanTemplateWorkouts]
        });

        carePlanTemplate = await CarePlanTemplateWrapper(
          createCarePlanTemplate
        );

        await carePlanService.updateCarePlan(
          { care_plan_template_id: carePlanTemplate.getCarePlanTemplateId() },
          care_plan_id
        );

        carePlanData = await CarePlanWrapper(null, care_plan_id);
      }

      // sending batch message of appointments and vitals
      const sqsResponse = await QueueService.sendBatchMessage([
        ...eventScheduleData,
        ...vitalEventsData,
        ...dietEventData,
        ...workoutEventData,
        carePlanScheduleData
      ]);

      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: {
            [carePlanData.getCarePlanId()]: {
              ...carePlanData.getBasicInfo(),
              appointment_ids,
              ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD) && {
                medication_ids
              }),
              vital_ids,
              diet_ids,
              workout_ids
            }
          },
          appointments: {
            ...appointmentApiDetails
          },
          ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD) && {
            medications: {
              ...medicationApiDetails
            }
          }),
          ...(permissions.includes(PERMISSIONS.MEDICATIONS.ADD) && {
            medicines: {
              ...medicineApiDetails
            }
          }),
          vitals,
          vital_templates,

          diets,
          food_groups,
          food_items,
          food_item_details,
          portions,

          workouts,
          exercise_groups,
          exercises,
          exercise_details,
          repetitions,

          ...(carePlanTemplate ? await carePlanTemplate.getReferenceInfo() : {})
        },
        "Care plan medications, appointments, actions, diets and exercises added successfully"
      );
    } catch (error) {
      Log.debug(
        "createCarePlanMedicationsAndAppointmentsByTemplateData 500 error",
        error
      );
      return this.raiseServerError(res, 500, error);
    }
  };

  getPatientCarePlanDetails = async (req, res) => {
    const { patientId: patient_id = 1 } = req.params;
    try {
      const { userDetails, body, file, permissions = [] } = req;
      const { pid, profile_pic, name, email } = body || {};
      const { userId = "3", userRoleId = null, userData: { category } = {} } =
        userDetails || {};

      let show = false;

      let carePlan = await carePlanService.getSingleCarePlanByData({
        patient_id,
        ...((category === USER_CATEGORY.DOCTOR ||
          category === USER_CATEGORY.HSP) && { user_role_id: userRoleId })
      });

      let cPdetails = carePlan.get("details") ? carePlan.get("details") : {};

      let { shown = false } = cPdetails;
      let carePlanId = carePlan.get("id");
      let carePlanTemplateId = carePlan.get("care_plan_template_id");
      let carePlanMedications = await carePlanMedicationService.getMedicationsByCarePlanId(
        carePlanId
      );
      let carePlanAppointments = await carePlanAppointmentService.getAppointmentsByCarePlanId(
        carePlanId
      );

      let carePlanAppointmentIds = await getCarePlanAppointmentIds(carePlanId);
      let carePlanMedicationIds = await getCarePlanMedicationIds(carePlanId);
      let carePlanSeverityDetails = await getCarePlanSeverityDetails(
        carePlanId
      );
      const carePlanApiWrapper = await CarePlanWrapper(carePlan);

      let carePlanApiData = {};

      const { vital_ids } = await carePlanApiWrapper.getAllInfo();

      carePlanApiData[carePlanApiWrapper.getCarePlanId()] = {
        ...carePlanApiWrapper.getBasicInfo(),
        ...carePlanSeverityDetails,
        carePlanMedicationIds,
        carePlanAppointmentIds,
        vital_ids
      };

      Log.debug("87937198123 careplan", carePlanApiData);

      let templateMedications = {};
      let templateAppointments = {};
      let formattedTemplateMedications = [];
      let formattedTemplateAppointments = [];
      if (carePlanTemplateId) {
        templateMedications = await templateMedicationService.getMedicationsByCarePlanTemplateId(
          carePlanTemplateId
        );
        templateAppointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(
          carePlanTemplateId
        );
        if (
          permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) &&
          templateMedications.length
        ) {
          for (let medication of templateMedications) {
            let newMedication = {};
            newMedication.id = medication.get("id");
            newMedication.schedule_data = medication.get("schedule_data");
            newMedication.care_plan_template_id = medication.get(
              "care_plan_template_id"
            );
            let medicineId = medication.get("medicine_id");
            newMedication.medicine_id = medicineId;
            let medicine = await medicineService.getMedicineById(medicineId);
            // console.log("CARE PLAN OF PATIENTTTT===========>>>>>>>", medicine);
            let medName = medicine.get("name");
            let medType = medicine.get("type");
            newMedication.medicine = medName;
            newMedication.medicineType = medType;
            formattedTemplateMedications.push(newMedication);
          }
        }

        if (templateAppointments.length) {
          for (let appointment of templateAppointments) {
            let newAppointment = {};
            newAppointment.id = appointment.get("id");
            newAppointment.schedule_data = appointment.get("details");
            newAppointment.reason = appointment.get("reason");
            newAppointment.time_gap = appointment.get("time_gap");
            newAppointment.care_plan_template_id = appointment.get(
              "care_plan_template_id"
            );
            formattedTemplateAppointments.push(newAppointment);
          }
        }
      }

      let medicationsOfTemplate = [];

      if (permissions.includes(PERMISSIONS.MEDICATIONS.VIEW)) {
        medicationsOfTemplate = formattedTemplateMedications;
      }

      let appointmentsOfTemplate = formattedTemplateAppointments;

      let carePlanMedicationsExists = carePlanMedications
        ? !carePlanMedications.length
        : !carePlanMedications; //true if doesnot exist
      let carePlanAppointmentsExists = carePlanAppointments
        ? !carePlanAppointments.length
        : !carePlanAppointments; //true if doesnot exist
      if (
        carePlanTemplateId &&
        carePlanMedicationsExists &&
        carePlanAppointmentsExists &&
        !shown
      ) {
        show = true;
      }

      if (shown == false) {
        let details = cPdetails;
        details.shown = true;
        let updatedCarePlan = await carePlanService.updateCarePlan(
          { details },
          carePlanId
        );
      }

      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: { ...carePlanApiData },
          show,
          ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {
            medicationsOfTemplate
          }),
          appointmentsOfTemplate,
          carePlanMedications,
          carePlanAppointments,
          carePlanTemplateId
        },
        "patient care plan details fetched successfully"
      );
    } catch (error) {
      console.log("GET PATIENT DETAILS ERROR --> ", error);
      return this.raiseServerError(res, 500, error);
    }
  };

  addProfile = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body: { user_role_id, care_plan_id } = {} } = req;

      const { userDetails } = req;
      const { userCategoryData: { basic_info: { id: doctorId } = {} } = {} } =
        userDetails || {};

      const carePlanId = care_plan_id;
      const dataToAdd = {
        care_plan_id,
        secondary_doctor_role_id: user_role_id
      };
      const existingMapping =
        (await carePlanSecondaryDoctorMappingService.getByData(dataToAdd)) ||
        null;

      if (!existingMapping) {
        const createdMapping =
          (await carePlanSecondaryDoctorMappingService.create(dataToAdd)) ||
          null;

        if (createdMapping) {
          const carePlan = await CarePlanWrapper(null, care_plan_id);
          const addUserToChat = await twilioService.addMember(
            carePlan.getChannelId(),
            user_role_id
          );

          let carePlanAppointmentIds = await getCarePlanAppointmentIds(
            carePlanId
          );
          let carePlanMedicationIds = await getCarePlanMedicationIds(
            carePlanId
          );
          let carePlanSeverityDetails = await getCarePlanSeverityDetails(
            carePlanId
          );
          const carePlanApiWrapper = await CarePlanWrapper(null, carePlanId);

          let carePlanApiData = {};

          const { vital_ids } = await carePlanApiWrapper.getAllInfo();
          const {
            doctors = {},
            providers = {},
            user_roles = {},
            secondary_doctor_user_role_ids = []
          } = await carePlan.getAllInfo();

          carePlanApiData[carePlanApiWrapper.getCarePlanId()] = {
            ...carePlanApiWrapper.getBasicInfo(),
            ...carePlanSeverityDetails,
            carePlanMedicationIds,
            carePlanAppointmentIds,
            vital_ids,
            secondary_doctor_user_role_ids
          };

          // if(addUserToChat) {
          //   return raiseSuccess(res, 200, {}, "Profile added successfully");
          // } else {
          //   await carePlanSecondaryDoctorMappingService.delete(dataToAdd) || null;
          // }
          return raiseSuccess(
            res,
            200,
            {
              care_plans: { ...carePlanApiData },
              doctors,
              providers,
              user_roles
            },
            "Profile added successfully"
          );
        } else {
          return raiseClientError(res, 422, {}, "Please check details entered");
        }
      } else {
        return raiseClientError(
          res,
          201,
          {},
          "Profile already added in the treatment"
        );
      }
    } catch (error) {
      Log.debug("addProfile 500 ERROR", error);
      return raiseServerError(res);
    }
  };
}

export default new CarePlanController();
