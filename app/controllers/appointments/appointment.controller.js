import Controller from "../index";

import moment from "moment";

import { createLogger } from "../../../libs/logger";
import {
  getCarePlanAppointmentIds,
  getCarePlanMedicationIds,
  getCarePlanSeverityDetails,
} from "../carePlans/carePlan.helper";
import { Proxy_Sdk } from "../../proxySdk";
import {
  APPOINTMENT_TYPE,
  DOCUMENT_PARENT_TYPE,
  EVENT_STATUS,
  EVENT_TYPE,
  FAVOURITE_TYPE,
  FEATURE_TYPE,
  NOTIFICATION_STAGES,
  RADIOLOGY,
  S3_DOWNLOAD_FOLDER,
  USER_CATEGORY,
} from "../../../constant";
import { raiseClientError } from "../../../routes/api/helper";

import AppointmentJob from "../../jobSdk/Appointments/observer";
import NotificationSdk from "../../notificationSdk";

// Services
import queueService from "../../services/awsQueue/queue.service";
import doctorService from "../../services/doctor/doctor.service";
import patientService from "../../services/patients/patients.service";
import appointmentService from "../../services/appointment/appointment.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import featureDetailService from "../../services/featureDetails/featureDetails.service";
import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";

// Wrappers
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import AppointmentWrapper from "../../apiWrapper/web/appointments";
import FeatureDetailsWrapper from "../../apiWrapper/web/featureDetails";
import DoctorWrapper from "../../apiWrapper/web/doctor";
import PatientWrapper from "../../apiWrapper/web/patient";
import UploadDocumentWrapper from "../../apiWrapper/web/uploadDocument";
import EventWrapper from "../../apiWrapper/common/scheduleEvents";

import { uploadImageS3 } from "../user/user.helper";
import { getFilePath } from "../../helper/s3FilePath";
import { checkAndCreateDirectory } from "../../helper/common";

import { downloadFileFromS3 } from "../mControllers/user/user.helper";

// Helpers
import * as AppointmentHelper from "./appointments.helper";

const path = require("path");

const LOG_NAME = "WEB > APPOINTMENT > CONTROLLER";
const logger = createLogger(LOG_NAME);

/**
 *
 *
 * @class AppointmentController
 */
class AppointmentController extends Controller {
  constructor() {
    super();
  }

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  create = async (req, res) => {
    const { raiseClientError } = this;
    try {
      logger.debug("Request data for Appointments: ", req.body);
      const { body, userDetails } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment_id = "",
        reason = "",
        type = null,
        type_description = null,
        radiology_type = "",
        provider_id = null,
        provider_name = null,
        critical = false,
        participant_one = "",
      } = body;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
      } = userDetails || {};
      const { id: participant_one_id, category: participant_one_type } = participant_one || {};
      const { id: participant_two_id, category: participant_two_type } = participant_two || {};

      logger.debug("Request data for Appointments: ", req.body)

      // check previous time slot for appointment based on
      // date, start_time, end_time, participant_one_id, participant_one_type, participant_two_id, participant_two_type

      let userCategoryId = null;
      let participantOneId = null;
      let participantTwoId = null;

      switch (category) {
        case USER_CATEGORY.DOCTOR:
          const doctor = await doctorService.getDoctorByData({
            user_id: userId,
          });
          const doctorData = await DoctorWrapper(doctor);
          userCategoryId = doctorData.getDoctorId();
          participantOneId = doctorData.getUserId();
          participantTwoId = doctorData.getUserId();
          break;
        case USER_CATEGORY.HSP:
          const hspDoctor = await doctorService.getDoctorByData({
            user_id: userId,
          });
          const hspDoctorData = await DoctorWrapper(hspDoctor);
          userCategoryId = hspDoctorData.getDoctorId();
          participantOneId = hspDoctorData.getUserId();
          participantTwoId = hspDoctorData.getUserId();
          break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientByUserId(userId);
          const patientData = await PatientWrapper(patient);
          userCategoryId = patientData.getPatientId();
          participantOneId = patientData.getUserId();
          participantTwoId = patientData.getUserId();
          break;
        default:
          break;
      }

