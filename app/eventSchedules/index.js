import {
  AFTER_BREAKFAST,
  BEFORE_BREAKFAST,
  EVENT_STATUS,
  EVENT_TYPE,
  FEATURE_TYPE,
  MEDICATION_TIMING, REPEAT_INTERVAL
} from "../../constant";
import Log from "../../libs/log";
import { RRule } from "rrule";
import moment from "moment";

import * as eventHelper from "./helper";

import scheduleService from "../services/scheduleEvents/scheduleEvent.service";
import FeatureDetailService from "../services/featureDetails/featureDetails.service";
import FeatureDetailWrapper from "../ApiWrapper/web/featureDetails";

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
      case EVENT_TYPE.VITALS:
        await this.createVitalSchedule(data);
      default:
        Logger.debug("eventType --->", event_type);
    }
  };

  createVitalSchedule = async vital => {
    try {
      const {
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

      const vitalData = await FeatureDetailService.getDetailsByData({
        feature_type: FEATURE_TYPE.VITAL
      });

      const vitalDetails = await FeatureDetailWrapper(vitalData);
      const { repeat_intervals = {} } = vitalDetails.getFeatureDetails() || {};
      const { value, key } = repeat_intervals[repeat_interval_id] || {};

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
        byweekday: eventHelper.repeatDays(repeat_days)
      });

      // create schedule for the date
      const allDays = rrule.all();

      Logger.debug("allDays ----> ", allDays);

      if(key !== REPEAT_INTERVAL.ONCE) {
        for (let i = 0; i < allDays.length; i++) {
          const currentTime = moment(allDays[i]).utc().startOf('day').toISOString();
          const endTime = moment(allDays[i]).utc().endOf('day').toISOString();

          let ongoingTime = currentTime;
           while(moment(endTime).diff(ongoingTime, 'h') > 0) {
            const scheduleData = {
              event_id,
              critical,
              date: moment(allDays[i])
                  .utc()
                  .toISOString(),
              start_time: ongoingTime,
              end_time: ongoingTime,
              event_type: EVENT_TYPE.VITALS,
              details: {
                ...details,
                participants,
                actor,
                vital_templates,
                eventId: event_id
              }
            };

            const schedule = await scheduleService.create(scheduleData);
            if (schedule) {
              Logger.debug("schedule events created for vitals", true);
            } else {
              Logger.debug("schedule events failed for vitals", false);
            }

             ongoingTime = moment(ongoingTime).add(value, 'hours').toISOString();
           }
        }
      } else {

      }
    } catch (error) {
      Logger.debug("schedule events vitals 500 error", error);
    }
  };

  createAppointmentSchedule = async appointment => {
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

      Logger.debug("rrule ----> ", rrule.all());

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
      const {
        event_id,
        start_date,
        end_date,
        details,
        details: { when_to_take, repeat_days, critical = false } = {},
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
    switch (timing) {
      case BEFORE_BREAKFAST:
        return moment(date)
          .set("hours", 8)
          .set("minutes", 0);
      case AFTER_BREAKFAST:
        return moment(date)
          .set("hours", 9)
          .set("minutes", 0);
      default:
        return moment(date);
    }
  };
}

export default new EventSchedule();
