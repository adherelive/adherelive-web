import {
  AFTER_BREAKFAST, AFTER_DINNER, AFTER_EVENING_SNACK, AFTER_LUNCH,
  BEFORE_BREAKFAST, BEFORE_DINNER, BEFORE_EVENING_SNACK, BEFORE_LUNCH, BEFORE_SLEEP,
  EVENT_STATUS,
  EVENT_TYPE,
  FEATURE_TYPE,
  MEDICATION_TIMING, NOON, REPEAT_INTERVAL, SLEEP, WAKE_UP
} from "../../constant";
import Log from "../../libs/log";
import { RRule } from "rrule";
import moment from "moment";

import * as eventHelper from "./helper";

import scheduleService from "../services/scheduleEvents/scheduleEvent.service";

import FeatureDetailService from "../services/featureDetails/featureDetails.service";
import FeatureDetailWrapper from "../ApiWrapper/web/featureDetails";
import UserPreferenceService from "../services/userPreferences/userPreference.service";

const Logger = new Log("EVENT SCHEDULE CREATOR");

class EventSchedule {
  create = async (data = {}) => {
    const { type } = data || {};
    switch (type) {
      case EVENT_TYPE.APPOINTMENT:
        await this.createAppointmentSchedule(data);
        break;
      case EVENT_TYPE.MEDICATION_REMINDER:
        await this.createMedicationSchedule(data);
        break;
      case EVENT_TYPE.VITALS:
        await this.createVitalSchedule(data);
      default:
        Logger.debug("eventType --->", type);
    }
  };

  getUserPreferences = async (user_id) => {
    try {
      const userPreference = await UserPreferenceService.getPreferenceByData({user_id});
      const {timings = {}} = userPreference.get("details") || {};
      return timings;
    } catch(error) {
      Logger.debug("userPreferences catch error", error);
    }
  };

  createVitalSchedule = async vital => {
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

      const timings = await this.getUserPreferences(patient_id);

      Logger.debug("start_date 8318293 ", moment(start_date)
          .toDate());

      const vitalData = await FeatureDetailService.getDetailsByData({
        feature_type: FEATURE_TYPE.VITAL
      });

      const vitalDetails = await FeatureDetailWrapper(vitalData);
      const { repeat_intervals = {} } = vitalDetails.getFeatureDetails() || {};
      const { value, key } = repeat_intervals[repeat_interval_id] || {};

      const rrule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: moment(start_date).toDate(),
        until: end_date
            ? moment(end_date)
                .toDate()
            : moment(start_date)
                .add(1, "month")// TODO: drive from env
                .toDate(),
        byweekday: eventHelper.repeatDays(repeat_days)
      });
      const allDays = rrule.all();

      Logger.debug("allDays ----> ", allDays);

      if(key === REPEAT_INTERVAL.ONCE) {
        for (let i = 0; i < allDays.length; i++) {
          // **** TAKING WAKE UP TIME AS TIME FOR REPEAT INTERVAL = ONCE ****

          const {value: wakeUpTime} = timings[WAKE_UP];

          const hours = moment(wakeUpTime).utc().get('hours');
          const minutes = moment(wakeUpTime).utc().get('minutes');

          const scheduleData = {
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
          };

          const schedule = await scheduleService.create(scheduleData);
          if (schedule) {
            Logger.debug("schedule events created for vitals", true);
          } else {
            Logger.debug("schedule events failed for vitals", false);
          }
        }
      } else {
        for (let i = 0; i < allDays.length; i++) {
          Logger.info(`moment(allDays[i]) : ${moment(allDays[i]).format()}`);
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
            const scheduleData = {
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
            };

            const schedule = await scheduleService.create(scheduleData);
            if (schedule) {
              Logger.debug("schedule events created for vitals", true);
            } else {
              Logger.debug("schedule events failed for vitals", false);
            }

            ongoingTime = moment(ongoingTime).add(value, "hours")
          }
        }
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
    Logger.debug("213971203 createMedicationSchedule -->", medication);
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
        byweekday: eventHelper.repeatDays(repeat_days)
      });

      const allDays = rrule.all();

      const patientPreference = await this.getUserPreferences(patient_id);

      Logger.debug("when_to_take ---> ", when_to_take);

      for (let i = 0; i < allDays.length; i++) {
        for (const timing of when_to_take) {
          const startTime = eventHelper.updateMedicationTiming(allDays[i], timing, patientPreference);

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
}

export default new EventSchedule();
