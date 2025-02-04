import { createLogger } from "../../libs/logger";
import moment from "moment";

import { EVENT_STATUS, EVENT_TYPE, NOTIFICATION_STAGES } from "../../constant";

// Services
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";
import medicationService from "../services/medicationReminder/mReminder.service";
import DietService from "../services/diet/diet.service";
import WorkoutService from "../services/workouts/workout.service";

// Wrappers
import ScheduleEventWrapper from "../apiWrapper/common/scheduleEvents";

import * as CronHelper from "./helper";

import JobSdk from "../jobSdk";
import NotificationSdk from "../notificationSdk";
import AppointmentJob from "../jobSdk/Appointments/observer";
import MedicationJob from "../jobSdk/Medications/observer";
import CarePlanJob from "../jobSdk/CarePlan/observer";
import DietJob from "../jobSdk/Diet/observer";
import WorkoutJob from "../jobSdk/Workout/observer";

const logger = createLogger("CRON > START");

class StartCron {
  getScheduleData = async () => {
    const scheduleEventService = new ScheduleEventService();
    const currentTime = moment().utc().toISOString();
    logger.debug(`currentTime : ${currentTime}`);
    const scheduleEvents = await scheduleEventService.getStartEventByData(
      currentTime
    );
    return scheduleEvents;
  };
  // TODO: running cron job on event table that have more then 17gb data and its make application slow and also logs unreadble.
  runObserver = async () => {
    try {
      logger.debug("running START cron");
      const { getScheduleData } = this;
      const scheduleEvents = await getScheduleData();

      let count = 0;
      if (scheduleEvents.length > 0) {
        for (const scheduleEvent of scheduleEvents) {
          count++;
          const event = await ScheduleEventWrapper(scheduleEvent);
          switch (event.getEventType()) {
            case EVENT_TYPE.VITALS:
              await this.handleVitalStart(event);
              break;
            case EVENT_TYPE.MEDICATION_REMINDER:
              await this.handleMedicationStart(event);
              break;
            case EVENT_TYPE.APPOINTMENT:
              await this.handleAppointmentStart(event);
              break;
            case EVENT_TYPE.CARE_PLAN_ACTIVATION:
              await this.handleCarePlanStart(event);
              break;
            case EVENT_TYPE.DIET:
              await this.handleDietStart(event);
              break;
            case EVENT_TYPE.WORKOUT:
              await this.handleWorkoutStart(event);
              break;
            default:
              break;
          }
        }
      }
      logger.debug(`START count : ${count} / ${scheduleEvents.length}`);
    } catch (error) {
      logger.error("scheduleEvents 500 error ---> ", error);
    }
  };

  handleVitalStart = async (event) => {
    try {
      const eventId = event.getEventId();
      const scheduleEventService = new ScheduleEventService();
      const scheduleEventId = event.getScheduleEventId();
      const updateEventStatus = await scheduleEventService.update(
        {
          status: EVENT_STATUS.SCHEDULED,
        },
        scheduleEventId
      );

      const { details } = event.getData();

      const participants = await CronHelper.getNotificationUsers(
        EVENT_TYPE.VITALS,
        eventId
      );

      const job = JobSdk.execute({
        eventType: EVENT_TYPE.VITALS,
        eventStage: NOTIFICATION_STAGES.START,
        event: {
          ...event.getData(),
          details: { ...details, participants },
        },
      });
      NotificationSdk.execute(job);
    } catch (error) {
      logger.error("handleVitalStart 500 error ---> ", error);
    }
  };

  handleAppointmentStart = async (event) => {
    try {
      const eventId = event.getEventId();
      const scheduleEventId = event.getScheduleEventId();
      const scheduleEventService = new ScheduleEventService();
      const updateEventStatus = await scheduleEventService.update(
        {
          status: EVENT_STATUS.SCHEDULED,
        },
        scheduleEventId
      );

      const participants = await CronHelper.getNotificationUsers(
        EVENT_TYPE.APPOINTMENT,
        eventId
      );

      const { details } = event.getData() || {};
      const appointmentJob = AppointmentJob.execute(EVENT_STATUS.STARTED, {
        ...event.getData(),
        details: { ...details, participants },
      });
      await NotificationSdk.execute(appointmentJob);

      // const job = jobSdk.execute({
      //     eventType: EVENT_TYPE.APPOINTMENT,
      //     eventStage: NOTIFICATION_STAGES.START,
      //     event
      // });
      // notificationSdk.execute(job);
    } catch (error) {
      logger.error("handleAppointmentStart 500 error ---> ", error);
    }
  };

