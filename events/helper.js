import {
    EVENT_TYPE,
    FEATURE_TYPE,
    REPEAT_INTERVAL,
    WAKE_UP,
    SLEEP,
    BREAKFAST,
    LUNCH,
    EVENING,
    DINNER,
    BEFORE_BREAKFAST,
    AFTER_BREAKFAST,
    BEFORE_LUNCH,
    AFTER_LUNCH,
    BEFORE_EVENING_SNACK,
    AFTER_EVENING_SNACK,
    BEFORE_DINNER,
    AFTER_DINNER, BEFORE_SLEEP, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
} from "../constant";
import FeatureDetailWrapper from "../app/ApiWrapper/web/featureDetails";
import {RRule} from "rrule";
import moment from "moment";
import Logger from "../libs/log";


// SERVICES
import FeatureDetailService from "../app/services/featureDetails/featureDetails.service";
import ScheduleService from "../app/services/scheduleEvents/scheduleEvent.service";
import UserPreferenceService from "../app/services/userPreferences/userPreference.service";

// WRAPPERS


const Log = new Logger("EVENT > HELPER");

const scheduleService = new ScheduleService();

const getUserPreferences = async (user_id) => {
    try {
        const userPreference = await UserPreferenceService.getPreferenceByData({user_id});
        const {timings = {}} = userPreference.get("details") || {};
        return timings;
    } catch(error) {
        Log.debug("userPreferences catch error", error);
    }
};


export const handleAppointments = async (appointment) => {
    try {
        const {
            event_id,
            start_time,
            end_time,
            details,
            critical,
            participants,
            actor
        } = appointment || {};

        const rrule = new RRule({
            freq: RRule.WEEKLY,
            count: 1,
            dtstart: moment(start_time)
                .utc()
                .toDate()
        });

        Log.debug("rrule ----> ", rrule.all());



        // create schedule for the date
        const scheduleData = {
            event_id,
            critical,
            date: moment(start_time).toISOString(),
            start_time: moment(start_time).toISOString(),
            end_time: moment(end_time).toISOString(),
            event_type: EVENT_TYPE.APPOINTMENT,
            details: {
                ...details,
                participants,
                actor
            }
        };

        let response = false;
        const schedule = await scheduleService.create(scheduleData);
        if (schedule) {
            Log.debug("schedule events created for appointment", true);
            response = true;
        } else {
            Log.debug("schedule events failed for appointment", false);
        }

        return response;
    } catch (error) {
        Log.debug("schedule events appointment 500 error", error);
    }
};

export const handleMedications = async (medication) => {
    Log.debug("213971203 createMedicationSchedule -->", medication);
    try {
        const {
            patient_id,
            event_id,
            start_date,
            end_date,
            details,
            details: {when_to_take, repeat_days, critical = false } = {},
            participants = [],
            actors = {}
        } = medication || {};

        const rrule = new RRule({
            freq: RRule.WEEKLY,
            dtstart: moment(start_date)
                .utc()
                .toDate(),
            until: end_date
                ? moment(end_date)
                    .utc()
                    .toDate()
                : moment(start_date)
                    .add(1, "month")
                    .utc()
                    .toDate(),
            byweekday: repeatDays(repeat_days)
        });

        const allDays = rrule.all();

        const patientPreference = await getUserPreferences(patient_id);

        const scheduleEventArr = [];

        const scheduleEventArr = [];

        for (let i = 0; i < allDays.length; i++) {
            for (const timing of when_to_take) {
                const startTime = updateMedicationTiming(allDays[i], timing, patientPreference);

                scheduleEventArr.push({
                    event_id,
                    critical,
                    date: moment(allDays[i]).toISOString(),
                    start_time: moment(startTime).toISOString(),
                    end_time: moment(startTime).toISOString(),
                    event_type: EVENT_TYPE.MEDICATION_REMINDER,
                    details: {
                        ...details,
                        participants,
                        actors
                    }
                });
            }
        }

        const schedule = await scheduleService.bulkCreate(scheduleEventArr);
        let response = false;
        if (schedule) {
            Log.debug("schedule events created for appointment", true);
            response = true;
        } else {
            Log.debug("schedule events failed for appointment", false);
        }

        return response;
    } catch (error) {
        Log.debug("schedule events medication 500 error", error);
    }
};

