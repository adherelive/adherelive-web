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
        const currentTime = moment().utc().toISOString();
        Log.info(`currentTime : ${currentTime}`);
        const scheduleEvents = await ScheduleEventService.getStartEventByData(currentTime);
        return scheduleEvents;
    };

    runObserver = async () => {
        try {
            Log.info("running START cron");
            const {getScheduleData} = this;
            const scheduleEvents = await getScheduleData();
            let count = 0;
            if(scheduleEvents.length > 0) {

                for (const scheduleEvent of scheduleEvents) {
                    count++;
                    const event = await ScheduleEventWrapper(scheduleEvent);
                    switch (event.getEventType()) {
                        case EVENT_TYPE.VITALS:
                            await this.handleVitalStart(event);
                            break;
                        case EVENT_TYPE.MEDICATION_REMINDER:
                            // this.handleMedicationPrior(event);
                            break;
                        default:
                            break;
                    }
                }

            }
            Log.info(`START count : ${count} / ${scheduleEvents.length}`);
        } catch (error) {
            Log.debug("scheduleEvents 500 error ---->", error);
            // Log.errLog(500, "getPriorEvents", error.getMessage());
        }
    };

    handleVitalStart = async (event) => {
        try {
            const eventId = event.getEventId();

            const updateEventStatus = await ScheduleEventService.update({
                status: EVENT_STATUS.SCHEDULED
            }, event.getScheduleEventId());

            const job = JobSdk.execute({
                eventType: EVENT_TYPE.VITALS,
                eventStage: NOTIFICATION_STAGES.START,
                event
            });
            NotificationSdk.execute(job);
        } catch(error) {
            Log.debug("handleVitalStart 500 error ---->", error);
        }
    };
}

export default new StartCron();