import Logger from "../../libs/log";
import moment from "moment";

import { EVENT_STATUS, EVENT_TYPE, NOTIFICATION_STAGES } from "../../constant";

// SERVICES ---------------
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";
import medicationService from "../services/medicationReminder/mReminder.service";
import DietService from "../services/diet/diet.service";
import WorkoutService from "../services/workouts/workout.service";

// WRAPPERS ---------------
import ScheduleEventWrapper from "../ApiWrapper/common/scheduleEvents";

import JobSdk from "../JobSdk";
import NotificationSdk from "../NotificationSdk";
import AppointmentJob from "../JobSdk/Appointments/observer";
import MedicationJob from "../JobSdk/Medications/observer";
import CarePlanJob from "../JobSdk/CarePlan/observer";
import DietJob from "../JobSdk/Diet/observer";
import WorkoutJob from "../JobSdk/Workout/observer"

const Log = new Logger("CRON > START");

class StartCron {
  getScheduleData = async () => {
    const scheduleEventService = new ScheduleEventService();
    const currentTime = moment()
      .utc()
      .toISOString();
    Log.info(`currentTime : ${currentTime}`);
    const scheduleEvents = await scheduleEventService.getStartEventByData(
      currentTime
    );
    return scheduleEvents;
  };

  runObserver = async () => {
    try {
      Log.info("running START cron");
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
      Log.info(`START count : ${count} / ${scheduleEvents.length}`);
    } catch (error) {
      Log.debug("scheduleEvents 500 error ---->", error);
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

      const job = JobSdk.execute({
        eventType: EVENT_TYPE.VITALS,
        eventStage: NOTIFICATION_STAGES.START,
        event,
      });
      NotificationSdk.execute(job);
    } catch (error) {
      Log.debug("handleVitalStart 500 error ---->", error);
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

      const eventScheduleData = await scheduleEventService.getEventByData({
        id: scheduleEventId,
      });

      const appointmentJob = AppointmentJob.execute(
        EVENT_STATUS.STARTED,
        eventScheduleData
      );
      await NotificationSdk.execute(appointmentJob);

      // const job = JobSdk.execute({
      //     eventType: EVENT_TYPE.APPOINTMENT,
      //     eventStage: NOTIFICATION_STAGES.START,
      //     event
      // });
      // NotificationSdk.execute(job);
    } catch (error) {
      Log.debug("handleAppointmentStart 500 error ---->", error);
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

      // const job = JobSdk.execute({
      //     eventType: EVENT_TYPE.MEDICATION_REMINDER,
      //     eventStage: NOTIFICATION_STAGES.START,
      //     event
      // });
      // NotificationSdk.execute(job);
    } catch (error) {
      Log.debug("handleVitalStart 500 error ---->", error);
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
      Log.debug("handleDietStart 500 error", error);
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
      Log.debug("handleWorkoutStart 500 error", error);
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
      Log.debug("handleCarePlanStart 500 error ---->", error);
    }
  };
}

export default new StartCron();