  handleMedicationStart = async (event) => {
    try {
      const eventId = event.getEventId();
      const scheduleEventId = event.getScheduleEventId();
      const scheduleEventService = new ScheduleEventService();

      const medication = await medicationService.getMedication({ id: eventId });

      if (medication) {
        const updateEventStatus = await scheduleEventService.update(
          {
            status: EVENT_STATUS.SCHEDULED,
          },
          scheduleEventId
        );

        const eventScheduleData = await scheduleEventService.getEventByData({
          id: scheduleEventId,
        });

        const medicationJob = MedicationJob.execute(
          EVENT_STATUS.STARTED,
          eventScheduleData
        );

        await NotificationSdk.execute(medicationJob);
      } else {
        const cancelledEvent = await scheduleEventService.update(
          {
            status: EVENT_STATUS.CANCELLED,
          },
          scheduleEventId
        );
      }

      // const job = jobSdk.execute({
      //     eventType: EVENT_TYPE.MEDICATION_REMINDER,
      //     eventStage: NOTIFICATION_STAGES.START,
      //     event
      // });
      // notificationSdk.execute(job);
    } catch (error) {
      logger.error("handleVitalStart 500 error ---> ", error);
    }
  };

  handleDietStart = async (event) => {
    try {
      const eventId = event.getEventId();
      const scheduleEventId = event.getScheduleEventId();
      const scheduleEventService = new ScheduleEventService();
      const dietService = new DietService();

      const dietExists = (await dietService.findOne({ id: eventId })) || null;

      if (dietExists) {
        await scheduleEventService.update(
          {
            status: EVENT_STATUS.SCHEDULED,
          },
          scheduleEventId
        );

        const eventScheduleData = await scheduleEventService.getEventByData({
          id: scheduleEventId,
        });

        const dietJob = DietJob.execute(
          EVENT_STATUS.STARTED,
          eventScheduleData
        );
        await NotificationSdk.execute(dietJob);
      } else {
        await scheduleEventService.update(
          {
            status: EVENT_STATUS.CANCELLED,
          },
          scheduleEventId
        );
      }
    } catch (error) {
      logger.error("handleDietStart 500 error", error);
    }
  };

  handleWorkoutStart = async (event) => {
    try {
      const eventId = event.getEventId();
      const scheduleEventId = event.getScheduleEventId();
      const scheduleEventService = new ScheduleEventService();
      const workoutService = new WorkoutService();

      const workoutExists =
        (await workoutService.findOne({ id: eventId })) || null;

      if (workoutExists) {
        await scheduleEventService.update(
          {
            status: EVENT_STATUS.SCHEDULED,
          },
          scheduleEventId
        );

        const eventScheduleData = await scheduleEventService.getEventByData({
          id: scheduleEventId,
        });

        const workoutJob = WorkoutJob.execute(
          EVENT_STATUS.STARTED,
          eventScheduleData
        );
        await NotificationSdk.execute(workoutJob);
      } else {
        await scheduleEventService.update(
          {
            status: EVENT_STATUS.CANCELLED,
          },
          scheduleEventId
        );
      }
    } catch (error) {
      logger.error("handleWorkoutStart 500 error", error);
    }
  };

  handleCarePlanStart = async (event) => {
    try {
      const eventId = event.getEventId();
      const scheduleEventId = event.getScheduleEventId();
      const scheduleEventService = new ScheduleEventService();
      const updateEventStatus = await scheduleEventService.update(
        {
          status: EVENT_STATUS.SCHEDULED,
        },
        scheduleEventId
      );

      const eventScheduleData = await scheduleEventService.getEventByData({
        id: scheduleEventId,
      });

      const carePlanJob = CarePlanJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventScheduleData
      );

      await NotificationSdk.execute(carePlanJob);
    } catch (error) {
      logger.error("handleCarePlanStart 500 error ---> ", error);
    }
  };
}

export default new StartCron();
