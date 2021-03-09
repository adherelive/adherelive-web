import Controller from "../index";
import {
  getCarePlanAppointmentIds,
  getCarePlanMedicationIds,
  getCarePlanSeverityDetails
} from "../carePlans/carePlanHelper";
import { Proxy_Sdk, EVENTS } from "../../proxySdk";
import {
  EVENT_STATUS,
  EVENT_TYPE,
  FEATURE_TYPE,
  USER_CATEGORY,
  DOCUMENT_PARENT_TYPE,
  S3_DOWNLOAD_FOLDER,
  NOTIFICATION_STAGES,
  RADIOLOGY
} from "../../../constant";
import moment from "moment";

const path = require("path");

import Log from "../../../libs/log";
import { raiseClientError } from "../../../routes/helper";

import AppointmentJob from "../../JobSdk/Appointments/observer";
import NotificationSdk from "../../NotificationSdk";

// SERVICES...
import queueService from "../../services/awsQueue/queue.service";
import doctorService from "../../services/doctor/doctor.service";
import patientService from "../../services/patients/patients.service";
import appointmentService from "../../services/appointment/appointment.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import featureDetailService from "../../services/featureDetails/featureDetails.service";
import carePlanAppointmentService from "../../services/carePlanAppointment/carePlanAppointment.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";

// WRAPPERS...
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import FeatureDetailsWrapper from "../../ApiWrapper/web/featureDetails";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import UploadDocumentWrapper from "../../ApiWrapper/web/uploadDocument";

import eventService from "../../services/scheduleEvents/scheduleEvent.service";
import EventWrapper from "../../ApiWrapper/common/scheduleEvents";

import { uploadImageS3 } from "../user/userHelper";
import { getFilePath } from "../../helper/filePath";
import { checkAndCreateDirectory } from "../../helper/common";

import { downloadFileFromS3 } from "../mControllers/user/userHelper";

const FILE_NAME = "WEB APPOINTMENT CONTROLLER";

const Logger = new Log(FILE_NAME);

