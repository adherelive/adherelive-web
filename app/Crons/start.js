import Logger from "../../libs/log";
import moment from "moment";

import {EVENT_STATUS, EVENT_TYPE, NOTIFICATION_STAGES} from "../../constant";

// SERVICES ---------------
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS ---------------
import ScheduleEventWrapper from "../ApiWrapper/common/scheduleEvents";

import JobSdk from "../JobSdk";
import NotificationSdk from "../NotificationSdk";

const Log = new Logger("CRON > START");

class StartCron {
    constructor() {
    }

    getScheduleData = async () => {
        const currentTime = moment().utc().set('seconds', 0).toDate();
        Log.debug("currentTime ---> ", currentTime);
        const scheduleEvents = await ScheduleEventService.getStartEventByData(currentTime);
        Log.debug("scheduleEvents ---> ", scheduleEvents);
        return scheduleEvents;
    };

    getStartEvents = async () => {
        try {
            const {getScheduleData} = this;
            const scheduleEvents = await getScheduleData();
            if(scheduleEvents.length > 0) {
                for (const scheduleEvent of scheduleEvents) {
                    const event = await ScheduleEventWrapper(scheduleEvent);
                    switch (event.getEventType()) {
                        case EVENT_TYPE.VITALS:
                            return this.handleVitalStart(event);
                        case EVENT_TYPE.MEDICATION_REMINDER:
                            // this.handleMedicationPrior(event);
                            break;
                        default:
                            break;
                    }
                }
            }
        } catch (error) {
            Log.debug("scheduleEvents 500 error ---->", error);
            // Log.errLog(500, "getPriorEvents", error.getMessage());
        }
    };

    handleVitalStart = async (event) => {
        try {
            const eventId = event.getEventId();

            const updateEventStatus = await ScheduleEventService.update({
                status: EVENT_STATUS.COMPLETED
            }, event.getScheduleEventId());

            const job = JobSdk.execute({
                eventType: EVENT_TYPE.VITALS,
                eventStage: NOTIFICATION_STAGES.START,
                event: event.getDetails()
            });
            await NotificationSdk.execute(job);
        } catch(error) {
            throw error;
        }
    };
}

export default new StartCron();