import Controller from "../../index";
import { createLogger } from "../../../../libs/logger";
import moment from "moment";
import * as vitalHelper from "../../vitals/vital.helper";

// Services
import VitalService from "../../../services/vitals/vital.service";
import VitalTemplateService from "../../../services/vitalTemplates/vitalTemplate.service";
import FeatureDetailService from "../../../services/featureDetails/featureDetails.service";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import twilioService from "../../../services/twilio/twilio.service";
import queueService from "../../../services/awsQueue/queue.service";

// Wrappers
import VitalTemplateWrapper from "../../../apiWrapper/mobile/vitalTemplates";
import VitalWrapper from "../../../apiWrapper/mobile/vitals";
import FeatureDetailWrapper from "../../../apiWrapper/mobile/featureDetails";
import EventWrapper from "../../../apiWrapper/common/scheduleEvents";
import CarePlanWrapper from "../../../apiWrapper/mobile/carePlan";
import DoctorWrapper from "../../../apiWrapper/mobile/doctor";
import PatientWrapper from "../../../apiWrapper/mobile/patient";

import JobSdk from "../../../jobSdk";
import NotificationSdk from "../../../notificationSdk";
import {
    DAYS,
    EVENT_STATUS,
    EVENT_TYPE,
    FEATURE_TYPE,
    NOTIFICATION_STAGES,
    USER_CATEGORY,
} from "../../../../constant";

const logger = createLogger("MOBILE > VITALS > CONTROLLER");

class VitalController extends Controller {
  constructor() {
    super();
  }