export const handleVitals = async (vital) => {
    try {
        const {
            patient_id,
            event_id,
            start_date,
            end_date,
            details,
            details: {
                details: {
                    repeat_days,
                    repeat_interval_id,
                    critical = false,
                },
            } = {},
            participants = [],
            actor = {},
            vital_templates = {}
        } = vital || {};

        const timings = await getUserPreferences(patient_id);

        const vitalData = await FeatureDetailService.getDetailsByData({
            feature_type: FEATURE_TYPE.VITAL
        });

        const vitalDetails = await FeatureDetailWrapper(vitalData);
        const { repeat_intervals = {} } = vitalDetails.getFeatureDetails() || {};
        const { value, key } = repeat_intervals[repeat_interval_id] || {};

        const rrule = new RRule({
            freq: RRule.WEEKLY,
            dtstart: moment(start_date)
                .toDate(),
            until: end_date
                ? moment(end_date)
                    .toDate()
                : moment(start_date)
                    .add(1, "month")// TODO: drive from env
                    .toDate(),
            byweekday: repeatDays(repeat_days)
        });
        const allDays = rrule.all();

        const scheduleEventArr = [];

        const scheduleEventArr = [];

        if(key === REPEAT_INTERVAL.ONCE) {
            for (let i = 0; i < allDays.length; i++) {
                // **** TAKING WAKE UP TIME AS TIME FOR REPEAT INTERVAL = ONCE ****

                const {value: wakeUpTime} = timings[WAKE_UP];

                const hours = moment(wakeUpTime).utc().get('hours');
                const minutes = moment(wakeUpTime).utc().get('minutes');

                scheduleEventArr.push({
                        event_id,
                        critical,
                        date: moment(allDays[i])
                            .utc()
                            .toISOString(),
                        start_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).utc().toISOString(),
                        end_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).utc().toISOString(),
                        event_type: EVENT_TYPE.VITALS,
                        details: {
                            ...details,
                            participants,
                            actor,
                            vital_templates,
                            eventId: event_id
                        }
                    });
            }
        } else {
            for (let i = 0; i < allDays.length; i++) {
                const {value: wakeUpTime} = timings[WAKE_UP];
                const {value: sleepTime} = timings[SLEEP];

                const startHours = moment(wakeUpTime).get('hours');
                const startMinutes = moment(wakeUpTime).get('minutes');
                const startOfDay = moment(allDays[i]).set("hours", startHours).set("minutes", startMinutes).utc().toISOString();

                const endHours = moment(sleepTime).get('hours');
                const endMinutes = moment(sleepTime).get('minutes');
                const endOfDay = moment(allDays[i]).set("hours", endHours).set("minutes", endMinutes).utc().toISOString();

                let ongoingTime = startOfDay;


                while(moment(endOfDay).diff(moment(ongoingTime), "minutes") > 0) {
                    const hours = moment(ongoingTime).get("hours");
                    const minutes = moment(ongoingTime).get("minutes");
                    scheduleEventArr.push({
                        event_id,
                        critical,
                        date: moment(allDays[i])
                            .utc()
                            .toISOString(),
                        start_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).toISOString(),
                        end_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).toISOString(),
                        event_type: EVENT_TYPE.VITALS,
                        details: {
                            ...details,
                            participants,
                            actor,
                            vital_templates,
                            eventId: event_id
                        }
                    });
                    // const scheduleData = {
                    //     event_id,
                    //     critical,
                    //     date: moment(allDays[i])
                    //         .utc()
                    //         .toISOString(),
                    //     start_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).toISOString(),
                    //     end_time: moment(allDays[i]).set("hours", hours).set("minutes", minutes).toISOString(),
                    //     event_type: EVENT_TYPE.VITALS,
                    //     details: {
                    //         ...details,
                    //         participants,
                    //         actor,
                    //         vital_templates,
                    //         eventId: event_id
                    //     }
                    // };

                    ongoingTime = moment(ongoingTime).add(value, "hours")
                }
            }

        }

        let response = false;
        const schedule = await scheduleService.bulkCreate(scheduleEventArr);
        if (schedule) {
            Log.debug("schedule events created for vitals", true);
            response = true;
        } else {
            Log.debug("schedule events failed for vitals", false);
        }

        return response;
    } catch (error) {
        Log.debug("schedule events vitals 500 error", error);
    }
};

