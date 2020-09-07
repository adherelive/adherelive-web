import Logger from "../../libs/log";
import moment from "moment";

import {EVENT_STATUS, EVENT_TYPE} from "../../constant";

// SERVICES ---------------
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS ---------------
import ScheduleEventWrapper from "../ApiWrapper/common/scheduleEvents";

import AppointmentJob from "../JobSdk/Appointments/observer";

const Log = new Logger("CRON > PRIOR");

class PriorCron {
    getPriorEvents = async () => {
        try {
            const currentTime = moment().add(10, 'minutes').utc().toDate();
            Log.debug("currentTime ---> ", currentTime);
            const scheduleEvents = await ScheduleEventService.getPriorEventByData(currentTime);

            for (const scheduleEvent of scheduleEvents) {
                const event = await ScheduleEventWrapper(scheduleEvent);
                switch (event.getEventType()) {
                    case EVENT_TYPE.APPOINTMENT:
                        this.handleAppointmentPrior(event);
                        break;
                    case EVENT_TYPE.MEDICATION_REMINDER:
                        this.handleMedicationPrior(event);
                        break;
                    default:
                        break;
                }
            }
            Log.debug("scheduleEvents ---->", scheduleEvents);
        } catch (error) {
            Log.errLog(500, "getPriorEvents", error.getMessage());
        }
    };

    handleAppointmentPrior = (event) => {
        const job = AppointmentJob.execute(EVENT_STATUS.PRIOR, event);
    };


}

export default new PriorCron();