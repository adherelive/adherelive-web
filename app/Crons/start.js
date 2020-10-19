import Logger from "../../libs/log";
import moment from "moment";

import { EVENT_STATUS, EVENT_TYPE, NOTIFICATION_STAGES } from "../../constant";

// SERVICES ---------------
import ScheduleEventService from "../services/scheduleEvents/scheduleEvent.service";

// WRAPPERS ---------------
import ScheduleEventWrapper from "../ApiWrapper/common/scheduleEvents";

import JobSdk from "../JobSdk";
import NotificationSdk from "../NotificationSdk";
import AppointmentJob from "../JobSdk/Appointments/observer";
import MedicationJob from "../JobSdk/Medications/observer";

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

      Log.debug("Schedule events got are: ", scheduleEvents);
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
            default:
              break;
          }
        }
      }
      Log.info(`START count : ${count} / ${scheduleEvents.length}`);
    } catch (error) {
      Log.debug("scheduleEvents 500 error ---->", error);
      // Log.errLog(500, "getPriorEvents", error.getMessage());
    }
  };

  handleVitalStart = async event => {
    try {
      const eventId = event.getEventId();
      const scheduleEventService = new ScheduleEventService();
      const scheduleEventId = event.getScheduleEventId();
      const updateEventStatus = await scheduleEventService.update(
        {
          status: EVENT_STATUS.SCHEDULED
        },
        scheduleEventId
      );

      const job = JobSdk.execute({
        eventType: EVENT_TYPE.VITALS,
        eventStage: NOTIFICATION_STAGES.START,
        event
      });
      NotificationSdk.execute(job);
    } catch (error) {
      Log.debug("handleVitalStart 500 error ---->", error);
    }
  };

  handleAppointmentStart = async event => {
    try {
      const eventId = event.getEventId();
      const scheduleEventId = event.getScheduleEventId();
      const scheduleEventService = new ScheduleEventService();
      const updateEventStatus = await scheduleEventService.update(
        {
          status: EVENT_STATUS.SCHEDULED
        },
        scheduleEventId
      );

      const eventScheduleData = await scheduleEventService.getEventByData({
        id: scheduleEventId
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
      Log.debug("handleVitalStart 500 error ---->", error);
    }
  };

  handleMedicationStart = async event => {
    try {
      const eventId = event.getEventId();
      const scheduleEventId = event.getScheduleEventId();
      const scheduleEventService = new ScheduleEventService();
      const updateEventStatus = await scheduleEventService.update(
        {
          status: EVENT_STATUS.SCHEDULED
        },
        scheduleEventId
      );

      const eventScheduleData = await scheduleEventService.getEventByData({
        id: scheduleEventId
      });

      const medicationJob = MedicationJob.execute(
        EVENT_STATUS.STARTED,
        eventScheduleData
      );

      await NotificationSdk.execute(medicationJob);

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
}

export default new StartCron();
