import { createLogger } from "../../libs/log";
import moment from "moment";

import { EVENT_STATUS, EVENT_TYPE } from "../../constant";

// Services
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";

// Wrappers
import ScheduleEventWrapper from "../apiWrapper/common/scheduleEvents";

import AppointmentJob from "../jobSdk/Appointments/observer";
import DietJob from "../jobSdk/Diet/observer";
import WorkoutJob from "../jobSdk/Workout/observer";

import * as CronHelper from "./helper";

import NotificationSdk from "../notificationSdk";

const Log = createLogger("CRON-JOBS > PRIOR");

class PriorCron {
  // allPriorAppointmentEvents;
  constructor() {
    this.scheduleEventService = new ScheduleEventService();
  }

  async getScheduleData(priorDuration, type) {
    // const scheduleEventService = new ScheduleEventService();
    const priorTime = moment().add(priorDuration, "minutes").utc().toDate();
    Log.debug("cron getScheduleData priorTime ---> ", priorTime);
    Log.debug("getScheduleData currentTime ---> ", moment().utc().toDate());

    const scheduleEvents =
      (await this.scheduleEventService.getPriorEventByData(priorTime, type)) ||
      [];
    Log.debug("getScheduleData scheduleEvents ---> ", scheduleEvents);
    return scheduleEvents || [];
  }

  async runObserver() {
    try {
      // for event type : appointment
      await this.processEvents(
        process.config.app.appointment_prior_time,
        EVENT_TYPE.APPOINTMENT,
        this.handleAppointmentPrior
      );

      // for (const scheduleEvent of this.allPriorAppointmentEvents) {
      //   const event = await ScheduleEventWrapper(scheduleEvent);
      //   await this.handleAppointmentPrior(event);
      // }

      // for event type : diet
      await this.processEvents(
        process.config.app.diet_prior_time,
        EVENT_TYPE.DIET,
        this.handleDietPrior
      );

      await this.processEvents(
        process.config.app.workout_prior_time,
        EVENT_TYPE.WORKOUT,
        this.handleWorkoutPrior
      );
    } catch (error) {
      Log.debug("prior runObserver catch error", error);
    }
  }

  async processEvents(priorTime, eventType, handler) {
    const events = await this.getScheduleData(priorTime, eventType);

    for (const scheduleEvent of events) {
      const event = await ScheduleEventWrapper(scheduleEvent);
      await handler.call(this, event);
    }
  }

  async handleAppointmentPrior(event) {
    try {
      const { id, event_id, details } = event.getData() || {};

      const participants = await CronHelper.getNotificationUsers(
        EVENT_TYPE.APPOINTMENT,
        event_id
      );
      const appointmentJob = AppointmentJob.execute(EVENT_STATUS.PRIOR, {
        ...event.getData(),
        details: { ...details, participants },
      });

      await NotificationSdk.execute(appointmentJob);
      const updateEventStatus = await this.scheduleEventService.update(
        { status: EVENT_STATUS.PRIOR },
        id
      );
      // const updateEventStatus = await this.scheduleEventService.update({ status: EVENT_STATUS.PRIOR, }, id);
    } catch (error) {
      Log.debug("handleAppointmentPrior error", error);
    }
  }

  async handleDietPrior(event) {
    try {
      const { id } = event || {};
      const dietJob = DietJob.execute(EVENT_STATUS.PRIOR, event);

      await NotificationSdk.execute(dietJob);
      await this.scheduleEventService.update(
        { status: EVENT_STATUS.PRIOR },
        id
      );
    } catch (error) {
      Log.debug("handleDietPrior error", error);
    }
  }

  async handleWorkoutPrior(event) {
    try {
      const { id } = event || {};
      const workoutJob = WorkoutJob.execute(EVENT_STATUS.PRIOR, event);

      await NotificationSdk.execute(workoutJob);
      await this.scheduleEventService.update(
        { status: EVENT_STATUS.PRIOR },
        id
      );
    } catch (error) {
      Log.debug("handleWorkoutPrior error", error);
    }
  }
}

export default new PriorCron();