class AppointmentController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseClientError } = this;
    try {
      Logger.debug("REQUEST DATA ---> ", req.body);
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
        critical = false
        // participant_one_type = "",
        // participant_one_id = "",
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      /*
       * check previous time slot for appointment based on
       * date,
       * start_time,
       * end_time,
       *
       * participant_one_id,
       * participant_one_type,
       * participant_two_id,
       * participant_two_type
       * */

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

      // Logger.debug("Start date", date);
      const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
        start_time,
        end_time,
        {
          participant_one_id: userCategoryId,
          participant_one_type: category
        },
        {
          participant_two_id,
          participant_two_type
        }
      );

      if (getAppointmentForTimeSlot.length > 0) {
        return raiseClientError(
          res,
          422,
          {
            error_type: "slot_present"
          },
          `Appointment Slot already present between`
        );
      }

      const appointment_data = {
        participant_one_type: category,
        participant_one_id: userId,
        participant_two_type,
        participant_two_id,
        organizer_type:
          Object.keys(organizer).length > 0 ? organizer.category : category,
        organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userId,
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
          critical
        },
        provider_id,
        provider_name
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );

      const appointmentApiData = await new AppointmentWrapper(appointment);

      // const scheduleEvent = await scheduleService.addNewJob(eventScheduleData);
      // console.log("[ APPOINTMENTS ] scheduleEvent ", scheduleEvent);

      const eventScheduleData = {
        type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        event_type: EVENT_TYPE.APPOINTMENT,
        critical,
        start_time,
        end_time,
        details: appointmentApiData.getBasicInfo(),
        participants: [userId, participantTwoId],
        actor: {
          id: userId,
          category
        }
      };

      const QueueService = new queueService();

      const sqsResponse = await QueueService.sendMessage(eventScheduleData);

      Logger.debug("sqsResponse ---> ", sqsResponse);

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
          ...(await appointmentApiData.getAllInfo())
          // appointments: {
          //   [appointmentApiData.getAppointmentId()]: {
          //     ...appointmentApiData.getBasicInfo()
          //   }
          // }
        },
        "appointment created successfully"
      );
    } catch (error) {
      console.log("[ APPOINTMENTS ] create error ---> ", error);
      return this.raiseServerError(res);
    }
  };

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
        radiology_type="",
        // participant_one_type = "",
        // participant_one_id = "",
      } = body;
      const {
        userId,
        userData: { category } = {},
        userCategoryId,
        userCategoryData: { basic_info: { full_name } = {} } = {}
      } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      let participantTwoId = null;

      switch (participant_two_type) {
        case USER_CATEGORY.DOCTOR:
          const doctor = await doctorService.getDoctorByData({
            id: participant_two_type
          });
          const doctorData = await DoctorWrapper(doctor);
          participantTwoId = doctorData.getUserId();
          break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientById({
            id: participant_two_id
          });
          const patientData = await PatientWrapper(patient);
          participantTwoId = patientData.getUserId();
          break;
        default:
          break;
      }

      // Logger.debug("Start date", date);
      const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
        start_time,
        end_time,
        {
          participant_one_id: userCategoryId,
          participant_one_type: category
        },
        {
          participant_two_id,
          participant_two_type
        }
      );

      if (getAppointmentForTimeSlot.length > 0) {
        return raiseClientError(
          res,
          422,
          {
            error_type: "slot_present"
          },
          `Appointment Slot already present between`
        );
      }


      Logger.debug("827354523879472634237238473 TYPE",{type,TYPETYPE:typeof(type)});

      const appointment_data = {
        participant_one_type: category,
        participant_one_id: userCategoryId,
        participant_two_type,
        participant_two_id,
        organizer_type:
          Object.keys(organizer).length > 0 ? organizer.category : category,
        organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        provider_id,
        provider_name,
        details: {
          treatment_id,
          reason,
          type,
          type_description,
          critical,
          [type === RADIOLOGY && "radiology_type" ]:type === RADIOLOGY && radiology_type 
        }
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );

      let data_to_create = {
        care_plan_id: parseInt(care_plan_id),
        appointment_id: appointment.get("id")
      };

      let newAppointment = await carePlanAppointmentService.addCarePlanAppointment(
        data_to_create
      );

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
        ...carePlanApiWrapper.getBasicInfo(),
        ...carePlanSeverityDetails,
        medication_ids: carePlanMedicationIds,
        appointment_ids: carePlanAppointmentIds
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
        participants: [userId, participantTwoId],
        actor: {
          id: userId,
          // todo add actor name
          details: { name: full_name, category }
        }
      };

      const QueueService = new queueService();

      const sqsResponse = await QueueService.sendMessage(eventScheduleData);

      Logger.debug("sqsResponse ---> ", sqsResponse);

      const appointmentJob = AppointmentJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventScheduleData
      );
      await NotificationSdk.execute(appointmentJob);

      Logger.debug("appointmentJob ---> ", appointmentJob.getInAppTemplate());

      // NotificationSdk.execute(EVENT_TYPE.SEND_MAIL, appointmentJob);

      // TODO: schedule event and notifications here
      // await Proxy_Sdk.scheduleEvent({ data: eventScheduleData });

      // response
      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: { ...carePlanApiData },
          ...(await appointmentApiData.getAllInfo())
          // appointments: {
          //   [appointmentApiData.getAppointmentId()]: {
          //     ...appointmentApiData.getBasicInfo()
          //   }
          // }
        },
        "appointment created successfully"
      );
    } catch (error) {
      console.log("[ APPOINTMENTS ] create error ---> ", error);
      return this.raiseServerError(res);
    }
  };

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
        radiology_type="",
      } = body;

      const {
        userId,
        userData: { category } = {},
        userCategoryId,
        userCategoryData: { basic_info: { full_name } = {} } = {}
      } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      const oldAppointment = await appointmentService.getAppointmentById(
        appointment_id
      );

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
            participant_one_type: category
          },
          {
            participant_two_id,
            participant_two_type
          }
        );

        const filteredAppointments = previousAppointments.filter(
          appointment => {
            return `${appointment.get("id")}` !== appointment_id;
          }
        );

        if (filteredAppointments.length > 0) {
          return raiseClientError(
            res,
            422,
            {
              error_type: "slot_present"
            },
            `Appointment Slot already present between`
          );
        }
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
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        provider_id,
        provider_name,
        details: {
          treatment_id,
          reason,
          type,
          type_description,
          critical,
          [type === RADIOLOGY && "radiology_type" ]:type === RADIOLOGY && radiology_type
        }
      };

      const appointment = await appointmentService.updateAppointment(
        appointment_id,
        appointment_data
      );

      const updatedAppointmentDetails = await appointmentService.getAppointmentById(
        appointment_id
      );

      const appointmentApiData = await AppointmentWrapper(
        updatedAppointmentDetails
      );

      let participantTwoId = null;

      switch (participant_two_type) {
        case USER_CATEGORY.DOCTOR:
          const doctor = await doctorService.getDoctorByData({
            id: participant_two_id
          });
          const doctorData = await DoctorWrapper(doctor);
          participantTwoId = doctorData.getUserId();
          break;
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientById({
            id: participant_two_id
          });
          const patientData = await PatientWrapper(patient);
          participantTwoId = patientData.getUserId();
          break;
        default:
          break;
      }

      // delete previous events and send sqs for new

      // 1. delete
      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: appointment_id,
        event_type: EVENT_TYPE.APPOINTMENT
      });

      // 2. send sqs for updated
      const eventScheduleData = {
        type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        event_type: EVENT_TYPE.APPOINTMENT,
        critical,
        start_time,
        end_time,
        details: appointmentApiData.getBasicInfo(),
        participants: [userId, participantTwoId],
        actor: {
          id: userId,
          details: { name: full_name, category }
        }
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
          ...(await appointmentApiData.getAllInfo())
        },
        "Appointment updated successfully"
      );
    } catch (error) {
      Logger.debug("updateAppointment 500 error", error);
      return raiseServerError(res);
    }
  };

  getAppointmentForPatient = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {}, userDetails: { userId } = {} } = req;

      console.log("PATIENT IDDD OF GET APPOINTMENT", id);
      const appointmentList = await appointmentService.getAppointmentForPatient(
        id
      );

      // Logger.debug("appointmentList", appointmentList);

      // if (appointmentList.length > 0) {
      let appointmentApiData = {};
      let scheduleEventData = {};
      let uploadDocumentData = {};

      for (const appointment of appointmentList) {
        const appointmentWrapper = await AppointmentWrapper(appointment);

        // appointmentApiData[
        //   appointmentWrapper.getAppointmentId()
        // ] = appointmentWrapper.getBasicInfo();

        const {
          appointments,
          schedule_events,
          upload_documents
        } = await appointmentWrapper.getAllInfo();
        Logger.debug("1982378128 ", schedule_events, upload_documents);
        appointmentApiData = { ...appointmentApiData, ...appointments };
        scheduleEventData = { ...scheduleEventData, ...schedule_events };
        uploadDocumentData = { ...uploadDocumentData, ...upload_documents };
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
          upload_documents: {
            ...uploadDocumentData
          }
        },
        `appointment data for patient: ${id} fetched successfully`
      );
      // } else {
      // }
    } catch (error) {
      Logger.debug("getAppointmentForPatient 500 error", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      Logger.debug("REQUEST ------> ", req.params);
      const {
        params: { appointment_id } = {},
        userDetails: { userId } = {}
      } = req;

      const carePlanAppointmentDetails = await carePlanAppointmentService.deleteCarePlanAppointmentByAppointmentId(
        appointment_id
      );

      const appointmentDetails = await appointmentService.deleteAppointment(
        appointment_id
      );

      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: appointment_id,
        event_type: EVENT_TYPE.APPOINTMENT
      });

      return raiseSuccess(res, 200, {}, `Appointment deleted successfully`);
    } catch (error) {
      Logger.debug("delete 500 error", error);
      return raiseServerError(res);
    }
  };

  getAppointmentDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const appointmentDetails = await featureDetailService.getDetailsByData({
        feature_type: FEATURE_TYPE.APPOINTMENT
      });

      const appointmentData = await FeatureDetailsWrapper(appointmentDetails);

      return raiseSuccess(
        res,
        200,
        {
          static_templates: {
            appointments: { ...appointmentData.getFeatureDetails() }
          }
        },
        "Appointment details fetched successfully"
      );
    } catch (error) {
      Logger.debug("getAppointmentDetails 500 error ", error);
      return raiseServerError(res);
    }
  };

  getAllMissedAppointments = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { body, userDetails } = req;

      const {
        userId,
        userData: { category } = {},
        userCategoryData: { basic_info: { id: doctorId } = {} } = {}
      } = userDetails || {};

      let docAllCareplanData = [];
      let appointmentApiData = {};
      let flag = true;
      let criticalAppointmentEventIds = [];
      let nonCriticalAppointmentEventIds = [];
      const scheduleEventService = new ScheduleEventService();

      docAllCareplanData = await carePlanService.getCarePlanByData({
        doctor_id: doctorId
      });

      // Logger.debug("786756465789",docAllCareplanData);

      for (let carePlan of docAllCareplanData) {
        const carePlanApiWrapper = await CarePlanWrapper(carePlan);
        const { appointment_ids } = await carePlanApiWrapper.getAllInfo();

        for (let aId of appointment_ids) {
          // Logger.debug("87657898763545",appointment_ids);

          let expiredAppointmentsList = await scheduleEventService.getAllEventByData(
            {
              event_type: EVENT_TYPE.APPOINTMENT,
              status: EVENT_STATUS.EXPIRED,
              event_id: aId
            }
          );

          for (let appointment of expiredAppointmentsList) {
            const appointmentEventWrapper = await EventWrapper(appointment);
            // Logger.debug("8976756576890",appointmentEventWrapper);

            if (appointmentEventWrapper.getCriticalValue()) {
              if (
                !criticalAppointmentEventIds.includes(
                  appointmentEventWrapper.getEventId()
                )
              ) {
                criticalAppointmentEventIds.push(
                  appointmentEventWrapper.getEventId()
                );
              }
            } else {
              if (
                !nonCriticalAppointmentEventIds.includes(
                  appointmentEventWrapper.getEventId()
                )
              ) {
                nonCriticalAppointmentEventIds.push(
                  appointmentEventWrapper.getEventId()
                );
              }
            }

            appointmentApiData[
              appointmentEventWrapper.getEventId()
            ] = appointmentEventWrapper.getDetails();
          }
        }
      }

      if (
        Object.keys(appointmentApiData).length === 0 &&
        appointmentApiData.constructor === Object
      ) {
        flag = false;
      }

      if (flag === true) {
        return raiseSuccess(
          res,
          200,
          {
            missed_appointment_events: {
              ...appointmentApiData
            },
            critical_appointment_event_ids: criticalAppointmentEventIds,
            non_critical_appointment_event_ids: nonCriticalAppointmentEventIds
          },
          `Missed appointment fetched successfully`
        );
      } else {
        return raiseSuccess(res, 201, {}, "No Missed Appointment");
      }
    } catch (error) {
      Logger.debug("getappointmentDetails 500 error ", error);
      return raiseServerError(res);
    }
  };

  uploadAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: {
          userId = null,
          userData: { category } = {},
          userCategoryData,
          userCategoryId
        } = {}
      } = req || {};
      const file = req.file;

      const { params: { appointment_id = null } = {} } = req || {};

      const { originalName: file_name = "" } = file;

      // const scheduleEventService = new ScheduleEventService();
      const appointmentDetails = await appointmentService.getAppointmentById(
        appointment_id
      );

      // const eventForAppointment = await scheduleEventService.getEventByData({
      //   event_id: appointment_id,
      //   event_type: EVENT_TYPE.APPOINTMENT
      // });

      // const scheduleData = await EventWrapper(eventForAppointment);

      // if (scheduleData.getStatus() !== EVENT_STATUS.COMPLETED) {
      //   return raiseClientError(
      //     res,
      //     422,
      //     {},
      //     "Cannot upload documents before appointment is complete"
      //   );
      // }

      let userIsParticipant = true;
      let timeDifference = null;

      if (appointmentDetails) {
        const appointmentApiData = await AppointmentWrapper(appointmentDetails);

        const {
          participant_one_id,
          participant_two_id
        } = appointmentApiData.getParticipants();

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
            name: file_name
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
            ...(await appointmentDetails.getAllInfo())
          },
          "Appointment documents uploaded successfully."
        );
      } catch (err) {
        Logger.debug("APPOINTMENT DOC UPLOAD CATCH ERROR ", err);
        return this.raiseServerError(res, 500, {}, `${err.message}`);
      }
    } catch (error) {
      Logger.debug("uploadAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };

  downloadAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {},
        body: { document_id = null } = {}
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
      const {
        basic_info: { name, document, parent_id, parent_type } = {}
      } = uploadDocumentData.getBasicInfo();

      const appointmentDetails = await appointmentService.getAppointmentById(
        parent_id
      );
      let userIsParticipant = true;

      if (appointmentDetails) {
        const appointmentApiData = await AppointmentWrapper(appointmentDetails);

        const {
          participant_one_id,
          participant_two_id
        } = appointmentApiData.getParticipants();

        let userCategoryId = null;
        let userCategoryData = null;

        switch (category) {
          case USER_CATEGORY.DOCTOR:
            const doctor = await doctorService.getDoctorByData({
              user_id: userId
            });
            userCategoryData = await DoctorWrapper(doctor);
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
        root: path.join(__dirname, `../../../${S3_DOWNLOAD_FOLDER}/`)
      };
      return res.sendFile(name, options);
    } catch (error) {
      Logger.debug("downloadAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };

  deleteAppointmentDoc = async (req, res) => {
    try {
      const {
        userDetails: { userId = null, userData: { category } = {} } = {}
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

      const {
        basic_info: { name, document, parent_id, parent_type } = {}
      } = uploadDocumentData.getBasicInfo();

      const appointmentDetails = await appointmentService.getAppointmentById(
        parent_id
      );
      let userIsParticipant = true;

      if (appointmentDetails) {
        const appointmentApiData = await AppointmentWrapper(appointmentDetails);
        const {
          participant_one_id,
          participant_two_id
        } = appointmentApiData.getParticipants();

        let userCategoryId = null;
        let userCategoryData = null;

        switch (category) {
          case USER_CATEGORY.DOCTOR:
            const doctor = await doctorService.getDoctorByData({
              user_id: userId
            });
            userCategoryData = await DoctorWrapper(doctor);
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
          ...(await appointment.getAllInfo())
        },
        "Appointment document deleted."
      );
    } catch (error) {
      Logger.debug("deleteAppointmentDoc 500 error: ", error);
      return this.raiseServerError(res);
    }
  };
}

export default new AppointmentController();
