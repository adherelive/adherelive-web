import Logger from "../../libs/log";
import moment from "moment";

import {EVENT_STATUS, EVENT_TYPE, NOTIFICATION_STAGES} from "../../constant";

// SERVICES ---------------
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS ---------------
import ScheduleEventWrapper from "../ApiWrapper/common/scheduleEvents";
import AppointmentWrapper from "../ApiWrapper/web/appointments";

import JobSdk from "../JobSdk";

import AppointmentJob from "../JobSdk/Appointments/observer";
import NotificationSdk from "../NotificationSdk";

const Log = new Logger("CRON > PRIOR");

class PriorCron {
    constructor() {
        this._data = this.getScheduleData();
    }

    getScheduleData = async () => {
        const currentTime = moment().add(10, 'minutes').utc().toDate();
        Log.debug("currentTime ---> ", currentTime);
        const scheduleEvents = await ScheduleEventService.getPriorEventByData(currentTime);
        Log.debug("scheduleEvents ---> ", scheduleEvents);
        return scheduleEvents;
    };

    getPriorEvents = async () => {
        try {
            const {_data} = this;
            for (const scheduleEvent of _data) {
                const event = await ScheduleEventWrapper(scheduleEvent);
                switch (event.getEventType()) {
                    case EVENT_TYPE.APPOINTMENT:
                        return this.handleAppointmentPrior(event);
                    case EVENT_TYPE.MEDICATION_REMINDER:
                        // this.handleMedicationPrior(event);
                        break;
                    default:
                        break;
                }
            }
            Log.debug("scheduleEvents ---->", _data);
        } catch (error) {
            Log.errLog(500, "getPriorEvents", error.getMessage());
        }
    };

    handleAppointmentPrior = async (event) => {
        try {
            const data = {
                participants: event.getParticipants(),
                actor: {
                    id: "",
                    details: {
                        category: ""
                    }
                },
                appointmentId: event.getEventId()
            }
            const job = JobSdk.execute({
                eventType: EVENT_TYPE.APPOINTMENT,
                eventStage: NOTIFICATION_STAGES.PRIOR,
                event
            });
            await NotificationSdk.execute(job);
        } catch(error) {
            throw error;
        }
    };


}

export default new PriorCron();