  addVital = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    logger.debug("req.body --->", req.body);
    try {
      const {
        body: {
          care_plan_id,
          vital_template_id,
          repeat_interval_id,
          start_date,
          end_date,
          repeat_days,
          description,
        } = {},
        userDetails: {
          userId,
          userRoleId,
          userData: { category } = {},
          userCategoryData = {},
        } = {},
      } = req;

      const QueueService = new queueService();

      const doesVitalExists = await VitalService.getByData({
        care_plan_id,
        vital_template_id,
      });

      if (!doesVitalExists) {
        const vitalData = await VitalService.addVital({
          care_plan_id,
          vital_template_id,
          start_date,
          end_date,
          details: {
            repeat_interval_id,
            repeat_days,
          },
          description,
        });

        const vitals = await VitalWrapper({ id: vitalData.get("id") });
        const { vital_templates, ...rest } = await vitals.getReferenceInfo();

        const carePlan = await CarePlanWrapper(null, vitals.getCarePlanId());

        const doctor = await DoctorWrapper(null, carePlan.getDoctorId());
        const patient = await PatientWrapper(null, carePlan.getPatientId());

        const { user_role_id: patientUserRoleId } = await patient.getAllInfo();

        const eventScheduleData = {
          type: EVENT_TYPE.VITALS,
          patient_id: patient.getPatientId(),
          patientUserId: patient.getUserId(),
          event_id: vitals.getVitalId(),
          event_type: EVENT_TYPE.VITALS,
          critical: false,
          start_date,
          end_date,
          details: vitals.getBasicInfo(),
          participants: [
            userRoleId,
            patientUserRoleId,
            ...carePlan.getCareplnSecondaryProfiles(),
          ],
          actor: {
            id: userId,
            user_role_id: userRoleId,
            category,
            userCategoryData,
          },
          vital_templates: vital_templates[vitals.getVitalTemplateId()],
        };

        // RRule
        const sqsResponse = await QueueService.sendMessage(eventScheduleData);

        logger.debug("sqsResponse ---> ", sqsResponse);

        // EventSchedule.create(eventScheduleData);

        const vitalJob = JobSdk.execute({
          eventType: EVENT_TYPE.VITALS,
          eventStage: NOTIFICATION_STAGES.CREATE,
          event: eventScheduleData,
        });

        NotificationSdk.execute(vitalJob);

        return raiseSuccess(
          res,
          200,
          {
            vitals: {
              [vitals.getVitalId()]: vitals.getBasicInfo(),
            },
            ...rest,
            vital_templates,
          },
          "Vital added successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Vital already added for the patient"
        );
      }
    } catch (error) {
      logger.error("create 500 error - vitals already added", error);
      return raiseServerError(res);
    }
  };

  updateVital = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    logger.debug("req.body --->", req.body);
    logger.debug("req.params --->", req.params);
    try {
      const {
        userDetails: {
          userId,
          userRoleId,
          userData: { category } = {},
          userCategoryData = {},
        } = {},
        body,
        body: { start_date, end_date } = {},
        params: { id } = {},
      } = req;
      const eventService = new EventService();

      const doesVitalExists = await VitalService.getByData({ id });

      if (!doesVitalExists) {
        return raiseClientError(res, 422, {}, "Vital does not exists");
      } else {
        const previousVital = await VitalWrapper({ data: doesVitalExists });
        const dataToUpdate = vitalHelper.getVitalUpdateData({
          ...body,
          previousVital,
        });
        const vitalData = await VitalService.update(dataToUpdate, id);

        logger.debug("vitalData", vitalData);

        const vitals = await VitalWrapper({ id });
        const vitalTemplates = await VitalTemplateWrapper({
          id: vitals.getVitalTemplateId(),
        });
        const carePlan = await CarePlanWrapper(null, vitals.getCarePlanId());

        const doctor = await DoctorWrapper(null, carePlan.getDoctorId());
        const patient = await PatientWrapper(null, carePlan.getPatientId());

        const { user_role_id: patientUserRoleId } = await patient.getAllInfo();

        const eventScheduleData = {
          type: EVENT_TYPE.VITALS,
          patient_id: patient.getUserId(),
          patientUserId: patient.getUserId(),
          event_id: vitals.getVitalId(),
          event_type: EVENT_TYPE.VITALS,
          critical: false,
          start_date,
          end_date,
          details: vitals.getBasicInfo(),
          participants: [
            userRoleId,
            patientUserRoleId,
            ...carePlan.getCareplnSecondaryProfiles(),
          ],
          actor: {
            id: userId,
            user_role_id: userRoleId,
            category,
            userCategoryData,
          },
          vital_templates: vitalTemplates.getBasicInfo(),
        };

        logger.debug("eventScheduleData", eventScheduleData);

        const deletedEvents = await eventService.deleteBatch({
          event_id: vitals.getVitalId(),
          event_type: EVENT_TYPE.VITALS,
        });

        logger.debug("deletedEvents", deletedEvents);

        // RRule
        const QueueService = new queueService();
        const sqsResponse = await QueueService.sendMessage(eventScheduleData);
        const vitalJob = JobSdk.execute({
          eventType: EVENT_TYPE.VITALS,
          eventStage: NOTIFICATION_STAGES.UPDATE,
          event: eventScheduleData,
        });
        NotificationSdk.execute(vitalJob);

        return raiseSuccess(
          res,
          200,
          {
            vitals: {
              [vitals.getVitalId()]: vitals.getBasicInfo(),
            },
            ...(await vitals.getReferenceInfo()),
            vital_id: vitals.getVitalId(),
          },
          "Vital updated successfully"
        );
      }
    } catch (error) {
      logger.error("create 500 error - vitals updated", error);
      return raiseServerError(res);
    }
  };

  getVitalFormDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const vitalData = await FeatureDetailService.getDetailsByData({
        feature_type: FEATURE_TYPE.VITAL,
      });

      const vitalDetails = await FeatureDetailWrapper(vitalData);

      return raiseSuccess(
        res,
        200,
        {
          ...vitalDetails.getFeatureDetails(),
          days: DAYS,
        },
        "Vital form details fetched successfully"
      );
    } catch (error) {
      logger.error("getVitalFormDetails 500 error", error);
      return raiseServerError(res);
    }
  };

  search = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      logger.debug("req.query --->", req.query);

      const { query: { value } = {} } = req;

      const vitalTemplates = await VitalTemplateService.searchByData(value);
      const templateDetails = {};
      const templateIds = [];

      if (Object.keys(vitalTemplates).length > 0) {
        for (const data of vitalTemplates) {
          const vitalData = await VitalTemplateWrapper({ data });
          templateDetails[vitalData.getVitalTemplateId()] =
            vitalData.getBasicInfo();
          templateIds.push(vitalData.getVitalTemplateId());
        }

        return raiseSuccess(
          res,
          200,
          {
            vital_templates: {
              ...templateDetails,
            },
            vital_template_ids: templateIds,
          },
          "Vitals fetched successfully"
        );
      } else {
        return raiseClientError(res, 422, {}, "No vital exists with this name");
      }
    } catch (error) {
      logger.error("vitals search 500 error", error);
      return raiseServerError(res);
    }
  };

  addVitalResponse = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      logger.debug("req.params --->", req.params);
      const {
        params: { id } = {},
        userDetails: { userRoleId, userData: { category } = {} } = {},
        body: { response } = {},
      } = req;
      const eventService = new EventService();

      if (category !== USER_CATEGORY.PATIENT) {
        return raiseClientError(res, 401, {}, "Unauthorized");
      }

      const { event_id, ...rest } = response || {};

      logger.debug(`event_id ${event_id}`);

      const createdTime = moment().utc().toISOString();

      const event = await EventWrapper(null, event_id);

      const vital = await VitalWrapper({ id });

      logger.debug(`vital ${vital.getVitalId()} ${vital.getVitalTemplateId()}`);
      const vitalTemplate = await VitalTemplateWrapper({
        id: vital.getVitalTemplateId(),
      });

      logger.debug(`event.getStatus() ${event.getStatus()}`);

      if (event.getStatus() !== EVENT_STATUS.EXPIRED) {
        let { response: prevResponse = [] } = event.getDetails() || {};

        prevResponse.unshift({
          value: rest,
          createdTime,
        });

        const updateEvent = await eventService.update(
          {
            details: {
              ...event.getDetails(),
              response: prevResponse,
            },
            status: EVENT_STATUS.COMPLETED,
          },
          event_id
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Cannot update response for the vital which has passed or has been missed"
        );
      }

      const carePlan = await CarePlanWrapper(null, vital.getCarePlanId());
      const doctorRoleId = carePlan.getUserRoleId();

      const doctorData = await DoctorWrapper(null, carePlan.getDoctorId());
      const patientData = await PatientWrapper(null, carePlan.getPatientId());

      const chatJSON = JSON.stringify({
        vitals: {
          [vital.getVitalId()]: vital.getBasicInfo(),
        },
        vital_templates: {
          [vitalTemplate.getVitalTemplateId()]: vitalTemplate.getBasicInfo(),
        },
        vital_id: vital.getVitalId(),
        response,
        type: EVENT_TYPE.VITALS,
      });

      const twilioMsg = await twilioService.addSymptomMessage(
        carePlan.getChannelId(),
        chatJSON
      );

      // const eventData = {
      //   participants: [doctorData.getUserId(), patientData.getUserId()],
      //   actor: {
      //     id: patientData.getUserId(),
      //     details: {
      //       name: patientData.getFullName(),
      //       category: USER_CATEGORY.PATIENT
      //     }
      //   },
      //   details: {
      //     message: `Recorded a reading for ${vitalTemplate.getName()}.`
      //   }
      // };

      // const chatJob = ChatJob.execute(
      //   MESSAGE_TYPES.USER_MESSAGE,
      //   eventData
      // );
      // await notificationSdk.execute(chatJob);

      const eventScheduleData = {
        type: EVENT_TYPE.VITALS,
        patient_id: patientData.getPatientId(),
        doctor_id: doctorData.getDoctorId(),
        id: event_id,
        event_id: vital.getVitalId(),
        event_type: EVENT_TYPE.VITALS,
        vital: vital.getBasicInfo(),
        participants: [
          doctorRoleId,
          userRoleId,
          ...carePlan.getCareplnSecondaryProfiles(),
        ],
        // participant_role_ids: [doctorRoleId, userRoleId, ...carePlan.getCareplnSecondaryProfiles()],
        actor: {
          id: patientData.getUserId(),
          user_role_id: userRoleId,
          details: {
            name: patientData.getFullName(),
            category: USER_CATEGORY.PATIENT,
          },
        },
        vital_templates: vitalTemplate.getBasicInfo(),
      };

      const vitalJob = JobSdk.execute({
        eventType: EVENT_TYPE.VITALS,
        eventStage: NOTIFICATION_STAGES.RESPONSE_ADDED,
        event: eventScheduleData,
      });

      await NotificationSdk.execute(vitalJob);

      return raiseSuccess(
        res,
        200,
        {
          ...(await vital.getAllInfo()),
        },
        `${vitalTemplate.getName().toUpperCase()} vital updated successfully`
      );
    } catch (error) {
      logger.error("addVitalResponse 500 error", error);
      return raiseServerError(res);
    }
  };

  getVitalResponseTimeline = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      logger.debug("req.params vital id ---> ", req.params);
      const { params: { id } = {} } = req;
      const eventService = new EventService();

      const today = moment().utc().toISOString();

      const vital = await VitalWrapper({ id });

      const completeEvents =
        await eventService.getAllPassedAndCompletedEventsData({
          event_id: id,
          event_type: EVENT_TYPE.VITALS,
          date: vital.getStartDate(),
          sort: "DESC",
        });

      let dateWiseVitalData = {};

      const timelineDates = [];

      if (completeEvents.length > 0) {
        for (const scheduleEvent of completeEvents) {
          const event = await EventWrapper(scheduleEvent);
          if (dateWiseVitalData.hasOwnProperty(event.getDate())) {
            dateWiseVitalData[event.getDate()].push(event.getAllInfo());
          } else {
            dateWiseVitalData[event.getDate()] = [];
            dateWiseVitalData[event.getDate()].push(event.getAllInfo());
            timelineDates.push(event.getDate());
          }
        }

        return raiseSuccess(
          res,
          200,
          {
            vital_timeline: {
              ...dateWiseVitalData,
            },
            vital_date_ids: timelineDates,
          },
          "Vital responses fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          200,
          {},
          "No response updated yet for the vital"
        );
      }
    } catch (error) {
      logger.error("getVitalResponse 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new VitalController();
