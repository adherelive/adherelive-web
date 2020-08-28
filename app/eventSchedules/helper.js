import { RRule } from "rrule";
import Log from "../../libs/log";
import {FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY} from "../../constant";

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