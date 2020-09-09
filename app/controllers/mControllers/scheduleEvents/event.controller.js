import Controller from "../../index";
import Logger from "../../../../libs/log";
import moment from "moment";

// SERVICES -------------------
import VitalService from "../../../services/vitals/vital.service";
import EventService from "../../../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS -------------------
import EventWrapper from "../../../ApiWrapper/common/scheduleEvents";
import {EVENT_STATUS} from "../../../../constant";

const Log = new Logger("MOBILE > SCHEDULE_EVENTS > CONTROLLER");

class EventController extends Controller {
    constructor() {
        super();
    }

    getVitalEvent = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
      try {
        Log.debug("req.params", req.params);
        const {params: {id} = {}} = req;

        const currentDate = moment().utc().toDate();

        const events = await EventService.getAllPassedByData({
           event_id: id,
           date: currentDate
        });

        let scheduleEvents = {};

        for(const eventData of events) {
            const event = await EventWrapper(eventData);
            scheduleEvents[event.getScheduleEventId()] = event.getAllInfo();
        }

        let vitalEvents = {};
        let scheduleEventData = {};

        if(vitals.length > 0) {
            for(const vital of vitals) {

                const scheduleEvents = await EventService.getAllPreviousByData({
                    event_id: vital.get("id"),
                    date: currentDate
                });

                let remaining = 0;
                let latestPendingEventId = null;

                const scheduleEventIds = [];
                for(const events of scheduleEvents) {
                    const scheduleEvent = await EventWrapper(events);
                    if(scheduleEvent.getStatus() === EVENT_STATUS.PENDING) {
                        if(!latestPendingEventId) {
                            latestPendingEventId = scheduleEvent.getScheduleEventId();
                        }
                        remaining++;
                    }
                    scheduleEventIds.push(scheduleEvent.getScheduleEventId());
                    scheduleEventData[scheduleEvent.getScheduleEventId()] = scheduleEvent.getAllInfo();
                }

                vitalEvents[vital.get("id")] = {
                    remaining,
                    total: scheduleEvents.length,
                    schedule_event_ids: scheduleEventIds,
                    upcoming_event_id: latestPendingEventId
                };
            }

            return raiseSuccess(
                res,
                200,
                {
                    vital_events_per_day: {
                        ...vitalEvents
                    },
                    schedule_events: {
                        ...scheduleEventData
                    }
                }
            )
        }
      } catch(error) {
          Log.debug("getVitalEvent 500 error", error);
          return raiseServerError(res);
      }
    };
}

export default new EventController();