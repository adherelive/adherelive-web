import { RRule } from "rrule";
import Log from "../../libs/log";
import {
    AFTER_BREAKFAST, AFTER_DINNER, AFTER_EVENING_SNACK, AFTER_LUNCH,
    BEFORE_BREAKFAST, BEFORE_DINNER, BEFORE_EVENING_SNACK, BEFORE_LUNCH, BEFORE_SLEEP,
    BREAKFAST, DINNER,
    EVENING,
    FRIDAY,
    LUNCH,
    MONDAY,
    SATURDAY, SLEEP,
    SUNDAY,
    THURSDAY,
    TUESDAY,
    WEDNESDAY
} from "../../constant";
import moment from "moment";

const Logger = new Log("EVENT SCHEDULE HELPER");

export const repeatDays = (days) => {
    let daysArr = [];
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
                Logger.debug("day ----> ", day);
        }
    }

    return daysArr;
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


export const updateMedicationTiming = (date, timing, patientPreference) => {
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