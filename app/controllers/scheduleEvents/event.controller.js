import Controller from "../";
import Logger from "../../../libs/log";
import moment from "moment";

// SERVICES
import CarePlanService from "../../services/carePlan/carePlan.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";
import SymptomService from "../../services/symptom/symptom.service";

// WRAPPER
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import EventWrapper from "../../ApiWrapper/common/scheduleEvents";
import SymptomWrapper from "../../ApiWrapper/web/symptoms";
import {EVENT_TYPE} from "../../../constant";

const Log = new Logger("WEB > EVENT > CONTROLLER");

class EventController extends Controller {
    constructor() {
        super();
    }

    getAllEvents = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            Log.debug("req.params", req.params);
            const {params: {patient_id} = {}} = req;

            const carePlanData = await CarePlanService.getSingleCarePlanByData({patient_id});
            const carePlan = await CarePlanWrapper(carePlanData);
            const {vital_ids = [], appointment_ids = [], medication_ids = []} = await carePlan.getAllInfo() || {};

            let symptomData = {};
            let documentData = {};
            const lastVisitData = [];

            const latestSymptom = await SymptomService.getLastUpdatedData({patient_id});
            if(latestSymptom.length > 0) {
                for(const symptoms of latestSymptom) {
                    const symptom = await SymptomWrapper({data: symptoms});
                    const {symptoms: latestSymptom} = await symptom.getAllInfo();
                    symptomData = {...symptomData, ...latestSymptom}
                    const {upload_documents} = await symptom.getReferenceInfo();
                    documentData = {...documentData, ...upload_documents};
                }
            }

            // TODO: need to rethink logic for latest events from last visit to include all types

            const vitalEvents = await EventService.getLastVisitData({
                event_id: vital_ids,
                event_type: EVENT_TYPE.VITALS,
                date: moment().subtract(7,'days').utc().toISOString(),
                sort:"DESC"
            });

            const appointmentEvents = await EventService.getLastVisitData({
                event_id: appointment_ids,
                event_type: EVENT_TYPE.APPOINTMENT,
                date: moment().subtract(7,'days').utc().toISOString(),
                sort:"DESC"
            });

            const medicationEvents = await EventService.getLastVisitData({
                event_id: medication_ids,
                event_type: EVENT_TYPE.MEDICATION_REMINDER,
                date: moment().subtract(7,'days').utc().toISOString(),
                sort:"DESC"
            });

            let scheduleEvents = [...vitalEvents, ...appointmentEvents, ...medicationEvents];

            if(scheduleEvents.length > 0) {
                const allIds = [];

                let scheduleEventData = {};
                for(const scheduleEvent of scheduleEvents) {
                    const event = await EventWrapper(scheduleEvent);
                    scheduleEventData[event.getScheduleEventId()] = event.getAllInfo();
                    allIds.push(event.getScheduleEventId());
                }

                for(const [key, event] of [...scheduleEvents, ...latestSymptom].entries()) {

                    lastVisitData.push({
                        event_type: event.get("event_type") ? "schedule_events" : "symptoms",
                        id: event.get("id"),
                        updatedAt: event.get("start_time")
                    });

                    if(key === 3) {
                        break;
                    }
                }

                lastVisitData.sort((activityA, activityB) => {
                   const {updatedAt: a} = activityA || {};
                   const {updatedAt: b} = activityB || {};
                    if (moment(a).isBefore(moment(b))) return 1;
                    if (moment(a).isAfter(moment(b))) return -1;
                    return 0;
                });


                return raiseSuccess(res, 200, {
                    schedule_events: {
                        ...scheduleEventData
                    },
                    symptoms: {
                        ...symptomData,
                    },
                    upload_documents: {
                        ...documentData,
                    },
                    last_visit: lastVisitData
                }, "Events fetched successfully");
            } else {
                return raiseSuccess(res, 200, {}, "No event updated yet");
            }


        } catch(error) {
            Log.debug("getAllEvents 500 error", error);
            return raiseServerError(res);
        }
    };

    getAllEventsTimeline = async (req, res) => {
        const {raiseSuccess, raiseClientError, raiseServerError} = this;
        try {
            Log.debug("req.params", req.params);
            const {params: {patient_id} = {}} = req;

            const carePlanData = await CarePlanService.getSingleCarePlanByData({patient_id});
            const carePlan = await CarePlanWrapper(carePlanData);
            const {vital_ids = [], appointment_ids = [], medication_ids = []} = await carePlan.getAllInfo() || {};

            let symptomData = {};
            let documentData = {};
            const lastVisitData = [];

            Log.debug("medication_ids", medication_ids);
            Log.debug("appointment_ids", appointment_ids);
            Log.debug("vital_ids", vital_ids);

            const latestSymptom = await SymptomService.getLastUpdatedData({patient_id});
            if(latestSymptom.length > 0) {
                for(const symptoms of latestSymptom) {
                    const symptom = await SymptomWrapper({data: symptoms});
                    const {symptoms: latestSymptom} = await symptom.getAllInfo();
                    symptomData = {...symptomData, ...latestSymptom}
                    const {upload_documents} = await symptom.getReferenceInfo();
                    documentData = {...documentData, ...upload_documents};
                }
            }

            const scheduleEvents = await EventService.getAllPassedByData({
                event_id: [...vital_ids, ...appointment_ids, ...medication_ids],
                date: moment().subtract(7,'days').utc().toISOString(),
                sort:"DESC"
            });

            if(scheduleEvents.length > 0) {
                const allIds = [];

                let scheduleEventData = {};
                for(const scheduleEvent of scheduleEvents) {
                    const event = await EventWrapper(scheduleEvent);
                    scheduleEventData[event.getScheduleEventId()] = event.getAllInfo();
                    allIds.push(event.getScheduleEventId());
                }

                Log.debug("event_ids", allIds);

                for(const event of [...scheduleEvents, ...latestSymptom]) {
                    Log.info(`event.get("updated_at") : ${event.get("updated_at")}`);
                    lastVisitData.push({
                        event_type: event.get("event_type") ? "schedule_events" : "symptoms",
                        id: event.get("id"),
                        updatedAt: event.get("start_time")
                    });
                }

                lastVisitData.sort((activityA, activityB) => {
                    const {updatedAt: a} = activityA || {};
                    const {updatedAt: b} = activityB || {};
                    if (moment(a).isBefore(moment(b))) return 1;
                    if (moment(a).isAfter(moment(b))) return -1;
                    return 0;
                });


                return raiseSuccess(res, 200, {
                    schedule_events: {
                        ...scheduleEventData
                    },
                    symptoms: {
                        ...symptomData,
                    },
                    upload_documents: {
                        ...documentData,
                    },
                    last_visit: lastVisitData
                }, "Events fetched successfully");
            } else {
                return raiseSuccess(res, 200, {}, "No event updated yet");
            }


        } catch(error) {
            Log.debug("getAllEvents 500 error", error);
            return raiseServerError(res);
        }
    };
}

export default new EventController();