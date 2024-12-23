import Logger from "../../libs/log";
import moment from "moment";

import { EVENT_STATUS, EVENT_TYPE, FEATURE_TYPE } from "../../constant";

// SERVICES ---------------
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";
import FeatureDetailService from "../services/featureDetails/featureDetails.service";

// WRAPPERS ---------------
import ScheduleEventWrapper from "../apiWrapper/common/scheduleEvents";
import FeatureDetailWrapper from "../apiWrapper/mobile/featureDetails";

const Log = new Logger("CRON > PASSED");

class PassedCron {
  constructor() {
    this.RESCHEDULE_INTERVAL = 10;
    this.RESCHEDULE_DURATION = 30;
  }

  getScheduleData = async () => {
    const scheduleEventService = new ScheduleEventService();

    const currentTime = moment().utc().toISOString();
    Log.info(`currentTime : ${currentTime}`);
    const scheduleEvents = await scheduleEventService.getPassedEventData(
      currentTime
    );
    return scheduleEvents;
  };

  runObserver = async () => {
    try {
      Log.info("running passed cron");
      const { getScheduleData } = this;
      const scheduleEvents = await getScheduleData();
      let count = 0;

      if (scheduleEvents.length > 0) {
        for (const scheduleEvent of scheduleEvents) {
          count++;
          const event = await ScheduleEventWrapper(scheduleEvent);

          switch (event.getEventType()) {
            case EVENT_TYPE.VITALS:
              await this.handleVitalPassed(event);
              break;
            case EVENT_TYPE.MEDICATION_REMINDER:
              await this.handleMedicationPassed(event);
              break;
            case EVENT_TYPE.APPOINTMENT:
              await this.handleAppointmentPassed(event);
              break;
            case EVENT_TYPE.CARE_PLAN_ACTIVATION:
              await this.handleCarePlanPassed(event);
              break;
            case EVENT_TYPE.DIET:
              await this.handleDietPassed(event);
              break;
            case EVENT_TYPE.WORKOUT:
              await this.handleWorkoutPassed(event);
              break;
            default:
              break;
          }
        }
      }
      Log.info(`92313 count : ${count} / ${scheduleEvents.length}`);
    } catch (error) {
      Log.debug("scheduleEvents 500 error --->", error);
    }
  };

  handleDietPassed = async (event) => {
    try {
      const scheduleEventService = new ScheduleEventService();
      const currentTime = moment().utc().toDate();

      if (
        moment(currentTime).diff(event.getStartTime(), "minutes") >=
        this.RESCHEDULE_DURATION
      ) {
        await scheduleEventService.update(
          {
            status: EVENT_STATUS.EXPIRED,
          },
          event.getScheduleEventId()
        );
      }
    } catch (error) {
      Log.debug("handleDietPassed 500 error --->", error);
    }
  };

  handleWorkoutPassed = async (event) => {
    try {
      const scheduleEventService = new ScheduleEventService();
      const currentTime = moment().utc().toDate();

      if (
        moment(currentTime).diff(event.getStartTime(), "minutes") >=
        this.RESCHEDULE_DURATION
      ) {
        await scheduleEventService.update(
          {
            status: EVENT_STATUS.EXPIRED,
          },
          event.getScheduleEventId()
        );
      }
    } catch (error) {
      Log.debug("handleWorkoutPassed 500 error --->", error);
    }
  };

  handleVitalPassed = async (event) => {
    try {
      const scheduleEventService = new ScheduleEventService();
      const currentTime = moment().utc().toDate();
      const eventId = event.getEventId();
      const { details: { repeat_interval_id: repeatIntervalId = "" } = {} } =
        event.getDetails();

      const vitalData = await FeatureDetailService.getDetailsByData({
        feature_type: FEATURE_TYPE.VITAL,
      });

      const vital = await FeatureDetailWrapper(vitalData);
      const { repeat_intervals } = vital.getFeatureDetails();

      const { value = 0 } = repeat_intervals[repeatIntervalId] || {};

      Log.info(
        `value: ${value} | difference -> ${moment(currentTime).diff(
          event.getStartTime(),
          "hours"
        )}`
      );

      if (moment(currentTime).diff(event.getStartTime(), "hours") >= value) {
        const updateEventStatus = await scheduleEventService.update(
          {
            status: EVENT_STATUS.EXPIRED,
          },
          event.getScheduleEventId()
        );
      }
    } catch (error) {
      Log.debug("handleVitalPassed 500 error --->", error);
    }
  };

  handleMedicationPassed = async (event) => {
    try {
      const scheduleEventService = new ScheduleEventService();
      const currentTime = moment().utc().toDate();

      console.log("handleMedicationPassed ", {
        condition:
          moment(currentTime).diff(event.updatedAt(), "minutes") ===
          this.RESCHEDULE_INTERVAL,
        currentTime,
        eventTime: event.updatedAt(),
        diff: moment(currentTime).diff(event.updatedAt(), "minutes"),
        type_diff: typeof moment(currentTime).diff(
          event.updatedAt(),
          "minutes"
        ),
        type_INTERVAL: typeof this.RESCHEDULE_INTERVAL,
      });

      const diff = moment(currentTime).diff(event.updatedAt(), "minutes");

      if (diff === this.RESCHEDULE_INTERVAL) {
        const updateEventStatus = await scheduleEventService.update(
          {
            status: EVENT_STATUS.PENDING,
          },
          event.getScheduleEventId()
        );
      }

      console.log("expired diff", {
        count: moment(currentTime).diff(event.getStartTime(), "minutes"),
        condition:
          moment(currentTime).diff(event.getStartTime(), "minutes") >
          this.RESCHEDULE_DURATION,
      });

      if (
        moment(currentTime).diff(event.getStartTime(), "minutes") >
        this.RESCHEDULE_DURATION
      ) {
        const updateEventStatus = await scheduleEventService.update(
          {
            status: EVENT_STATUS.EXPIRED,
          },
          event.getScheduleEventId()
        );
      }
    } catch (error) {
      Log.debug("handleMedicationPassed 500 error ---> ", error);
    }
  };

  handleAppointmentPassed = async (event) => {
    try {
      const scheduleEventService = new ScheduleEventService();
      const currentTime = moment().utc().toDate();

      if (
        moment(currentTime).diff(event.getEndTime(), "hours") >
        process.config.app.appointment_wait_time_hours
      ) {
        const updateEventStatus = await scheduleEventService.update(
          {
            status: EVENT_STATUS.EXPIRED,
          },
          event.getScheduleEventId()
        );
      }
    } catch (error) {
      Log.debug("handleMedicationPassed 500 error ---> ", error);
    }
  };

  handleCarePlanPassed = async (event) => {
    try {
      const scheduleEventService = new ScheduleEventService();
      const currentTime = moment().utc().toDate();

      const carePlanStartTime = new moment.utc();
      const carePlanEndTime = new moment.utc(carePlanStartTime).add(2, "hours");

      if (
        moment(currentTime).diff(event.getStartTime(), "hours") >=
        process.config.app.carePlan_activation_reschedule_hours
      ) {
        const updateEventStatus = await scheduleEventService.update(
          {
            status: EVENT_STATUS.PENDING,
            start_time: carePlanStartTime,
            end_time: carePlanEndTime,
          },
          event.getScheduleEventId()
        );
      }
    } catch (error) {
      Log.debug("handleCarePlanPassed 500 error ---> ", error);
    }
  };
}

export default new PassedCron();