const getBreakfast = (timings) => {
    const {value} = timings[BREAKFAST] || {};
    const hours = moment(value).hours();
    const minutes = moment(value).minutes();
    return {hours, minutes};
};

const getLunch = (timings) => {
    const {value} = timings[LUNCH] || {};
    const hours = moment(value).hours();
    const minutes = moment(value).minutes();
    return {hours, minutes};
};

const getEvening = (timings) => {
    const {value} = timings[EVENING] || {};
    const hours = moment(value).hours();
    const minutes = moment(value).minutes();
    return {hours, minutes};
};

const getDinner = (timings) => {
    const {value} = timings[DINNER] || {};
    const hours = moment(value).hours();
    const minutes = moment(value).minutes();
    return {hours, minutes};
};

const getSleep = (timings) => {
    const {value} = timings[SLEEP] || {};
    const hours = moment(value).hours();
    const minutes = moment(value).minutes();
    return {hours, minutes};
};


const updateMedicationTiming = (date, timing, patientPreference) => {
    switch (timing) {
        case BEFORE_BREAKFAST:
            const {hours: bbh, minutes: bbm} = getBreakfast(patientPreference) || {};
            return moment(date)
                .set("hours", bbh)
                .set("minutes", bbm)
                .subtract(30, "minutes");
        case AFTER_BREAKFAST:
            const {hours: abh, minutes: abm} = getBreakfast(patientPreference) || {};
            return moment(date)
                .set("hours", abh)
                .set("minutes", abm)
                .add(30, "minutes");
        case BEFORE_LUNCH:
            const {hours: blh, minutes: blm} = getLunch(patientPreference) || {};
            return moment(date)
                .set("hours", blh)
                .set("minutes", blm)
                .subtract(30, "minutes");
        case AFTER_LUNCH:
            const {hours: alh, minutes: alm} = getLunch(patientPreference) || {};
            return moment(date)
                .set("hours", alh)
                .set("minutes", alm)
                .add(30, "minutes");
        case BEFORE_EVENING_SNACK:
            const {hours: beh, minutes: bem} = getEvening(patientPreference) || {};
            return moment(date)
                .set("hours", beh)
                .set("minutes", bem)
                .subtract(30, "minutes");
        case AFTER_EVENING_SNACK:
            const {hours: aeh, minutes: aem} = getEvening(patientPreference) || {};
            return moment(date)
                .set("hours", aeh)
                .set("minutes", aem)
                .add(30, "minutes");
        case BEFORE_DINNER:
            const {hours: bdh, minutes: bdm} = getDinner(patientPreference) || {};
            return moment(date)
                .set("hours", bdh)
                .set("minutes", bdm)
                .subtract(30, "minutes");
        case AFTER_DINNER:
            const {hours: adh, minutes: adm} = getDinner(patientPreference) || {};
            return moment(date)
                .set("hours", adh)
                .set("minutes", adm)
                .add(30, "minutes");
        case BEFORE_SLEEP:
            const {hours: bsh, minutes: bsm} = getSleep(patientPreference) || {};
            return moment(date)
                .set("hours", bsh)
                .set("minutes", bsm)
                .subtract(30, "minutes");
        default:
            return moment(date);
    }
};

const repeatDays = (days) => {
    let daysArr = [];
    Log.debug("repeatDays  ---> ", days);
    for(const day of days) {
        switch(day) {
            case MONDAY:
                daysArr.push(RRule.MO);
                break;
            case TUESDAY:
                daysArr.push(RRule.TU);
                break;
            case WEDNESDAY:
                daysArr.push(RRule.WE);
                break;
            case THURSDAY:
                daysArr.push(RRule.TH);
                break;
            case FRIDAY:
                daysArr.push(RRule.FR);
                break;
            case SATURDAY:
                daysArr.push(RRule.SA);
                break;
            case SUNDAY:
                daysArr.push(RRule.SU);
                break;
            default:
                Log.debug("day ----> ", day);
        }
    }

    return daysArr;
};