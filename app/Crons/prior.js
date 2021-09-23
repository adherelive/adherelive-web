import Logger from "../../libs/log";
import moment from "moment";

import { EVENT_STATUS, EVENT_TYPE } from "../../constant";

// SERVICES ---------------
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS ---------------
import ScheduleEventWrapper from "../ApiWrapper/common/scheduleEvents";

import AppointmentJob from "../JobSdk/Appointments/observer";
import DietJob from "../JobSdk/Diet/observer";
import WorkoutJob from "../JobSdk/Workout/observer";

import * as CronHelper from "./helper";

import NotificationSdk from "../NotificationSdk";

const Log = new Logger("CRON > PRIOR");

class PriorCron {
  constructor() {
    this.scheduleEventService = new ScheduleEventService();
  }

  getScheduleData = async (priorDuration, type) => {
    // const scheduleEventService = new ScheduleEventService();
    const priorTime = moment()
      .add(priorDuration, "minutes")
      .utc()
      .toDate();
    Log.debug("priorTime ---> ", priorTime);
    Log.debug(
      "currentTime ---> ",
      moment()
        .utc()
        .toDate()
    );
    const scheduleEvents =
      (await this.scheduleEventService.getPriorEventByData(priorTime, type)) ||
      [];
    Log.debug("scheduleEvents ---> ", scheduleEvents);
    return scheduleEvents || [];
  };

  runObserver = async () => {
    try {
      // for event type : appointment
      const allPriorAppointmentEvents = await this.getScheduleData(
        process.config.app.appointment_prior_time,
        EVENT_TYPE.APPOINTMENT
      );

      for (const scheduleEvent of allPriorAppointmentEvents) {
        const event = await ScheduleEventWrapper(scheduleEvent);
        await this.handleAppointmentPrior(event);
      }

      // for event type : diet
      const allPriorDietEvents = await this.getScheduleData(
        process.config.app.diet_prior_time,
        EVENT_TYPE.DIET
      );

      if(allPriorDietEvents.length > 0) {
        for (const scheduleEvent of allPriorDietEvents) {
          const event = await ScheduleEventWrapper(scheduleEvent);
          return this.handleDietPrior(event.getAllInfo());
        }
      }

      // for event type : workout
      const allPriorWorkoutEvents = await this.getScheduleData(
        process.config.app.workout_prior_time,
        EVENT_TYPE.WORKOUT
      );

      if(allPriorWorkoutEvents.length > 0) {
        for (const scheduleEvent of allPriorWorkoutEvents) {
          const event = await ScheduleEventWrapper(scheduleEvent);
          return this.handleWorkoutPrior(event.getAllInfo());
        }
      }
    } catch (error) {
      Log.debug("prior runObserver catch error", error);
    }
  };

  handleAppointmentPrior = async (event) => {
    try {
      const { id, event_id, details } = event.getData() || {};
      // const data = {
      //     participants: event.getParticipants(),
      //     // actor: {
      //     //     id: "",
      //     //     details: {
      //     //         category: ""
      //     //     }
      //     // },
      //     id: event.getEventId()
      // }

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
        {
          status: EVENT_STATUS.PRIOR,
        },
        id
      );
    } catch (error) {
      throw error;
    }
  };

  handleDietPrior = async (event) => {
    try {
      const { id } = event || {};
      const dietJob = DietJob.execute(EVENT_STATUS.PRIOR, event);

      await NotificationSdk.execute(dietJob);

      await this.scheduleEventService.update(
        {
          status: EVENT_STATUS.PRIOR,
        },
        id
      );
    } catch (error) {
      throw error;
    }
  };

  handleWorkoutPrior = async (event) => {
    try {
      const { id } = event || {};
      const workoutJob = WorkoutJob.execute(EVENT_STATUS.PRIOR, event);

      await NotificationSdk.execute(workoutJob);

      await this.scheduleEventService.update(
        {
          status: EVENT_STATUS.PRIOR,
        },
        id
      );
    } catch (error) {
      throw error;
    }
  };
}

export default new PriorCron();
