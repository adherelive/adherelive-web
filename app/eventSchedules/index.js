import {EVENT_TYPE} from "../../constant";
import Log from "../../libs/log";
import {RRule} from "rrule";
import moment from "moment";

const Logger = new Log("EVENT SCHEDULE CREATOR");


class EventSchedule {

    create = (data = {}) => {
        const {eventType} = data || {};
        switch(eventType) {
            case EVENT_TYPE.APPOINTMENT:
                this.createAppointmentSchedule(data);
                break;
            case EVENT_TYPE.MEDICATION_REMINDER:
                this.createMedicationSchedule(data);
                break;
            default:
                Logger.debug("eventType --->", eventType);
        }
    };

    createAppointmentSchedule = (appointment) => {
        const {start_time, end_time} = appointment || {};

        const rrule = new RRule({
            freq: RRule.WEEKLY,
            count: 1, // change after repeat type has been added or when necessary
            dtstart: moment(start_time).utc().toDate(),
        });

        Logger.debug("rrule ----> ", rrule.all());
    };

    createMedicationSchedule = (medication) => {

    };
}

export default new EventSchedule();