import Controller from "../../";
import Logger from "../../../../libs/log";
import moment from "moment";
import * as vitalHelper from "../../vitals/vitalHelper";

// SERVICES
import VitalService from "../../../services/vitals/vital.service";
import VitalTemplateService from "../../../services/vitalTemplates/vitalTemplate.service";
import FeatureDetailService from "../../../services/featureDetails/featureDetails.service";
import eventService from "../../../services/scheduleEvents/scheduleEvent.service";
import twilioService from "../../../services/twilio/twilio.service";
import queueService from "../../../services/awsQueue/queue.service";

// WRAPPERS
import VitalTemplateWrapper from "../../../ApiWrapper/mobile/vitalTemplates";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";
import FeatureDetailWrapper from "../../../ApiWrapper/mobile/featureDetails";
import EventWrapper from "../../../ApiWrapper/common/scheduleEvents";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";

import JobSdk from "../../../JobSdk";
import NotificationSdk from "../../../NotificationSdk";
import {
  DAYS,
  EVENT_STATUS,
  EVENT_TYPE,
  FEATURE_TYPE,
  NOTIFICATION_STAGES, USER_CATEGORY
} from "../../../../constant";
import SqsQueueService from "../../../services/awsQueue/queue.service";

const Log = new Logger("MOBILE > VITALS > CONTROLLER");

class VitalController extends Controller {
  constructor() {
    super();
  }

