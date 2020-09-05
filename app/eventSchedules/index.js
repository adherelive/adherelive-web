import {AFTER_BREAKFAST, BEFORE_BREAKFAST, EVENT_STATUS, EVENT_TYPE, MEDICATION_TIMING} from "../../constant";
import Log from "../../libs/log";
import {RRule} from "rrule";
import moment from "moment";

import * as eventHelper from "./helper";

import scheduleService from "../services/scheduleEvents/scheduleEvent.service";

const Logger = new Log("EVENT SCHEDULE CREATOR");

class EventSchedule {
  create = async (data = {}) => {
    const { event_type } = data || {};
    Logger.debug("data -----> ===== -----> ", data);
    switch (event_type) {
      case EVENT_TYPE.APPOINTMENT:
        await this.createAppointmentSchedule(data);
        break;
      case EVENT_TYPE.MEDICATION_REMINDER:
        await this.createMedicationSchedule(data);
        break;
      default:
        Logger.debug("eventType --->", event_type);
    }
  };

  createAppointmentSchedule = async appointment => {
    try {
      const { event_id, start_time, end_time, details, participant_one, participant_two, critical } = appointment || {};

      const rrule = new RRule({
        freq: RRule.WEEKLY,
        count: 1,
        dtstart: moment(start_time)
          .utc()
          .toDate()
      });

      Logger.debug("rrule ----> ", rrule.all());

      // create schedule for the date
      const scheduleData = {
        event_id,
          critical,
        date: moment(start_time).toISOString(),
        start_time: moment(start_time).toISOString(),
        end_time: moment(end_time).toISOString(),
        event_type: EVENT_TYPE.APPOINTMENT,
          participant_one,
          participant_two,
        details
      };

      const schedule = await scheduleService.create(scheduleData);
      if (schedule) {
        Logger.debug("schedule events created for appointment", true);
      } else {
        Logger.debug("schedule events failed for appointment", false);
      }
    } catch (error) {
      Logger.debug("schedule events appointment 500 error", error);
    }
  };

  createMedicationSchedule = async medication => {
    try {
      const { event_id, start_date, end_date, details, details: {when_to_take, repeat_days} = {}, participant_one, participant_two } =
        medication || {};

      const rrule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: moment(start_date)
          .utc()
          .toDate(),
        until: end_date ? moment(end_date)
          .utc()
          .toDate() : moment(start_date).add(5,"y").utc().toDate(),
          byweekday: eventHelper.repeatDays(repeat_days)
      });

      Logger.debug("rrule ----> ", rrule.all());

      let scheduleData = {};

      const allDays = rrule.all();

      Logger.debug("allDays ----> ", allDays);

      for (let i = 0; i < allDays.length; i++) {
        for (const timing of when_to_take) {
            const startTime = this.updateMedicationTiming(allDays[i], timing);

            const scheduleData = {
                event_id,
                date: moment(allDays[i]).toISOString(),
                start_time: moment(startTime).toISOString(),
                end_time: moment(startTime).toISOString(),
                event_type: EVENT_TYPE.MEDICATION_REMINDER,
                status: EVENT_STATUS.SCHEDULED,
                details,
                participant_one,
                participant_two
            };

            const schedule = await scheduleService.create(scheduleData);
            if (schedule) {
                Logger.debug("schedule events created for appointment", true);
            } else {
                Logger.debug("schedule events failed for appointment", false);
            }
        }
      }
    } catch (error) {
      Logger.debug("schedule events medication 500 error", error);
    }
  };

    updateMedicationTiming = (date, timing) => {
        switch(timing) {
            case BEFORE_BREAKFAST:
                return moment(date).set("hours",8).set("minutes", 0);
            case AFTER_BREAKFAST:
                return moment(date).set("hours",9).set("minutes", 0);
            default:
                return moment(date);
        }
    };
}

export default new EventSchedule();
