import Logger from "../../../libs/log";
import {NOTIFICATION_VERB, EVENT_TYPE, NOTIFICATION_STAGES} from "../../../constant";

// lodash
import isEmpty from "lodash/isEmpty";

// SERVICES -------->
import AppointmentService from "../../services/appointment/appointment.service";
// import MedicationService from "../../services/medicationReminder/mReminder.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";

// API WRAPPERS -------->
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import MedicationWrapper from "../../ApiWrapper/web/medicationReminder";
// import ScheduleEventWrapper from "../../ApiWrapper/web/scheduleEvents";
import UserWrapper from "../../ApiWrapper/web/user";

const {
    APPOINTMENT_CREATE,
    MEDICATION_CREATE
} = NOTIFICATION_VERB;

const {APPOINTMENT, MEDICATION_REMINDER} = EVENT_TYPE;

const Log = new Logger("WEB > NOTIFICATION > CONTROLLER > HELPER");

const medicationNotification = async (data) => {
    try {
        const {
            data: {
                actor,
                foreign_id,
                id,
                object,
                time,
                verb,
                prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
                current: { startDate: currentStartDate, endDate: currentEndDate } = {},
                startTime: notification_startTime
            } = {},
            loggedInUser,
            is_read
        } = data;

        let eventData = {};
        let medicineData = {};
        let participants = [];

        if(verb === MEDICATION_CREATE) {
            const event = await MedicationWrapper(null, foreign_id);
            const {medications, medicines} = await event.getReferenceInfo();
            eventData = {...eventData, ...medications};
            medicineData = {...medicineData, medicines};
            participants = event.getParticipants();
        } else {
            const events = await ScheduleEventService.getEventByData({id: foreign_id});
            const event = await ScheduleEventWrapper(events);
            eventData = event.getData();
            participants = event.getParticipants();
        }

        if (eventData && eventData === null) {
            eventData = {};
        }
        let requiredActor = actor;

        if (!isEmpty(eventData)) {
            const {participant_id, organizer_id} = participants || {};
            if (actor !== participant_id && actor !== organizer_id) {
                requiredActor =
                    loggedInUser === participant_id
                        ? organizer_id
                        : participant_id;
            }
        }

        let notification_data = {};
        let userData = [];

        switch(verb) {
            case MEDICATION_CREATE:
                notification_data = {
                    [`${id}`]: {
                        is_read,
                        foreign_id,
                        time,
                        notification_id: id,
                        type: MEDICATION_REMINDER,
                        stage: NOTIFICATION_STAGES.CREATE,
                        actor: requiredActor,
                    }
                };

                for(const id of Object.keys(participants)) {
                    const user = await UserWrapper(null, participants[id]);
                    userData.push(await user.getReferenceInfo());
                }

                return {
                    notifications: notification_data,
                    medications: eventData,
                    medicines: medicineData,
                    ...userData
                }
        }
    } catch(error) {
        Log.debug("medicationNotification 500 error", error);
        return {};
    }
};

const appointmentNotification = async (data) => {
    try {
        const {
            data: {
                actor,
                foreign_id,
                id,
                object,
                time,
                verb,
                prev: { startDate: prevStartDate, endDate: prevEndDate } = {},
                current: { startDate: currentStartDate, endDate: currentEndDate } = {},
                startTime: notification_startTime
            } = {},
            loggedInUser,
            is_read
        } = data;

        let eventData = {};
        let participants = [];

        if(verb === APPOINTMENT_CREATE) {
            const events = await AppointmentService.getAppointmentById(foreign_id);
            const event = await AppointmentWrapper(events);
            eventData = event.getBasicInfo();
            participants = event.getParticipants();
        } else {
            const events = await ScheduleEventService.getEventByData({id: foreign_id});
            const event = await ScheduleEventWrapper(events);
            eventData = event.getData();
            participants = event.getParticipants();
        }

        if (eventData && eventData === null) {
            eventData = {};
        }
        let requiredActor = actor;

        if (!isEmpty(eventData)) {
            const {participant_one_id, participant_two_id} = participants || {};
            if (actor !== participant_one_id && actor !== participant_two_id) {
                requiredActor =
                    loggedInUser === participant_one_id
                        ? participant_two_id
                        : participant_one_id;
            }
        }

        let notification_data = {};
        let userData = [];

        switch(verb) {
            case APPOINTMENT_CREATE:
                notification_data = {
                    [`${id}`]: {
                        is_read,
                        foreign_id,
                        time,
                        notification_id: id,
                        type: APPOINTMENT,
                        stage: NOTIFICATION_STAGES.CREATE,
                        actor: requiredActor,
                    }
                };

                for(const id of Object.keys(participants)) {
                    const user = await UserWrapper(null, participants[id]);
                    userData.push(await user.getReferenceInfo());
                }
                return {
                    notifications: notification_data,
                    appointments: { [foreign_id]: eventData },
                    ...userData
                };
        }
    } catch(error) {
        Log.debug("appointmentNotification 500 error", error);
        return {};
    }
};

export const getDataForNotification = async (data) => {
    try {
        const {
            data: {
                event,
            } = {},
        } = data;

        switch(event) {
            case APPOINTMENT:
                return await appointmentNotification(data);
            case MEDICATION_REMINDER:
                return await medicationNotification(data);
        }

    } catch(error) {
        Log.debug("getDataForNotification 500 error", error);
    }
};