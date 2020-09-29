import Logger from "../../libs/log";
import moment from "moment";

import {EVENT_STATUS, EVENT_TYPE, FEATURE_TYPE, NOTIFICATION_STAGES} from "../../constant";

// SERVICES ---------------
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS ---------------
import ScheduleEventWrapper from "../ApiWrapper/common/scheduleEvents";

// import JobSdk from "../JobSdk";
// import NotificationSdk from "../NotificationSdk";
import FeatureDetailService from "../services/featureDetails/featureDetails.service";
import FeatureDetailWrapper from "../ApiWrapper/mobile/featureDetails";

const Log = new Logger("CRON > PASSED");
const scheduleEventService = new ScheduleEventService();

class PassedCron {
    constructor() {
    }

    getScheduleData = async () => {
        const scheduleEventService = new ScheduleEventService();

        const currentTime = moment().utc().toISOString();
        Log.info(`currentTime : ${currentTime}`);
        const scheduleEvents = await scheduleEventService.getPassedEventData(currentTime);
        return scheduleEvents;
    };

    runObserver = async () => {
        try {
            Log.info("running passed cron");
            const {getScheduleData} = this;
            const scheduleEvents = await getScheduleData();
            let count = 0;

            if(scheduleEvents.length > 0) {
                for (const scheduleEvent of scheduleEvents) {
                    count++;
                    const event = await ScheduleEventWrapper(scheduleEvent);

                    switch (event.getEventType()) {
                        case EVENT_TYPE.VITALS:
                            await this.handleVitalPassed(event);
                            break;
                        case EVENT_TYPE.MEDICATION_REMINDER:
                            await this.handleMedicationPassed(event);
                            break;
                        case EVENT_TYPE.APPOINTMENT:
                            await this.handleAppointmentPassed(event);
                            break;
                        default:
                            break;
                    }
                }


            }
            Log.info(`92313 count : ${count} / ${scheduleEvents.length}`);
        } catch (error) {
            Log.debug("scheduleEvents 500 error ---->", error);
        }
    };

    handleVitalPassed = async (event) => {
        try {
            const scheduleEventService = new ScheduleEventService();
            const currentTime = moment().utc().toDate();
            const eventId = event.getEventId();
            const {details: {repeat_interval_id: repeatIntervalId = ""} = {}} = event.getDetails();

            const vitalData = await FeatureDetailService.getDetailsByData({
                feature_type: FEATURE_TYPE.VITAL
            });

            const vital = await FeatureDetailWrapper(vitalData);
            const {repeat_intervals} = vital.getFeatureDetails();

            const {value = 0} = repeat_intervals[repeatIntervalId] || {};

            Log.info(`value: ${value} | difference -> ${moment(currentTime).diff(event.getStartTime(), 'hours')}`);

            if(moment(currentTime).diff(event.getStartTime(), 'hours') >= value) {
                const updateEventStatus = await scheduleEventService.update({
                    status: EVENT_STATUS.EXPIRED
                }, event.getScheduleEventId());
            }

        } catch(error) {
            Log.debug("handleVitalPassed 500 error ---->", error);
        }
    };

    handleMedicationPassed = async (event) => {
        try {
            const scheduleEventService = new ScheduleEventService();
            const currentTime = moment().utc().toDate();

            if(moment(currentTime).diff(event.getStartTime(), 'hours') >= 1) {
                const updateEventStatus = await scheduleEventService.update({
                    status: EVENT_STATUS.EXPIRED
                }, event.getScheduleEventId());
            }

        } catch(error) {
            Log.debug("handleMedicationPassed 500 error ---->", error);
        }
    };

    handleAppointmentPassed = async (event) => {
        try {
            const scheduleEventService = new ScheduleEventService();
            const currentTime = moment().utc().toDate();

            if(moment(currentTime).diff(event.getEndTime(), 'minutes') > 0) {
                const updateEventStatus = await scheduleEventService.update({
                    status: EVENT_STATUS.EXPIRED
                }, event.getScheduleEventId());
            }

        } catch(error) {
            Log.debug("handleMedicationPassed 500 error ---->", error);
        }
    };
}

export default new PassedCron();