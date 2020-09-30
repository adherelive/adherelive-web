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

const scheduleEventService = new ScheduleEventService();

class StartCron {
    constructor() {
    }

    getScheduleData = async () => {
        const currentTime = moment().utc().toISOString();
        Log.info(`currentTime : ${currentTime}`);
        const scheduleEvents = await scheduleEventService.getStartEventByData(currentTime);
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
                            await this.handleMedicationStart(event);
                            break;
                        case EVENT_TYPE.APPOINTMENT:
                            await this.handleAppointmentStart(event);
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

            const updateEventStatus = await scheduleEventService.update({
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

    handleAppointmentStart = async (event) => {
        try {
            const eventId = event.getEventId();

            const updateEventStatus = await scheduleEventService.update({
                status: EVENT_STATUS.SCHEDULED
            }, event.getScheduleEventId());

            // const job = JobSdk.execute({
            //     eventType: EVENT_TYPE.APPOINTMENT,
            //     eventStage: NOTIFICATION_STAGES.START,
            //     event
            // });
            // NotificationSdk.execute(job);
        } catch(error) {
            Log.debug("handleVitalStart 500 error ---->", error);
        }
    };

    handleMedicationStart = async (event) => {
        try {
            const eventId = event.getEventId();

            const updateEventStatus = await scheduleEventService.update({
                status: EVENT_STATUS.SCHEDULED
            }, event.getScheduleEventId());

            // const job = JobSdk.execute({
            //     eventType: EVENT_TYPE.MEDICATION_REMINDER,
            //     eventStage: NOTIFICATION_STAGES.START,
            //     event
            // });
            // NotificationSdk.execute(job);
        } catch(error) {
            Log.debug("handleVitalStart 500 error ---->", error);
        }
    };
}

export default new StartCron();