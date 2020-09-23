import Controller from "../../index";
import Logger from "../../../../libs/log";
import moment from "moment";

// SERVICES -------------------
// import VitalService from "../../../services/vitals/vital.service";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";
import CarePlanService from "../../../services/carePlan/carePlan.service";

// WRAPPERS -------------------
import EventWrapper from "../../../ApiWrapper/common/scheduleEvents";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";

import { EVENT_STATUS, EVENT_TYPE, USER_CATEGORY } from "../../../../constant";

const Log = new Logger("MOBILE > SCHEDULE_EVENTS > CONTROLLER");

class EventController extends Controller {
  constructor() {
    super();
  }

  getVitalEvent = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Log.debug("req.params", req.params);
      const { params: { id } = {} } = req;
      const eventService = new EventService();

      const events = await eventService.getEventByData({
        id
      });

      if (events) {
        const event = await EventWrapper(events);
        if (event.getEventType() === EVENT_TYPE.VITALS) {
          const vitals = await VitalWrapper({ id: event.getEventId() });
          const { vital_templates } = await vitals.getReferenceInfo();

          return raiseSuccess(
            res,
            200,
            {
              vital_templates: {
                ...vital_templates
              },
              vital_template_id: vitals.getVitalTemplateId()
            },
            "Vital template fetched successfully"
          );
        } else {
          return raiseClientError(res, 422, {}, "Invalid vital type event");
        }
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "No scheduled vital reminder exists for the event"
        );
      }
    } catch (error) {
      Log.debug("getVitalEvent 500 error", error);
      return raiseServerError(res);
    }
  };

  getAllEvents = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        query: { key = null } = {},
        userDetails: { userData: { category }, userCategoryId } = {}
      } = req;
      Log.info(`query : key = ${key}`);

      const eventService = new EventService();

      if (category !== USER_CATEGORY.PATIENT) {
        return raiseClientError(
          res,
          422,
          {},
          "Please login as patient to continue"
        );
      }

      const carePlanData = await CarePlanService.getSingleCarePlanByData({
        patient_id: userCategoryId
      });
      const carePlanWrapper = await CarePlanWrapper(carePlanData);
      const {
        appointment_ids = [],
        medication_ids = [],
        vital_ids = []
      } = await carePlanWrapper.getAllInfo();

      let events = [];

      const scheduleEvents = await eventService.getUpcomingByData({
        vital_ids,
        appointment_ids,
        medication_ids,
        startLimit,
        endLimit
      });

      const appointmentEvents = await eventService.getPageEventByData({
        startLimit,
        endLimit,
        event_type: EVENT_TYPE.APPOINTMENT,
        eventIds: appointment_ids
      });

      const medicationEvents = await eventService.getPageEventByData({
        startLimit,
        endLimit,
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
        eventIds: medication_ids
      });
      if (key) {
        const startLimit =
          parseInt(process.config.event.count) * (parseInt(key) - 1);
        const endLimit = parseInt(process.config.event.count);

        events = await EventService.getPageEventByData({
          startLimit,
          endLimit,
          eventIds: [...appointment_ids, ...medication_ids, ...vital_ids]
        });
      } else {
        events = await EventService.getPendingEventsData({
          eventIds: [...appointment_ids, ...medication_ids, ...vital_ids]
        });
      }

      let scheduleEvents = [
        ...vitalEvents,
        ...appointmentEvents,
        ...medicationEvents
      ];

      Log.debug("21237193721 events --> ", scheduleEvents.length);

      if (scheduleEvents.length > 0) {
        const dateWiseEventData = {};
        const scheduleEventData = {};
        const dates = [];
        for (const eventData of scheduleEvents) {
          const event = await EventWrapper(eventData);
          scheduleEventData[event.getScheduleEventId()] = event.getAllInfo();
          if (dateWiseEventData.hasOwnProperty(event.getDate())) {
            const {
              all: prevAll,
              appointments: prevAppointments,
              vitals: prevVitals,
              medications: prevMedications
            } = dateWiseEventData[event.getDate()] || {};
            const {
              all,
              appointments,
              vitals,
              medications
            } = event.getDateWiseInfo();
            dateWiseEventData[event.getDate()] = {
              all: [...prevAll, ...all],
              appointments: [...prevAppointments, ...appointments],
              medications: [...prevMedications, ...medications],
              vitals: [...prevVitals, ...vitals]
            };
          } else {
            const {
              all,
              appointments,
              vitals,
              medications
            } = event.getDateWiseInfo();
            dateWiseEventData[event.getDate()] = {
              all,
              appointments,
              medications,
              vitals
            };
            dates.push(event.getDate());
          }
        }

        return raiseSuccess(
          res,
          200,
          {
            schedule_events: {
              ...scheduleEventData
            },
            date_wise_events: {
              ...dateWiseEventData
            },
            date_ids: dates
          },
          "Events fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          200,
          {},
          "No scheduled events exists for the moment"
        );
      }
    } catch (error) {
      Log.debug("getVitalEvent 500 error", error);
      return raiseServerError(res);
    }
  };

  updateMedicationStatus = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { body: { status = null } = {} } = req || {};
      const eventService = new EventService();
      const { params: { eventId: event_id = null } = {} } = req || {};

      if (!event_id) {
        return raiseClientError(
          res,
          422,
          {},
          "Please give a proper event value."
        );
      }

      let eventDetails = await eventService.getEventByData({ id: event_id });
      let { details = {} } = eventDetails;

      details = { ...details, ...{ status } };
      eventDetails = { ...eventDetails, ...{ details } };

      const mEventDetails = await eventService.update(eventDetails, event_id);

      const updatedEventDetails = await eventService.getEventByData({
        id: event_id
      });

      const eventApiDetails = await EventWrapper(updatedEventDetails);

      return raiseSuccess(
        res,
        200,
        {
          schedule_events: {
            [eventApiDetails.getEventId()]: {
              ...eventApiDetails.getAllInfo()
            }
          }
        },
        "Medication reminder event status updated successfully"
      );
    } catch (error) {
      Log.debug("Update medication status 500 error: ", error);
      return raiseServerError(res);
    }
  };
}

export default new EventController();
