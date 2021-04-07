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
import SymptomWrapper from "../../../ApiWrapper/mobile/symptoms";

import { EVENT_STATUS, EVENT_TYPE, USER_CATEGORY } from "../../../../constant";
import * as EventHelper from "../../scheduleEvents/eventHelper";
import SymptomService from "../../../services/symptom/symptom.service";
import eventService from "../../../services/scheduleEvents/scheduleEvent.service";

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
        query: { type = EVENT_TYPE.ALL, key = null } = {},
        userDetails: { userData: { category }, userCategoryId } = {}
      } = req;
      Log.info(`query : key = ${key} | type = ${type}`);

      if (category !== USER_CATEGORY.PATIENT) {
        return raiseClientError(
          res,
          422,
          {},
          "Please login as patient to continue"
        );
      }

      const eventService = new EventService();

      const allCarePlanData =
        (await CarePlanService.getMultipleCarePlanByData({
          patient_id: userCategoryId
        })) || [];

      let scheduleEvents = [];

      let vitalIds = [];
      let appointmentIds = [];
      let medicationIds = [];

      for (let i = 0; i < allCarePlanData.length; i++) {
        const carePlanData = allCarePlanData[i] || {};

        const carePlanWrapper = await CarePlanWrapper(carePlanData);
        const {
          appointment_ids = [],
          medication_ids = [],
          vital_ids = []
        } = await carePlanWrapper.getAllInfo();

        vitalIds = [...vitalIds, ...vital_ids];
        appointmentIds = [...appointmentIds, ...appointment_ids];
        medicationIds = [...medicationIds, ...medication_ids];
      }

      if (key) {
        const startLimit =
          parseInt(process.config.event.count) * (parseInt(key) - 1);
        const endLimit = parseInt(process.config.event.count);

        switch (type) {
          case EVENT_TYPE.ALL:
            scheduleEvents =
              (await eventService.getUpcomingByData({
                startLimit,
                endLimit,
                vital_ids: vitalIds,
                appointment_ids: appointmentIds,
                medication_ids: medicationIds
              })) || [];
            break;
          case EVENT_TYPE.APPOINTMENT:
            scheduleEvents =
              (await eventService.getUpcomingByData({
                startLimit,
                endLimit,
                appointment_ids: appointmentIds
              })) || [];
            break;
          case EVENT_TYPE.MEDICATION_REMINDER:
            scheduleEvents =
              (await eventService.getUpcomingByData({
                startLimit,
                endLimit,
                medication_ids: medicationIds
              })) || [];
            break;
          case EVENT_TYPE.VITALS:
            scheduleEvents =
              (await eventService.getUpcomingByData({
                startLimit,
                endLimit,
                vital_ids: vitalIds
              })) || [];
            break;
        }

        // scheduleEvents = [...scheduleEvents, ...carePlanScheduleEvents];

        // Log.debug("21237193721 events --> ", scheduleEvents.length);

        // const vitalEvents = await eventService.getPageEventByData({
        //   startLimit,
        //   endLimit,
        //   event_type: EVENT_TYPE.VITALS,
        //   eventIds: vital_ids
        // });
        //
        // const appointmentEvents = await eventService.getPageEventByData({
        //   startLimit,
        //   endLimit,
        //   event_type: EVENT_TYPE.APPOINTMENT,
        //   eventIds: appointment_ids
        // });
        //
        // const medicationEvents = await eventService.getPageEventByData({
        //   startLimit,
        //   endLimit,
        //   event_type: EVENT_TYPE.MEDICATION_REMINDER,
        //   eventIds: medication_ids
        // });
        //
        // scheduleEvents = [
        //     ...scheduleEvents,
        //   ...vitalEvents,
        //   ...appointmentEvents,
        //   ...medicationEvents
        // ];
      } else {
        scheduleEvents = await eventService.getPendingEventsData({
          appointments: {
            event_id: appointmentIds,
            event_type: EVENT_TYPE.APPOINTMENT
          },
          medications: {
            event_id: medicationIds,
            event_type: EVENT_TYPE.MEDICATION_REMINDER
          },
          vitals: {
            event_id: vitalIds,
            event_type: EVENT_TYPE.VITALS
          }
        });
      }
      // else {
      //   scheduleEvents = await eventService.getPendingEventsData({
      //     eventIds: [...appointment_ids, ...medication_ids, ...vital_ids]
      //   });
      // }

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

  markEventComplete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {}, body: { event_data = {} } = {} } = req;
      const eventService = new EventService();

      const eventDetails = await eventService.getEventByData({ id });
      const { details = {} } = eventDetails;

      const updatedDetails = { ...details, ...event_data };
      const markEventComplete = await eventService.update(
        { status: EVENT_STATUS.COMPLETED, details: updatedDetails },
        id
      );

      Log.debug("1982732178 markEventComplete ---> ", markEventComplete);

      const event = await EventWrapper(null, id);
      const {
        medications = {},
        appointments = {},
        medicines = {},
        schedule_events = {}
      } = await event.getReferenceInfo();

      return raiseSuccess(
        res,
        200,
        {
          appointments,
          medications,
          medicines,
          schedule_events
        },
        "Event completed successfully"
      );
    } catch (error) {
      Log.debug("markEventComplete 500 error", error);
      return raiseServerError(res);
    }
  };

  markEventCancelled = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {}, body: { event_data = {} } = {} } = req;
      const eventService = new EventService();

      const eventDetails = await eventService.getEventByData({ id });
      const { details = {} } = eventDetails;

      const updatedDetails = { ...details, ...event_data };
      const markEventCancelled = await eventService.update(
        { status: EVENT_STATUS.CANCELLED, details: updatedDetails },
        id
      );

      Log.debug("1982732178 markEventComplete ---> ", markEventCancelled);

      const event = await EventWrapper(null, id);
      const {
        medications = {},
        appointments = {},
        medicines = {},
        schedule_events = {}
      } = await event.getReferenceInfo();

      return raiseSuccess(
        res,
        200,
        {
          appointments,
          medications,
          medicines,
          schedule_events
        },
        "Event completed successfully"
      );
    } catch (error) {
      Log.debug("markEventComplete 500 error", error);
      return raiseServerError(res);
    }
  };

  getAllMissedEvents = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { userDetails: { userData: { category } = {} } = {} } = req;
      Log.info(`CHARTS FOR AUTH: ${category}`);

      let response = {};
      let responseMessage = "No event data exists at the moment";

      switch (category) {
        case USER_CATEGORY.DOCTOR:
          [response, responseMessage] = await EventHelper.doctorChart(req);
          break;
        // case USER_CATEGORY.PROVIDER:
        //   [response, responseMessage] = await EventHelper.providerChart(
        //       req
        //   );
        //   break;
      }

      return raiseSuccess(res, 200, { ...response }, responseMessage);
    } catch (error) {
      Log.debug("getAllMissedEvents 500 error", error);
      return raiseServerError(res);
    }
  };

  getPatientMissedEvents = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        params: { patient_id } = {},
        userDetails: { userRoleId = null ,  userData: { category }, userCategoryId } = {}
      } = req;
      Log.info(`params : patient_id = ${patient_id}`);

      // considering api to be only accessible for doctors
      const carePlans =
        (await CarePlanService.getMultipleCarePlanByData({
          patient_id,
          [category === USER_CATEGORY.DOCTOR && 'user_role_id' ]:  category === USER_CATEGORY.DOCTOR &&  userRoleId 
        })) || [];

      const EventService = new eventService();

      let appointmentCritical = [];
      let appointmentNonCritical = [];

      let medicationCritical = [];
      let medicationNonCritical = [];

      let vitalCritical = [];
      let vitalNonCritical = [];

      for (let index = 0; index < carePlans.length; index++) {
        const carePlan = await CarePlanWrapper(carePlans[index]);
        const {
          appointment_ids,
          medication_ids,
          vital_ids
        } = await carePlan.getAllInfo();

        // get appointment count
        for (let id of appointment_ids) {
          const criticalAppointment =
            (await EventService.getCount({
              event_type: EVENT_TYPE.APPOINTMENT,
              event_id: id,
              status: EVENT_STATUS.EXPIRED,
              critical: true
            })) || 0;

          const nonCriticalAppointment =
            (await EventService.getCount({
              event_type: EVENT_TYPE.APPOINTMENT,
              event_id: id,
              status: EVENT_STATUS.EXPIRED,
              critical: false
            })) || 0;

          if (criticalAppointment > 0) {
            appointmentCritical.push(id);
          }
          if (nonCriticalAppointment > 0) {
            appointmentNonCritical.push(id);
          }
        }

        // get medication count
        for (let id of medication_ids) {
          const criticalMedication =
            (await EventService.getCount({
              event_type: EVENT_TYPE.MEDICATION_REMINDER,
              event_id: id,
              status: EVENT_STATUS.EXPIRED,
              critical: true
            })) || 0;

          const nonCriticalMedication =
            (await EventService.getCount({
              event_type: EVENT_TYPE.MEDICATION_REMINDER,
              event_id: id,
              status: EVENT_STATUS.EXPIRED,
              critical: false
            })) || 0;

          if (criticalMedication > 0) {
            medicationCritical.push(id);
          }
          if (nonCriticalMedication > 0) {
            medicationNonCritical.push(id);
          }
        }

        // get vitals count (action)
        for (let id of vital_ids) {
          const criticalVital =
            (await EventService.getCount({
              event_type: EVENT_TYPE.VITALS,
              event_id: id,
              status: EVENT_STATUS.EXPIRED,
              critical: true
            })) || 0;

          const nonCriticalVital =
            (await EventService.getCount({
              event_type: EVENT_TYPE.VITALS,
              event_id: id,
              status: EVENT_STATUS.EXPIRED,
              critical: false
            })) || 0;

          if (criticalVital > 0) {
            vitalCritical.push(id);
          }
          if (nonCriticalVital > 0) {
            vitalNonCritical.push(id);
          }
        }
      }

      // symptoms
      const symptomsCount = await SymptomService.getCount({
        patient_id
      });

      return raiseSuccess(
        res,
        200,
        {
          missed_appointment: {
            critical: appointmentCritical.length,
            non_critical: appointmentNonCritical.length
          },
          missed_medications: {
            critical: medicationCritical.length,
            non_critical: medicationNonCritical.length
          },
          missed_vitals: {
            critical: vitalCritical.length,
            non_critical: vitalNonCritical.length
          },
          missed_symptoms: {
            critical: 0,
            non_critical: symptomsCount
          }
        },
        "Patient missed events fetched successfully"
      );
    } catch (error) {
      Log.debug("getPatientMissedEvents 500 error", error);
      return raiseServerError(res);
    }
  };

  getLastVisitEvents = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      Log.debug("req.params", req.params);
      const { params: { patient_id } = {} ,userDetails : { userData: { category } = {}  } = {} } = req;
      const EventService = new eventService();
      const { userRoleId = null }  = userDetails ;
      let carePlan = null , vital_ids = [],appointment_ids =[], medication_ids = [] ;

      const carePlanData = await CarePlanService.getSingleCarePlanByData({
        patient_id,
        [category === USER_CATEGORY.DOCTOR && 'user_role_id' ] : category === USER_CATEGORY.DOCTOR && userRoleId 
      });

      if(carePlanData){
        carePlan = await CarePlanWrapper(carePlanData);
        const { vital_ids:cPvital_ids = [], appointment_ids:cPappointment_ids = [], medication_ids :cPmedication_ids= [] } =
          (await carePlan.getAllInfo()) || {};
          
          vital_ids = cPvital_ids;
          appointment_ids = cPappointment_ids ;
          medication_ids = cPmedication_ids;
      }
     

      let symptomData = {};
      let documentData = {};
      const lastVisitData = [];

      const latestSymptom = await SymptomService.getLastUpdatedData({
        patient_id
      });
      if (latestSymptom.length > 0) {
        for (const symptoms of latestSymptom) {
          const symptom = await SymptomWrapper({ data: symptoms });
          const { symptoms: latestSymptom } = await symptom.getAllInfo();
          symptomData = { ...symptomData, ...latestSymptom };
          const { upload_documents } = await symptom.getReferenceInfo();
          documentData = { ...documentData, ...upload_documents };
        }
      }

      // TODO: need to rethink logic for latest events from last visit to include all types

      const vitalEvents = await EventService.getLastVisitData({
        event_id: vital_ids,
        event_type: EVENT_TYPE.VITALS,
        date: moment()
          .subtract(7, "days")
          .utc()
          .toISOString(),
        sort: "DESC"
      });

      const appointmentEvents = await EventService.getLastVisitData({
        event_id: appointment_ids,
        event_type: EVENT_TYPE.APPOINTMENT,
        date: moment()
          .subtract(7, "days")
          .utc()
          .toISOString(),
        sort: "DESC"
      });

      const medicationEvents = await EventService.getLastVisitData({
        event_id: medication_ids,
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
        date: moment()
          .subtract(7, "days")
          .utc()
          .toISOString(),
        sort: "DESC"
      });

      let scheduleEvents = [
        ...vitalEvents,
        ...appointmentEvents,
        ...medicationEvents
      ];

      if (scheduleEvents.length > 0) {
        const allIds = [];

        let scheduleEventData = {};
        for (const scheduleEvent of scheduleEvents) {
          const event = await EventWrapper(scheduleEvent);
          scheduleEventData[event.getScheduleEventId()] = event.getAllInfo();
          allIds.push(event.getScheduleEventId());
        }

        for (const [key, event] of [
          ...scheduleEvents,
          ...latestSymptom
        ].entries()) {
          lastVisitData.push({
            event_type: event.get("event_type")
              ? "schedule_events"
              : "symptoms",
            id: event.get("id"),
            updatedAt: event.get("event_type")
              ? event.get("start_time")
              : event.get("created_at")
          });

          if (key === 3) {
            break;
          }
        }

        lastVisitData.sort((activityA, activityB) => {
          const { updatedAt: a } = activityA || {};
          const { updatedAt: b } = activityB || {};
          if (moment(a).isBefore(moment(b))) return 1;
          if (moment(a).isAfter(moment(b))) return -1;
          return 0;
        });

        return raiseSuccess(
          res,
          200,
          {
            schedule_events: {
              ...scheduleEventData
            },
            symptoms: {
              ...symptomData
            },
            upload_documents: {
              ...documentData
            },
            last_visit: lastVisitData
          },
          "Events fetched successfully"
        );
      } else {
        return raiseSuccess(res, 200, {}, "No event updated yet");
      }
    } catch (error) {
      Log.debug("getLastVisitEvents 500 error", error);
      return raiseServerError(res);
    }
  };

  deleteVitalResponse = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {params: {id}, query: {index} = {}} = req;
      Log.info(`params: event_id: ${id} | query : index : ${index}`);

      if(!id || !index) {
        return raiseClientError(res, 422, {}, "Please enter valid event id and index for the response");
      }

      const EventService = new eventService();

      const eventData = await EventService.getEventByData({
        id,
      });

      let eventId = null;

      if(eventData) {
        const event = await EventWrapper(eventData);
        let { response: prevResponse = [] } = event.getDetails() || {};
        eventId = event.getEventId();
        const afterDeleteResponse = prevResponse.splice(index, 1);

        await EventService.update(
            {
              details: {
                ...event.getDetails(),
                response: prevResponse
              },
            },
            id
        );

        if(eventId) {
          const vital = await VitalWrapper({id: eventId});
          const completeEvents = await EventService.getAllPassedByData({
            event_id: vital.getVitalId(),
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
                "Vital responses deleted and updated successfully"
            );
          } else {
            return raiseSuccess(
                res,
                200,
                {},
                "Vital Response deleted successfully"
            );
          }
        }


      } else {
        return raiseClientError(res, 422, {}, "No event present for the event id mentioned");
      }

    } catch(error) {
      Log.debug("deleteVitalResponse 500 error", error);
      return raiseServerError(res);
    }
  };

  updateVitalResponse = async (req, res) => {
    const {raiseSuccess, raiseClientError, raiseServerError} = this;
    try {
      const {params: {id}, query: {index} = {}, body : {value = {}} = {}} = req;
      Log.info(`params: event_id: ${id} | query : index : ${index}`);
      Log.debug("body : value ", value);

      if(!id || !index) {
        return raiseClientError(res, 422, {}, "Please enter valid event id and index for the response");
      }

      const EventService = new eventService();

      const eventData = await EventService.getEventByData({
        id,
      });

      let eventId = null;

      if(eventData) {
        const event = await EventWrapper(eventData);
        let {response: prevResponse = []} = event.getDetails() || {};
        eventId = event.getEventId();

        const response = prevResponse[index];

        prevResponse.splice(index, 1, {
            value,
            createdTime: response.createdTime
        });

        await EventService.update(
            {
              details: {
                ...event.getDetails(),
                response: prevResponse
              },
            },
            id
        );
        if(eventId) {
          const vital = await VitalWrapper({id: eventId});
          const completeEvents = await EventService.getAllPassedByData({
            event_id: vital.getVitalId(),
            event_type: EVENT_TYPE.VITALS,
            date: vital.getStartDate(),
            sort: "DESC"
          }) || [];

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
                "Vital responses deleted and updated successfully"
            );
          } else {
            return raiseSuccess(
                res,
                200,
                {},
                "Vital Response deleted successfully"
            );
          }
        }


      } else {
        return raiseClientError(res, 422, {}, "No event present for the event id mentioned");
      }
    } catch(error) {
      Log.debug("updateVitalResponse500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new EventController();
