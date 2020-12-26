import Controller from "../../index";
import patientService from "../../../../app/services/patients/patients.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import carePlanTemplateService from "../../../services/carePlanTemplate/carePlanTemplate.service";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import appointmentService from "../../../services/appointment/appointment.service";
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import carePlanAppointmentService from "../../../services/carePlanAppointment/carePlanAppointment.service";
import templateMedicationService from "../../../services/templateMedication/templateMedication.service";
import templateAppointmentService from "../../../services/templateAppointment/templateAppointment.service";
import medicineService from "../../../services/medicine/medicine.service";
import {
  getCarePlanAppointmentIds,
  getCarePlanMedicationIds,
  getCarePlanSeverityDetails
} from "./carePlanHelper";
import { EVENT_STATUS, EVENT_TYPE, USER_CATEGORY } from "../../../../constant";
import doctorService from "../../../services/doctor/doctor.service";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import AppointmentWrapper from "../../../ApiWrapper/mobile/appointments";
import MedicationWrapper from "../../../ApiWrapper/mobile/medicationReminder";
import CarePlanTemplateWrapper from "../../../ApiWrapper/mobile/carePlanTemplate";
import Log from "../../../../libs/log_new";
import queueService from "../../../services/awsQueue/queue.service";
// import SqsQueueService from "../../../services/awsQueue/queue.service";
import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";
import moment from "moment";

class CarePlanController extends Controller {
  constructor() {
    super();
  }

