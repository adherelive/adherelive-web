import Logger from "../../libs/log";
import moment from "moment";

import {EVENT_STATUS, EVENT_TYPE, NOTIFICATION_STAGES} from "../../constant";

// SERVICES ---------------
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS ---------------
import ScheduleEventWrapper from "../ApiWrapper/common/scheduleEvents";

import AppointmentJob from "../JobSdk/Appointments/observer";
import NotificationSdk from "../NotificationSdk";

const Log = new Logger("CRON > PRIOR");

class PriorCron {
    constructor() {
        this.scheduleEventService = new ScheduleEventService();
    }

    getScheduleData = async () => {
        // const scheduleEventService = new ScheduleEventService();
        const priorTime = moment().add(process.config.app.appointment_prior_time, 'minutes').utc().toDate();
        Log.debug("priorTime ---> ", priorTime);
        Log.debug("currentTime ---> ", moment().utc().toDate());
        const scheduleEvents = await this.scheduleEventService.getPriorEventByData(priorTime) || [];
        Log.debug("scheduleEvents ---> ", scheduleEvents);
        return scheduleEvents;
    };

    runObserver = async () => {
        try {
            const allPriorEvents = await this.getScheduleData();

            for (const scheduleEvent of allPriorEvents) {
                const event = await ScheduleEventWrapper(scheduleEvent);
                switch (event.getEventType()) {
                    case EVENT_TYPE.APPOINTMENT:
                        return this.handleAppointmentPrior(event.getAllInfo());
                    case EVENT_TYPE.MEDICATION_REMINDER:
                        // this.handleMedicationPrior(event);
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            Log.debug("prior runObserver catch error", error);
        }
    };

    handleAppointmentPrior = async (event) => {
        try {
            const {id} = event || {};
            // const data = {
            //     participants: event.getParticipants(),
            //     // actor: {
            //     //     id: "",
            //     //     details: {
            //     //         category: ""
            //     //     }
            //     // },
            //     id: event.getEventId()
            // }
            const appointmentJob = AppointmentJob.execute(
                EVENT_STATUS.PRIOR,
                event
              );

              await NotificationSdk.execute(appointmentJob);

              const updateEventStatus = await this.scheduleEventService.update(
                {
                  status: EVENT_STATUS.PRIOR
                },
                id
              );
        } catch(error) {
            throw error;
        }
    };


}

export default new PriorCron();