      // logger.debug("Start date", date);
      const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
        start_time,
        end_time,
        {
          participant_one_id: userCategoryId,
          participant_one_type: category,
        },
        {
          participant_two_id,
          participant_two_type,
        }
      );

      if (getAppointmentForTimeSlot.length > 0) {
        return raiseClientError(
          res,
          422,
          {
            error_type: "slot_present",
          },
          `Appointment Slot already present between`
        );
      }

      const appointment_data = {
        participant_one_type: category,
        participant_one_id: userCategoryId,
        participant_two_type,
        participant_two_id,
        organizer_type: category,
        organizer_id: userCategoryId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        details: {
          treatment_id,
          reason,
          type,
          type_description,
          radiology_type,
          critical,
        },
        provider_id,
        provider_name,
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );

      const appointmentApiData = await new AppointmentWrapper(appointment);

      // const scheduleEvent = await scheduleService.addNewJob(eventScheduleData);

      const eventScheduleData = {
        type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        event_type: EVENT_TYPE.APPOINTMENT,
        critical,
        start_time,
        end_time,
        details: appointmentApiData.getBasicInfo(),
        participants: [userRoleId, participantOneId],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          category,
        },
      };

      const QueueService = new queueService();

      const sqsResponse = await QueueService.sendMessage(eventScheduleData);

      logger.debug("sqsResponse ---> ", sqsResponse);

      const appointmentJob = AppointmentJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventScheduleData
      );
      await NotificationSdk.execute(appointmentJob);

      // TODO: schedule event and notifications here
      await Proxy_Sdk.scheduleEvent({ data: eventScheduleData });

      // response
      return this.raiseSuccess(
        res,
        200,
        {
          ...(await appointmentApiData.getAllInfo()),
          appointments: {
            [appointmentApiData.getAppointmentId()]: {
              ...appointmentApiData.getBasicInfo()
            }
          }
        },
        "Appointment created successfully!"
      );
    } catch (error) {
      return this.raiseServerError(res);
    }
  };

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  createCarePlanAppointment = async (req, res) => {
    const { raiseClientError } = this;
    try {
      const { carePlanId: care_plan_id = 0 } = req.params;
      const { body, userDetails } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment_id = "",
        reason = "",
        type = null,
        type_description = null,
        provider_id = null,
        provider_name = null,
        critical = false,
        radiology_type = "",
        // participant_one_type = "",
        // participant_one_id = "",
      } = body;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryId,
        userCategoryData: { basic_info: { full_name } = {} } = {},
      } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      let participantTwoId = null;

      switch (participant_two_type) {
        // case USER_CATEGORY.DOCTOR:
        //   const doctor = await doctorService.getDoctorByData({
        //     id: participant_two_type
        //   });
        //   const doctorData = await DoctorWrapper(doctor);
        //   participantTwoId = doctorData.getUserRoleId();
        //   break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientById({
            id: participant_two_id,
          });
          const patientData = await PatientWrapper(patient);
          const { user_role_id } = await patientData.getAllInfo();
          participantTwoId = user_role_id;
          break;
        default:
          break;
      }

      // logger.debug("Start date", date);
      const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
        start_time,
        end_time,
        {
          participant_one_id: userCategoryId,
          participant_one_type: category,
        },
        {
          participant_two_id,
          participant_two_type,
        }
      );

      if (getAppointmentForTimeSlot.length > 0) {
        return raiseClientError(
          res,
          422,
          {
            error_type: "slot_present",
          },
          `Appointment Slot already present for the selected slot`
        );
      }

      const appointment_data = {
        participant_one_type: category,
        participant_one_id: userCategoryId,
        participant_two_type,
        participant_two_id,
        organizer_type: category,
        organizer_id: userCategoryId,

        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        provider_id,
        provider_name,
        details: {
          care_plan_id,
          treatment_id,
          reason,
          description,
          type,
          type_description,
          critical,
          ...(type === RADIOLOGY && { radiology_type: radiology_type }),
        },
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );

      let data_to_create = {
        care_plan_id: parseInt(care_plan_id),
        appointment_id: appointment.get("id"),
      };

      let newAppointment =
        await carePlanAppointmentService.addCarePlanAppointment(data_to_create);

      let carePlan = await carePlanService.getCarePlanById(care_plan_id);

      let carePlanAppointmentIds = await getCarePlanAppointmentIds(
        care_plan_id
      );
      let carePlanMedicationIds = await getCarePlanMedicationIds(care_plan_id);
      let carePlanSeverityDetails = await getCarePlanSeverityDetails(
        care_plan_id
      );
      const carePlanApiWrapper = await CarePlanWrapper(carePlan);
      let carePlanApiData = {};

      carePlanApiData[carePlanApiWrapper.getCarePlanId()] = {
        ...(await carePlanApiWrapper.getAllInfo()),
        ...carePlanSeverityDetails,
        medication_ids: carePlanMedicationIds,
        appointment_ids: carePlanAppointmentIds,
      };

      const appointmentApiData = await new AppointmentWrapper(appointment);

      const eventScheduleData = {
        type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        event_type: EVENT_TYPE.APPOINTMENT,
        critical,
        start_time,
        end_time,
        details: appointmentApiData.getBasicInfo(),
        participants: [
          userRoleId,
          participantTwoId,
          ...carePlanApiWrapper.getCareplnSecondaryProfiles(),
        ],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      };

      const QueueService = new queueService();

      const sqsResponse = await QueueService.sendMessage(eventScheduleData);

      logger.debug("createCarePlanAppointment sqsResponse: ", sqsResponse);

      const appointmentJob = AppointmentJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventScheduleData
      );
      await NotificationSdk.execute(appointmentJob);
      // TODO: if we need to send a mail also for the appointment
      // await NotificationSdk.execute(EVENT_TYPE.SEND_MAIL, appointmentJob);

      logger.debug("createCarePlanAppointment appointmentJob: ", appointmentJob.getInAppTemplate());
      // TODO: schedule event and notifications here
      await Proxy_Sdk.scheduleEvent({ data: eventScheduleData });

      // response
      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: { ...carePlanApiData },
          ...(await appointmentApiData.getAllInfo()),
          appointments: {
            [appointmentApiData.getAppointmentId()]: {
              ...appointmentApiData.getBasicInfo()
            }
          }
        },
        "Appointment created successfully!"
      );
    } catch (error) {
      return this.raiseServerError(res);
    }
  };

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  update = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { appointment_id } = {}, body, userDetails } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment_id = "",
        reason = "",
        type = null,
        type_description = null,
        provider_id = null,
        provider_name = null,
        critical = false,
        // participant_one_type = "",
        // participant_one_id = "",
        radiology_type = "",
      } = body;

      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryId,
        userCategoryData: { basic_info: { full_name } = {} } = {},
      } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      const oldAppointment = await appointmentService.getAppointmentById(
        appointment_id
      );

      // care plan id for appointment
      const { care_plan_id = null } =
        (await carePlanAppointmentService.getSingleCarePlanAppointmentByData({
          appointment_id,
        })) || {};

      const oldAppointmentData = await AppointmentWrapper(oldAppointment);

      // check for date, start_time, end_time change
      if (
        moment(date).diff(moment(oldAppointmentData.getStartDate()), "d") !==
          0 ||
        moment(start_time).diff(
          moment(oldAppointmentData.getStartTime()),
          "m"
        ) !== 0 ||
        moment(end_time).diff(moment(oldAppointmentData.getEndTime()), "m") !==
          0
      ) {
        const previousAppointments = await appointmentService.checkTimeSlot(
          start_time,
          end_time,
          {
            participant_one_id: userCategoryId,
            participant_one_type: category,
          },
          {
            participant_two_id,
            participant_two_type,
          }
        );

        const filteredAppointments = previousAppointments.filter(
          (appointment) => {
            return `${appointment.get("id")}` !== appointment_id;
          }
        );

        if (filteredAppointments.length > 0) {
          return raiseClientError(
            res,
            422,
            {
              error_type: "slot_present",
            },
            `Appointment Slot already present for the selected slot`
          );
        }
      }

      const appointment_data = {
        participant_one_type: category,
        participant_one_id: userCategoryId,
        participant_two_type,
        participant_two_id,
        organizer_type: category,
        organizer_id: userCategoryId,
        // description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        provider_id,
        provider_name,
        details: {
          care_plan_id,
          treatment_id,
          reason,
          type,
          description,
          type_description,
          radiology_type,
          critical,
        },
      };

      const appointment = await appointmentService.updateAppointment(
        appointment_id,
        appointment_data
      );

      const updatedAppointmentDetails =
        await appointmentService.getAppointmentById(appointment_id);

      const appointmentApiData = await AppointmentWrapper(
        updatedAppointmentDetails
      );

      let participantTwoId = null;

      switch (participant_two_type) {
        // case USER_CATEGORY.DOCTOR:
        //   const doctor = await doctorService.getDoctorByData({
        //     id: participant_two_id
        //   });
        //   const doctorData = await DoctorWrapper(doctor);
        //   participantTwoId = doctorData.getUserId();
        //   break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientById({
            id: participant_two_id,
          });
          const patientData = await PatientWrapper(patient);
          const { user_role_id } = await patientData.getAllInfo();
          participantTwoId = user_role_id;
          break;
        default:
          break;
      }

      // delete previous events and send sqs for new

      // 1. delete
      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: appointment_id,
        event_type: EVENT_TYPE.APPOINTMENT,
      });

      const carePlan = await CarePlanWrapper(null, care_plan_id);

      // 2. send sqs for updated
      const eventScheduleData = {
        type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        event_type: EVENT_TYPE.APPOINTMENT,
        critical,
        start_time,
        end_time,
        details: appointmentApiData.getBasicInfo(),
        participants: [
          userRoleId,
          participantTwoId,
          ...carePlan.getCareplnSecondaryProfiles(),
        ],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      };

      const QueueService = new queueService();
      await QueueService.sendMessage(eventScheduleData);

      const appointmentJob = AppointmentJob.execute(
        NOTIFICATION_STAGES.UPDATE,
        eventScheduleData
      );
      await NotificationSdk.execute(appointmentJob);

      return raiseSuccess(
        res,
        200,
        {
          ...(await appointmentApiData.getAllInfo()),
        },
        "Appointment updated successfully"
      );
    } catch (error) {
      logger.error("updateAppointment 500 error: ", error);
      return raiseServerError(res);
    }
  };

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  getDayAppointmentByDate = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {}, userDetails: { userId } = {} } = req;
      const { date } = req.query;
      const appointmentList = await appointmentService.getAppointmentsByDate(
        date
      );
      let appointmentApiData = {};
      let scheduleEventData = {};
      let uploadDocumentData = {};
      for (const appointment of appointmentList) {
        const appointmentWrapper = await AppointmentWrapper(appointment);
        const { appointments, schedule_events, upload_documents } =
          await appointmentWrapper.getAllInfo();
        appointmentApiData = { ...appointmentApiData, ...appointments };
        scheduleEventData = { ...scheduleEventData, ...schedule_events };
        uploadDocumentData = { ...uploadDocumentData, ...upload_documents };
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
          upload_documents: {
            ...uploadDocumentData,
          },
        },
        `Appointment data for patient: ${id} fetched successfully`
      );
    } catch (error) {
      logger.error("getDayAppointmentByDate 500 error: ", error);
      return raiseServerError(res);
    }
  };

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  getAppointmentForPatient = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {}, userDetails: { userId } = {} } = req;

      const appointmentList = await appointmentService.getAppointmentForPatient(
        id
      );

      // logger.debug("appointmentList", appointmentList);

      // if (appointmentList.length > 0) {
      let appointmentApiData = {};
      let scheduleEventData = {};
      let uploadDocumentData = {};

      for (const appointment of appointmentList) {
        const appointmentWrapper = await AppointmentWrapper(appointment);

        // appointmentApiData[
        //   appointmentWrapper.getAppointmentId()
        // ] = appointmentWrapper.getBasicInfo();

        const { appointments, schedule_events, upload_documents } =
          await appointmentWrapper.getAllInfo();
        appointmentApiData = { ...appointmentApiData, ...appointments };
        scheduleEventData = { ...scheduleEventData, ...schedule_events };
        uploadDocumentData = { ...uploadDocumentData, ...upload_documents };
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
          upload_documents: {
            ...uploadDocumentData,
          },
        },
        `appointment data for patient: ${id} fetched successfully`
      );
      // } else {
      // }
    } catch (error) {
      logger.error("getAppointmentForPatient 500 error: ", error);
      return raiseServerError(res);
    }
  };

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  delete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      logger.debug("Appointment controller request: ", req.params);
      const { params: { appointment_id } = {}, userDetails: { userId } = {} } =
        req;

      const carePlanAppointmentDetails =
        await carePlanAppointmentService.deleteCarePlanAppointmentByAppointmentId(
          appointment_id
        );

      const appointmentDetails = await appointmentService.deleteAppointment(
        appointment_id
      );

      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: appointment_id,
        event_type: EVENT_TYPE.APPOINTMENT,
      });

      return raiseSuccess(res, 200, {}, `Appointment deleted successfully`);
    } catch (error) {
      logger.error("deleteAppointment 500 error: ", error);
      return raiseServerError(res);
    }
  };

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  getAppointmentDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails: { userData: { category }, userCategoryId } = {} } =
        req;
      const appointmentDetails = await featureDetailService.getDetailsByData({
        feature_type: FEATURE_TYPE.APPOINTMENT,
      });

      const appointmentData = await FeatureDetailsWrapper(appointmentDetails);

      let featureDetails = appointmentData.getFeatureDetails();
      const { type_description, radiology_type_data } = featureDetails || {};

      const userTypeData = {
        id: userCategoryId,
        category,
      };

      const updatedTypeDescriptionWithFavourites =
        await AppointmentHelper.getFavoriteInDetails(
          userTypeData,
          type_description,
          FAVOURITE_TYPE.MEDICAL_TESTS
        );

      featureDetails = {
        ...featureDetails,
        ...{ type_description: updatedTypeDescriptionWithFavourites },
      };
      const { appointment_type = {} } = featureDetails;
      if (category === USER_CATEGORY.HSP) {
        let hspAppointmentType = {};
        for (let each in appointment_type) {
          const { title = "" } = appointment_type[each];
          const { title: radiologyTitle } = APPOINTMENT_TYPE[RADIOLOGY];
          if (title === radiologyTitle) {
            continue;
          }
          hspAppointmentType[each] = appointment_type[each];
        }
        featureDetails["appointment_type"] = { ...hspAppointmentType };
      }

      const updatedRadiologyDataWithFavourites =
        await AppointmentHelper.getFavoriteInDetails(
          userTypeData,
          radiology_type_data,
          FAVOURITE_TYPE.RADIOLOGY
        );

      featureDetails = {
        ...featureDetails,
        ...{ radiology_type_data: updatedRadiologyDataWithFavourites },
      };

      return raiseSuccess(
        res,
        200,
        {
          static_templates: {
            appointments: { ...featureDetails },
          },
        },
        "Appointment details fetched successfully"
      );
    } catch (error) {
      logger.error("getAppointmentDetails 500 error: ", error);
      return raiseServerError(res);
    }
  };

  /**
   * This is the function which fetches and creates the data for the Missed Appointments
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  getAllMissedAppointments = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails } = req;

      const {
        userRoleId = null,
      } = userDetails || {};

      // Fetch all care plans for the user
      const docAllCarePlanData = await carePlanService.getCarePlanByData({
        user_role_id: userRoleId,
      });

      const appointmentApiData = {};
      const criticalAppointmentEventIds = [];
      const nonCriticalAppointmentEventIds = [];
      const scheduleEventService = new ScheduleEventService();

      // Process each care plan
      for (const carePlan of docAllCarePlanData) {
        const carePlanApiWrapper = await CarePlanWrapper(carePlan);
        const { appointment_ids } = await carePlanApiWrapper.getAllInfo();

        // Process each appointment ID
        for (const aId of appointment_ids) {
          // Fetch expired appointments for the current appointment ID
          const expiredAppointmentsList = await scheduleEventService.getAllEventByData({
            event_type: EVENT_TYPE.APPOINTMENT,
            status: EVENT_STATUS.EXPIRED,
            event_id: aId,
          });

          // Process each expired appointment
          for (const appointment of expiredAppointmentsList) {
            const appointmentEventWrapper = await EventWrapper(appointment);
            const eventId = appointmentEventWrapper.getEventId();
            const isCritical = appointmentEventWrapper.getCriticalValue();

            // Add to critical or non-critical list
            if (isCritical) {
              if (!criticalAppointmentEventIds.includes(eventId)) {
                criticalAppointmentEventIds.push(eventId);
              }
            } else {
              if (!nonCriticalAppointmentEventIds.includes(eventId)) {
                nonCriticalAppointmentEventIds.push(eventId);
              }
            }

            // Get appointment details
            const appointmentDetails = appointmentEventWrapper.getDetails();

            // Fetch patient ID from the care plan
            const patientId = await carePlanApiWrapper.getPatientId();

            // Add patient ID and other necessary fields to the appointment data
            appointmentApiData[eventId] = {
              ...appointmentDetails,
              patient_id: patientId, // Include patient ID
              participant_one: {
                id: patientId,
                category: USER_CATEGORY.PATIENT,
              },
              participant_two: {
                id: userRoleId, // Assuming the doctor's ID is the userRoleId
                category: USER_CATEGORY.DOCTOR,
              },
            };
          }
        }
      }

      // Check if any appointments were found
      if (Object.keys(appointmentApiData).length === 0) {
        return raiseSuccess(res, 201, {}, "No Missed Appointments");
      }

      // Return the response with the formatted data
      return raiseSuccess(
          res,
          200,
          {
            missed_appointment_events: appointmentApiData,
            critical_appointment_event_ids: criticalAppointmentEventIds,
            non_critical_appointment_event_ids: nonCriticalAppointmentEventIds,
          },
          "Missed appointments fetched successfully"
      );
    } catch (error) {
      logger.error("getAllMissedAppointments 500 error ", error);
      return raiseServerError(res);
    }
  };

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  uploadAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: {
          userId = null,
          userData: { category } = {},
          userCategoryData,
          userCategoryId,
        } = {},
      } = req || {};
      const file = req.file;

      const { params: { appointment_id = null } = {} } = req || {};

      const { originalName: file_name = "" } = file;

      // const scheduleEventService = new ScheduleEventService();
      const appointmentDetails = await appointmentService.getAppointmentById(
        appointment_id
      );

      /*const eventForAppointment = await scheduleEventService.getEventByData({
        event_id: appointment_id,
        event_type: EVENT_TYPE.APPOINTMENT
      });

      const scheduleData = await EventWrapper(eventForAppointment);

      if (scheduleData.getStatus() !== EVENT_STATUS.COMPLETED) {
        return raiseClientError(
          res,
          422,
          {},
          "Cannot upload documents before appointment is complete"
        );
      }*/

      let userIsParticipant = true;
      let timeDifference = null;

      if (appointmentDetails) {
        const appointmentApiData = await AppointmentWrapper(appointmentDetails);

        const { participant_one_id, participant_two_id } =
          appointmentApiData.getParticipants();

        userIsParticipant =
          participant_one_id === userCategoryId ||
          participant_two_id === userCategoryId
            ? true
            : false;
      }

      if (!appointmentDetails || !userIsParticipant) {
        return this.raiseClientError(
          res,
          422,
          {},
          `User is not authorized to upload document.`
        );
      }

      try {
        let files = await uploadImageS3(userId, file);

        const fileUrl = files && files.length ? getFilePath(files[0]) : files;

        const docExist = await documentService.getDocumentByData(
          DOCUMENT_PARENT_TYPE.APPOINTMENT_DOC,
          appointment_id,
          fileUrl
        );

        if (!docExist) {
          const appointmentDoc = await documentService.addDocument({
            parent_type: DOCUMENT_PARENT_TYPE.APPOINTMENT_DOC,
            parent_id: appointment_id,
            document: fileUrl,
            name: file_name,
          });
        }

        const appointmentDetails = await AppointmentWrapper(
          null,
          appointment_id
        );

        return this.raiseSuccess(
          res,
          200,
          {
            ...(await appointmentDetails.getAllInfo()),
          },
          "Appointment documents uploaded successfully."
        );
      } catch (err) {
        logger.error("Appointment document upload has an error: ", err);
        return this.raiseServerError(res, 500, {}, `${err.message}`);
      }
    } catch (error) {
      logger.error("Uploading an Appointment document has an error: ", error);
      return this.raiseServerError(res);
    }
  };

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  downloadAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {},
        body: { document_id = null } = {},
      } = req || {};

      const uploadDocuments = await documentService.getDocumentById(
        document_id
      );

      if (!uploadDocuments) {
        return this.raiseClientError(
          res,
          422,
          {},
          `No such document available.`
        );
      }

      const uploadDocumentData = await UploadDocumentWrapper(uploadDocuments);
      const { basic_info: { name, document, parent_id, parent_type } = {} } =
        uploadDocumentData.getBasicInfo();

      const appointmentDetails = await appointmentService.getAppointmentById(
        parent_id
      );
      let userIsParticipant = true;

      if (appointmentDetails) {
        const appointmentApiData = await AppointmentWrapper(appointmentDetails);

        const { participant_one_id, participant_two_id } =
          appointmentApiData.getParticipants();

        let userCategoryId = null;
        let userCategoryData = null;

        switch (category) {
          case USER_CATEGORY.DOCTOR:
            const doctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(doctor);
            userCategoryId = userCategoryData.getDoctorId();
            break;
          case USER_CATEGORY.HSP:
            const hspDoctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(hspDoctor);
            userCategoryId = userCategoryData.getDoctorId();
            break;
          case USER_CATEGORY.PATIENT:
            const patient = await patientService.getPatientByUserId(userId);
            userCategoryData = await PatientWrapper(patient);
            userCategoryId = userCategoryData.getPatientId();
            break;
          default:
            break;
        }

        userIsParticipant =
          participant_one_id === userCategoryId ||
          participant_two_id === userCategoryId
            ? true
            : false;
      }

      if (!appointmentDetails || !userIsParticipant) {
        return this.raiseClientError(
          res,
          422,
          {},
          `User is not authorized to download document.`
        );
      }

      checkAndCreateDirectory(S3_DOWNLOAD_FOLDER);

      const appointmentDocPath = `${S3_DOWNLOAD_FOLDER}/${name}`;

      const downloadDoc = await downloadFileFromS3(
        getFilePath(document),
        appointmentDocPath
      );

      const options = {
        root: path.join(__dirname, `../../../${S3_DOWNLOAD_FOLDER}/`),
      };
      return res.sendFile(name, options);
    } catch (error) {
      logger.error("downloadAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };

  /**
   *
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  deleteAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {},
      } = req || {};
      const { params: { document_id = null } = {} } = req || {};

      const uploadDocuments = await documentService.getDocumentById(
        document_id
      );

      if (!uploadDocuments) {
        return this.raiseClientError(
          res,
          422,
          {},
          `No such document available.`
        );
      }

      const uploadDocumentData = await UploadDocumentWrapper(uploadDocuments);

      const { basic_info: { name, document, parent_id, parent_type } = {} } =
        uploadDocumentData.getBasicInfo();

      const appointmentDetails = await appointmentService.getAppointmentById(
        parent_id
      );
      let userIsParticipant = true;

      if (appointmentDetails) {
        const appointmentApiData = await AppointmentWrapper(appointmentDetails);
        const { participant_one_id, participant_two_id } =
          appointmentApiData.getParticipants();

        let userCategoryId = null;
        let userCategoryData = null;

        switch (category) {
          case USER_CATEGORY.DOCTOR:
            const doctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(doctor);
            userCategoryId = userCategoryData.getDoctorId();
            break;
          case USER_CATEGORY.HSP:
            const hspDoctor = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryData = await DoctorWrapper(hspDoctor);
            userCategoryId = userCategoryData.getDoctorId();
            break;
          case USER_CATEGORY.PATIENT:
            const patient = await patientService.getPatientByUserId(userId);
            userCategoryData = await PatientWrapper(patient);
            userCategoryId = userCategoryData.getPatientId();
            break;
          default:
            break;
        }

        userIsParticipant =
          participant_one_id === userCategoryId ||
          participant_two_id === userCategoryId ? true : false;
      }

      if (!appointmentDetails || !userIsParticipant) {
        return this.raiseClientError(
          res,
          422,
          {},
          `User is not authorized to delete document.`
        );
      }

      const deleteDocs = await documentService.deleteDocumentsOfAppointment(
        document_id
      );

      const appointment = await AppointmentWrapper(appointmentDetails);

      return this.raiseSuccess(
        res,
        200,
        {
          ...(await appointment.getAllInfo()),
        },
        "Appointment document deleted."
      );
    } catch (error) {
      logger.error("deleteAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };
}

export default new AppointmentController();
