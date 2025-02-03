import Controller from "../index";

import { createLogger } from "../../../libs/log";

// Helpers
import * as vitalHelper from "./vital.helper";

// Services
import VitalTemplateService from "../../services/vitalTemplates/vitalTemplate.service";
import VitalService from "../../services/vitals/vital.service";
import FeatureDetailService from "../../services/featureDetails/featureDetails.service";
import queueService from "../../services/awsQueue/queue.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";
import carePlanService from "../../services/carePlan/carePlan.service";

// Wrappers
import VitalTemplateWrapper from "../../apiWrapper/web/vitalTemplates";
import VitalWrapper from "../../apiWrapper/web/vitals";
import FeatureDetailWrapper from "../../apiWrapper/web/featureDetails";
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import DoctorWrapper from "../../apiWrapper/web/doctor";
import PatientWrapper from "../../apiWrapper/web/patient";

import {
  DAYS,
  EVENT_STATUS,
  EVENT_TYPE,
  FEATURE_TYPE,
  NOTIFICATION_STAGES,
} from "../../../constant";
import moment from "moment";

import EventWrapper from "../../apiWrapper/common/scheduleEvents";
import JobSdk from "../../jobSdk";
import NotificationSdk from "../../notificationSdk";

const Log = createLogger("WEB > VITALS > CONTROLLER");

class VitalController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    Log.debug("req.body --->", req.body);
    try {
      const {
        userDetails: {
          userId,
          userRoleId,
          userData: { category } = {},
          userCategoryData = {},
        } = {},
        body: {
          care_plan_id,
          vital_template_id,
          repeat_interval_id,
          start_date,
          end_date,
          repeat_days,
          description,
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
            description,
          },
          // description,
        });

        const vitals = await VitalWrapper({ id: vitalData.get("id") });
        const vitalTemplates = await VitalTemplateWrapper({
          id: vitals.getVitalTemplateId(),
        });
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
          vital_templates: vitalTemplates.getBasicInfo(),
        };

        const sqsResponse = await QueueService.sendMessage(eventScheduleData);

        const vitalJob = JobSdk.execute({
          eventType: EVENT_TYPE.VITALS,
          eventStage: NOTIFICATION_STAGES.CREATE,
          event: eventScheduleData,
        });

        NotificationSdk.execute(vitalJob);

        // RRule
        // await EventSchedule.create(eventScheduleData);

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
      Log.debug("create 500 error - vitals already added", error);
      return raiseServerError(res);
    }
  };

  updateVital = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    Log.debug("req.body --->", req.body);
    Log.debug("req.params --->", req.params);
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
      const QueueService = new queueService();

      const doesVitalExists = await VitalService.getByData({ id });

      if (!doesVitalExists) {
        return raiseClientError(
          res,
          422,
          {},
          "Vital does not exists for the mentioned id"
        );
      } else {
        const previousVital = await VitalWrapper({ data: doesVitalExists });
        const dataToUpdate = vitalHelper.getVitalUpdateData({
          ...body,
          previousVital,
        });

        const vitalData = await VitalService.update(dataToUpdate, id);

        Log.debug("vitalData", vitalData);

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

        Log.debug("eventScheduleData", eventScheduleData);

        // Delete previously scheduled events
        const deletedEvents = await eventService.deleteBatch({
          event_id: vitals.getVitalId(),
          event_type: EVENT_TYPE.VITALS,
        });

        Log.debug("deletedEvents", deletedEvents);

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
          "Vital added successfully"
        );
      }
    } catch (error) {
      Log.debug("Cannot create vitals 500 error -> vitals added: ", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        params: { id } = {},
        userDetails: {
          userId,
          userRoleId,
          userData: { category } = {},
          userCategoryData: { basic_info: { full_name } = {} } = {},
        } = {},
      } = req;
      const medicationDetails =
        await medicationReminderService.deleteMedication(id);
      await NotificationSdk.execute(medicationDetails);
      return raiseSuccess(res, 200, {}, "medication deleted successfully");
    } catch (error) {
      Log.debug("deleteMedication error", error);
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
      Log.debug("getVitalFormDetails 500 error", error);
      return raiseServerError(res);
    }
  };

  search = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Log.debug("req.query --->", req.query);
      const { query: { value } = {} } = req;

      const vitalTemplates = await VitalTemplateService.searchByData(value);
      const templateDetails = {};
      const templateIds = [];

      if (vitalTemplates.length > 0) {
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
      Log.debug("vitals search 500 error", error);
      return raiseServerError(res);
    }
  };

  getVitalResponseTimeline = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Log.debug(
        "getVitalResponseTimeline req.params vital id ---> ",
        req.params
      );
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
      Log.debug("Cannot getVitalResponseTimeline 500 error: ", error);
      return raiseServerError(res);
    }
  };

  getAllMissedVitals = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { body, userDetails } = req;

      const {
        userRoleId = null,
        userId,
        userData: { category } = {},
        userCategoryData: { basic_info: { id: doctorId } = {} } = {},
      } = userDetails || {};

      let docAllCarePlanData = [];
      let vitalApiData = {};
      let flag = true;
      let criticalVitalEventIds = [];
      let nonCriticalVitalEventIds = [];
      const scheduleEventService = new ScheduleEventService();

      docAllCarePlanData = await carePlanService.getCarePlanByData({
        user_role_id: userRoleId,
      });

      // Log.debug("786756465789",docAllCarePlanData);

      for (let carePlan of docAllCarePlanData) {
        const carePlanApiWrapper = await CarePlanWrapper(carePlan);
        const { vital_ids } = await carePlanApiWrapper.getAllInfo();

        for (let vId of vital_ids) {
          // Log.debug("87657898763545",vital_ids);

          let expiredVitalsList = await scheduleEventService.getAllEventByData({
            event_type: EVENT_TYPE.VITALS,
            status: EVENT_STATUS.EXPIRED,
            event_id: vId,
          });

          for (let vital of expiredVitalsList) {
            const vitalEventWrapper = await EventWrapper(vital);
            // Log.debug("8976756576890",vitalEventWrapper);

            if (vitalEventWrapper.getCriticalValue()) {
              if (
                !criticalVitalEventIds.includes(vitalEventWrapper.getEventId())
              ) {
                criticalVitalEventIds.push(vitalEventWrapper.getEventId());
              }
            } else {
              if (
                !nonCriticalVitalEventIds.includes(
                  vitalEventWrapper.getEventId()
                )
              ) {
                nonCriticalVitalEventIds.push(vitalEventWrapper.getEventId());
              }
            }

            vitalApiData[vitalEventWrapper.getEventId()] =
              vitalEventWrapper.getDetails();
          }
        }
      }

      if (
        Object.keys(vitalApiData).length === 0 &&
        vitalApiData.constructor === Object
      ) {
        flag = false;
      }

      if (flag === true) {
        return raiseSuccess(
          res,
          200,
          {
            missed_vital_events: {
              ...vitalApiData,
            },
            critical_vital_event_ids: criticalVitalEventIds,
            non_critical_vital_event_ids: nonCriticalVitalEventIds,
          },
          `Missed vitals fetched successfully`
        );
      } else {
        return raiseSuccess(res, 201, {}, "No Missed Vitals");
      }
    } catch (error) {
      Log.debug("getVitalDetails 500 error ", error);
      return raiseServerError(res);
    }
  };
}

export default new VitalController();