  createCarePlanMedicationsAndAppointmentsByTemplateData = async (req, res) => {
    try {
      const { carePlanId: care_plan_id = 1 } = req.params;
      const {
        medicationsData,
        appointmentsData,
        treatment_id,
        condition_id,
        severity_id,
        name: newTemplateName,
        createTemplate = false
      } = req.body;

      const { userDetails } = req;
      const { userId, userData: { category } = {} } = userDetails || {};
      const QueueService = new queueService();

      let userCategoryId = null;

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

      switch (category) {
        case USER_CATEGORY.DOCTOR:
          const doctor = await doctorService.getDoctorByData({
            user_id: userId
          });
          const doctorData = await DoctorWrapper(doctor);
          userCategoryId = doctorData.getDoctorId();
          break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientByUserId(userId);
          const patientData = await PatientWrapper(patient);
          userCategoryId = patientData.getPatientId();
          break;
        default:
          break;
      }

      const id = parseInt(care_plan_id);

      const carePlan = await carePlanService.getCarePlanById(id);
      let carePlanData = await CarePlanWrapper(carePlan);

      const patient_id = carePlan.get("patient_id");

      let appointmentApiDetails = {};
      let appointment_ids = [];

      let appointmentsArr = [];
      let medicationsArr = [];

      for (let i = 0; i < appointmentsData.length; i++) {
        const {
          schedule_data: {
            description = "",
            organizer = {},
            treatment_id = "",
            participant_two = {},
            date = "",
            start_time = "",
            end_time = ""
          } = {},
          reason = "",
          time_gap = "",
          provider_id = null,
          provider_name = null,
          type = "",
          type_description = "",
          critical = false
        } = appointmentsData[i];

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
          case USER_CATEGORY.PATIENT:
            const patient = await patientService.getPatientByUserId(userId);
            const patientData = await PatientWrapper(patient);
            userCategoryId = patientData.getPatientId();
            participantTwoId = patientData.getUserId();
            break;
          default:
            break;
        }

        const appointment_data = {
          participant_one_type: category,
          participant_one_id: userCategoryId,
          participant_two_type,
          participant_two_id,
          organizer_type:
            Object.keys(organizer).length > 0 ? organizer.category : category,
          organizer_id:
            Object.keys(organizer).length > 0 ? organizer.id : userCategoryId,
          description,
          start_date: date,
          end_date: date,
          start_time: null,
          end_time: null,
          provider_id,
          provider_name,
          details: {
            treatment_id,
            reason,
            type,
            type_description,
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
          details: {
            date,
            description,
            type_description,
            critical,
            appointment_type: type
          }
        });

        const eventScheduleData = {
          type: EVENT_TYPE.APPOINTMENT_TIME_ASSIGNMENT,
          event_id: appointmentData.getAppointmentId(),
          start_time,
          end_time
        };

        const sqsResponse = await QueueService.sendMessage(
          eventScheduleData
        );

        Log.debug("sqsResponse ---> ", sqsResponse);
      }
      // careplan part starts.

      const carePlanStartTime = new moment.utc();
      const carePlanEndTime = new moment.utc(carePlanStartTime).add(2, "hours");
      const patient = await PatientWrapper(null, patient_id);

      const carePlanScheduleData = {
        type: EVENT_TYPE.CARE_PLAN_ACTIVATION,
        event_id: care_plan_id,
        critical: false,
        start_time: carePlanStartTime,
        end_time: carePlanEndTime,
        details: JSON.stringify(medicationsData),
        participants: [userId, patient.getUserId()],
        actor: {
          id: userId,
          category
        }
      };

      const sqsResponseforCareplan = await QueueService.sendMessage(
        carePlanScheduleData
      );

      Log.debug("sqsResponse for care plan---> ", sqsResponseforCareplan);

      let medicationApiDetails = {};
      let medication_ids = [];

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
            medication_stage = ""
          } = {},
          medicine_id = "",
          medicine_type = "1"
        } = medication;

        medicationsArr.push({
          medicine_id,
          // care_plan_template_id: carePlanTemplate.getCarePlanTemplateId(),
          schedule_data: {
            unit,
            repeat,
            quantity,
            strength,
            repeat_days,
            when_to_take,
            repeat_interval,
            medicine_type,
            duration: moment(start_date).diff(moment(end_date), "days")
          }
        });
      }

      let carePlanTemplate = null;

      if (createTemplate) {
        const createCarePlanTemplate = await carePlanTemplateService.create({
          name: newTemplateName,
          treatment_id,
          severity_id,
          condition_id,
          user_id: userId,
          template_appointments: [...appointmentsArr],
          template_medications: [...medicationsArr]
        });

        carePlanTemplate = await CarePlanTemplateWrapper(
          createCarePlanTemplate
        );

        const updateCarePlan = await carePlanService.updateCarePlan(
          { care_plan_template_id: carePlanTemplate.getCarePlanTemplateId() },
          care_plan_id
        );

        carePlanData = await CarePlanWrapper(null, care_plan_id);
        // await carePlanTemplate.getReferenceInfo();
      }

      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: {
            [carePlanData.getCarePlanId()]: {
              ...carePlanData.getBasicInfo(),
              appointment_ids,
              medication_ids
            }
          },
          appointments: {
            ...appointmentApiDetails
          },
          medications: {
            ...medicationApiDetails
          },
          ...(carePlanTemplate ? await carePlanTemplate.getReferenceInfo() : {})
        },
        "Care plan medications, appointments and actions added successfully"
      );
    } catch (error) {
      console.log(
        "Create Care Plan Medications And Appointments Error --> ",
        error
      );
      return this.raiseServerError(res, 500, error);
    }
  };

  activateCarePlan = async (req, res) => {
    try {
      const { carePlanId: care_plan_id = 1 } = req.params;
      const { activate = false, schedule_event_id = null } = req.body;

      const id = parseInt(care_plan_id);
      const schedule_event_id_value = parseInt(schedule_event_id);
      const scheduleEventService = new ScheduleEventService();

      const carePlan = await carePlanService.getCarePlanById(id);
      let carePlanData = await CarePlanWrapper(carePlan);

      const eventData = await scheduleEventService.getEventByData({
        event_id: care_plan_id,
        status: EVENT_STATUS.SCHEDULED,
        event_type: EVENT_TYPE.CARE_PLAN_ACTIVATION
      });

      if (!eventData || !Object.keys(eventData)) {
        return this.raiseClientError(
          res,
          422,
          {},
          `Response has been already recorded for this notification.`
        );
      }

      if (!activate) {
        const now = new moment.utc();
        const care_plan_start_time = new moment.utc(now).add(2, "hours");
        const end_time = new moment.utc(now).add(4, "hours");

        const updateEventStatus = await scheduleEventService.update(
          {
            status: EVENT_STATUS.PENDING,
            start_time: care_plan_start_time,
            end_time
          },
          schedule_event_id_value
        );

        return this.raiseSuccess(
          res,
          200,
          {
            care_plans: {
              [carePlanData.getCarePlanId()]: {
                ...carePlanData.getBasicInfo()
              }
            }
          },
          "Care plan delayed successfully."
        );
      }

      const patient_id = carePlan.get("patient_id");

      // console.log("event data got is: ", eventData);
      const {
        details: {
          medications = {},
          actor: { id: organizer_id = null, category } = {}
        } = {}
      } = eventData;
      const medicationsData = JSON.parse(medications);
      console.log("medication data got is: ", medicationsData);

      let medicationApiDetails = {};
      let medication_ids = [];

      for (const medication of medicationsData) {
        console.log(
          "medication value for current medication data is: ",
          medication
        );
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
            medication_stage = ""
          } = {},
          medicine_id = "",
          medicine_type = "1"
        } = medication;

        const duration = moment(start_date).diff(moment(end_date), "days");
        console.log(
          "difference in milliseconds is: ",
          duration,
          start_date,
          end_date
        );

        const updatedStartDate = new moment().utc();
        const updatedEndDate = new moment.utc(updatedStartDate).add(
          duration,
          "days"
        );

        console.log("updated times are: ", updatedStartDate, updatedEndDate);

        const dataToSave = {
          participant_id: patient_id,
          organizer_type: category,
          organizer_id,
          description,
          start_date: updatedStartDate,
          end_date: updatedEndDate,
          medicine_id,
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
            medication_stage
          }
        };

        const mReminderDetails = await medicationReminderService.addMReminder(
          dataToSave
        );

        const data_to_create = {
          care_plan_id,
          medication_id: mReminderDetails.get("id")
        };

        const newMedication = await carePlanMedicationService.addCarePlanMedication(
          data_to_create
        );
        console.log("MEDICATIONNNNNNN=======>", medication);

        const medicationData = await MedicationWrapper(mReminderDetails);
        medicationApiDetails[
          medicationData.getMReminderId()
        ] = medicationData.getBasicInfo();
        medication_ids.push(medicationData.getMReminderId());

        const patient = await PatientWrapper(null, patient_id);

        const eventScheduleData = {
          patient_id: patient.getUserId(),
          type: EVENT_TYPE.MEDICATION_REMINDER,
          event_id: mReminderDetails.getId,
          details: mReminderDetails.getBasicInfo.details,
          status: EVENT_STATUS.SCHEDULED,
          start_date,
          end_date,
          when_to_take,
          participant_one: patient.getUserId(),
          participant_two: organizer_id
        };

        const QueueService = new queueService();
        const sqsResponse = await QueueService.sendMessage(
          eventScheduleData
        );
        Log.debug("sqsResponse ---> ", sqsResponse);
      }

      const updateEventStatusResponse = await scheduleEventService.update(
        {
          status: EVENT_STATUS.COMPLETED
        },
        schedule_event_id_value
      );

      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: {
            [carePlanData.getCarePlanId()]: {
              ...carePlanData.getBasicInfo(),
              medication_ids
            }
          },
          medications: {
            ...medicationApiDetails
          }
        },
        "Care plan activated successfully."
      );
    } catch (error) {
      console.log("Activate careplan error: ", error);
      return this.raiseServerError(res, 500);
    }
  };

  getPatientCarePlanDetails = async (req, res) => {
    const { patientId: patient_id = 1 } = req.params;
    try {
      const { userDetails: { userId } = {} } = req;

      let show = false;

      let carePlan = await carePlanService.getSingleCarePlanByData({
        patient_id
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

      carePlanApiData[carePlanApiWrapper.getCarePlanId()] = {
        ...carePlanApiWrapper.getBasicInfo(),
        ...carePlanSeverityDetails,
        carePlanMedicationIds,
        carePlanAppointmentIds
      };

      let templateMedications = {};
      let templateAppointments = {};
      let formattedTemplateMedications = [];
      let formattedTemplateAppointments = [];
      if (
        carePlanTemplateId &&
        !carePlanMedications.length &&
        !carePlanAppointments.length
      ) {
        templateMedications = await templateMedicationService.getMedicationsByCarePlanTemplateId(
          carePlanTemplateId
        );
        templateAppointments = await templateAppointmentService.getAppointmentsByCarePlanTemplateId(
          carePlanTemplateId
        );
        if (templateMedications.length) {
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

      let medicationsOfTemplate = formattedTemplateMedications;
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

      console.log(
        "CARE PLAN OF PATIENTTTT===========>>>>>>>",
        patient_id,
        carePlanId,
        shown,
        carePlanMedications,
        carePlanAppointments,
        show,
        carePlanTemplateId,
        carePlanMedicationsExists,
        carePlanAppointmentsExists
      );
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
          medicationsOfTemplate,
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
}

export default new CarePlanController();