  addVital = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    Log.debug("req.body --->", req.body);
    try {
      const {
        body: {
          care_plan_id,
          vital_template_id,
          repeat_interval_id,
          start_date,
          end_date,
          repeat_days,
          description
        } = {},
        userDetails: { userId, userData: { category } = {}, userCategoryData = {} } = {},
      } = req;

      const QueueService = new queueService();

      const doesVitalExists = await VitalService.getByData({
        care_plan_id,
        vital_template_id
      });

      if (!doesVitalExists) {
        const vitalData = await VitalService.addVital({
          care_plan_id,
          vital_template_id,
          start_date,
          end_date,
          details: {
            repeat_interval_id,
            repeat_days
          },
          description
        });

        const vitals = await VitalWrapper({ id: vitalData.get("id") });
        const {vital_templates, ...rest} = await vitals.getReferenceInfo();

        const carePlan = await CarePlanWrapper(null, vitals.getCarePlanId());

        const doctor = await DoctorWrapper(null, carePlan.getDoctorId());
        const patient = await PatientWrapper(null, carePlan.getPatientId());

        const eventScheduleData = {
          type: EVENT_TYPE.VITALS,
          patient_id: patient.getUserId(),
          event_id: vitals.getVitalId(),
          event_type: EVENT_TYPE.VITALS,
          critical: false,
          start_date,
          end_date,
          details: vitals.getBasicInfo(),
          participants: [doctor.getUserId(), patient.getUserId()],
          actor: {
            id: userId,
            category,
            userCategoryData
          },
          vital_templates: vital_templates[vitals.getVitalTemplateId()]
        };

        // RRule
        const sqsResponse = await QueueService.sendMessage("test_queue", eventScheduleData);

        Log.debug("sqsResponse ---> ", sqsResponse);

        // EventSchedule.create(eventScheduleData);

        const vitalJob = JobSdk.execute({
          eventType: EVENT_TYPE.VITALS,
          eventStage: NOTIFICATION_STAGES.CREATE,
          event: eventScheduleData
        });

        NotificationSdk.execute(vitalJob);

        return raiseSuccess(
          res,
          200,
          {
            vitals: {
              [vitals.getVitalId()]: vitals.getBasicInfo()
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
      Log.debug("vitals create 500 error", error);
      return raiseServerError(res);
    }
  };

  updateVital = async (req, res) => {
    const {raiseSuccess, raiseClientError, raiseServerError} = this;
    Log.debug("req.body --->", req.body);
    Log.debug("req.params --->", req.params);
    try {
      const {
        userDetails: {userId, userData: {category} = {}} = {},
        body,
        body: {start_date, end_date} = {},
        params: {id} = {}
      } = req;
      const EventService = new eventService();


      const doesVitalExists = await VitalService.getByData({id});

      if(!doesVitalExists) {
        return raiseClientError(res, 422, {}, "Vital does not exists");
      } else {

        const previousVital = await VitalWrapper({data: doesVitalExists});
        const dataToUpdate = vitalHelper.getVitalUpdateData({...body, previousVital});
        const vitalData = await VitalService.update(dataToUpdate, id);

        Log.debug("vitalData", vitalData);


        const vitals = await VitalWrapper({id});
        const vitalTemplates = await VitalTemplateWrapper({id: vitals.getVitalTemplateId()});
        const carePlan = await CarePlanWrapper(null, vitals.getCarePlanId());

        const doctor = await DoctorWrapper(null, carePlan.getDoctorId());
        const patient = await PatientWrapper(null, carePlan.getPatientId());

        const eventScheduleData = {
          event_id: vitals.getVitalId(),
          event_type: EVENT_TYPE.VITALS,
          critical: false,
          start_date,
          end_date,
          details: vitals.getBasicInfo(),
          participants: [doctor.getUserId(), patient.getUserId()],
          actor: {
            id: userId,
            category
          },
          vital_templates: vitalTemplates.getBasicInfo()
        };

        Log.debug("eventScheduleData", eventScheduleData);

        const deletedEvents = await EventService.deleteBatch(vitals.getVitalId());

        Log.debug("deletedEvents", deletedEvents);



        // RRule
        EventSchedule.create(eventScheduleData);

        return raiseSuccess(
            res,
            200,
            {
              vitals: {
                [vitals.getVitalId()]: vitals.getBasicInfo()
              },
              ... await vitals.getReferenceInfo(),
              vital_id: vitals.getVitalId()
            },
            "Vital updated successfully"
        );
      }
    } catch(error) {
      Log.debug("vitals create 500 error", error);
      return raiseServerError(res);
    }
  };

  getVitalFormDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const vitalData = await FeatureDetailService.getDetailsByData({
        feature_type: FEATURE_TYPE.VITAL
      });

      const vitalDetails = await FeatureDetailWrapper(vitalData);

      return raiseSuccess(
        res,
        200,
        {
          ...vitalDetails.getFeatureDetails(),
          days: DAYS
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

      if (Object.keys(vitalTemplates).length > 0) {
        for (const data of vitalTemplates) {
          const vitalData = await VitalTemplateWrapper({ data });
          templateDetails[
            vitalData.getVitalTemplateId()
          ] = vitalData.getBasicInfo();
          templateIds.push(vitalData.getVitalTemplateId());
        }

        return raiseSuccess(
          res,
          200,
          {
            vital_templates: {
              ...templateDetails
            },
            vital_template_ids: templateIds
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

  addVitalResponse = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Log.debug("req.params --->", req.params);
      const { params: { id } = {}, userDetails: {userData: {category} = {}} = {}, body: { response } = {} } = req;
      const EventService = new eventService();

      if(category !== USER_CATEGORY.PATIENT) {
        return raiseClientError(res, 401, {}, "Unauthorized");
      }

      const {event_id, ...rest} = response || {};

      Log.info(`event_id ${event_id}`);

      const createdTime = moment()
        .utc()
        .toISOString();

      const event = await EventWrapper(null, event_id);

      const vital = await VitalWrapper({ id });

      Log.info(`vital ${vital.getVitalId()} ${vital.getVitalTemplateId()}`);
      const vitalTemplate = await VitalTemplateWrapper({
        id: vital.getVitalTemplateId()
      });

      Log.info(`event.getStatus() ${event.getStatus()}`);

      if (event.getStatus() === EVENT_STATUS.SCHEDULED) {
        const updateEvent = await EventService.update(
          {
            details: {
              ...event.getDetails(),
              response: {
                value: rest,
                createdTime
              }
            },
            status: EVENT_STATUS.COMPLETED
          },
            event_id
        );
      } else {
        return raiseClientError(
          res,
          422,
          {

          },
          "Cannot update response for the vital which has passed or has been missed"
        );
      }

      const carePlan = await CarePlanWrapper(null, vital.getCarePlanId());

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

      const twilioMsg = await twilioService.addSymptomMessage(doctorData.getUserId(), patientData.getUserId(), chatJSON);

      return raiseSuccess(
        res,
        200,
        {
          ...await vital.getAllInfo()
        },
        `${vitalTemplate.getName().toUpperCase()} vital updated successfully`
      );
    } catch (error) {
      Log.debug("addVitalResponse 500 error", error);
      return raiseServerError(res);
    }
  };

  getVitalResponseTimeline = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Log.debug("req.params vital id---->", req.params);
      const { params: { id } = {} } = req;
      const EventService = new eventService();

      const today = moment()
        .utc()
        .toISOString();

      const vital = await VitalWrapper({id});

      const completeEvents = await EventService.getAllPassedByData({
        event_id: id,
        event_type: EVENT_TYPE.VITALS,
        date: vital.getStartDate(),
        sort: "DESC"
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
              ...dateWiseVitalData
            },
            vital_date_ids: timelineDates
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
      Log.debug("getVitalResponse 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new VitalController();
