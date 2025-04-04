import scheduleService from "../services/scheduleEvents/scheduleEvent.service";
import moment from "moment";
import { EVENT_TYPE } from "../../constant";
import { createLogger } from "../../libs/logger";

const getAllOccurrence = require("./scheduler/helper");
const { EventEmitter } = require("events");
const EVENTS = require("./proxyEvents");
const scheduler = require("./scheduler");
const { NotificationSdk } = require("../notificationSdk");
const { ActivitySdk, STAGES } = require("../activitySdk");
const schedule = require("node-schedule");

const logger = createLogger("PROXY_SDK");

function checkEventHaveToStart(startTime) {
  logger.debug("START TIME: Check Event Has Started");
  const at00 = moment().minutes(0).seconds(0).milliseconds(0);
  const at15 = moment().minutes(15).seconds(0).milliseconds(0);
  const at30 = moment().minutes(30).seconds(0).milliseconds(0);
  const at45 = moment().minutes(45).seconds(0).milliseconds(0);
  const atNext00 = moment().add(1, "h").minutes(0).seconds(0).milliseconds(0);

  const listOfScheduler = [at00, at15, at30, at45, atNext00];

  let status = false;
  const now = moment();

  let x = 0;

  for (let i = 0; i < 5; i++) {
    if (now < listOfScheduler[i]) {
      x = i;
      break;
    }
  }

  if (startTime < listOfScheduler[x]) {
    status = true;
  }
  logger.debug("Start Time List of Schedulers: ", status);
  return status;
}

export const REPEAT_TYPE = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

const STARTED = "started";

class ProxySdk extends EventEmitter {
  scheduledJobId;

  constructor() {
    super();
  }

  execute(eventName, ...args) {
    logger.debug(
      "INSIDE EXECUTE EVENT EMITTER: ",
      eventName,
      " SENT ARGS ",
      args
    );
    this.emit(eventName, ...args);
  }

  handleNotification = (eventType, data) => {
    const { participantOne, participantTwo } = data;
    switch (eventType) {
      case "appointment":
        NotificationSdk.execute(participantOne, data);
        NotificationSdk.execute(participantTwo, data);
        break;
      case "reminder":
        NotificationSdk.execute(participantOne, data, true);
        NotificationSdk.execute(participantTwo, data, true);
        break;
      default:
    }
  };

  scheduleEvent = async ({ data }) => {
    logger.debug("\n HERE \n");
    try {
      const {
        _id,
        event_type,
        startDate,
        endDate,
        participantOne,
        participantTwo,
        details: {
          activityMode,
          activityType,
          repeat,
          repeatDays,
          repeatInterval,
          startTime,
          endTime,
          notes,
          title,
          medicine,
          quantity,
          strength,
          unit,
          whenToTake,
          medication_stage,
        },
        link,
      } = data;

      let scheduler_extra_data = {};

      switch (event_type) {
        case EVENT_TYPE.MEDICATION_REMINDER:
          scheduler_extra_data = {
            repeat: repeat,
            repeatInterval: repeatInterval,
            repeatDays: repeatDays,
            notes: notes,
            link: link,
            medicine: medicine,
            quantity: quantity,
            strength: strength,
            medication_stage: medication_stage,
            unit: unit,
            whenToTake: whenToTake,
            participantOne: participantOne,
            participantTwo: participantTwo,
          };
          break;
        case EVENT_TYPE.APPOINTMENT:
        case EVENT_TYPE.REMINDER:
          scheduler_extra_data = {
            repeat: repeat,
            repeatInterval: repeatInterval,
            repeatDays: repeatDays,
            notes: notes,
            link: link,
            title: title,
            participantOne: participantOne,
            participantTwo: participantTwo,
            activityMode: activityMode,
            activityType: activityType,
          };
          break;
        default:
          throw new Error(`${event_type} not a valid event for scheduling`);
      }

      const start = new moment.utc(startDate);
      const end = new moment.utc(endDate);
      const eventStartTime = new moment.utc(startTime);
      const eventEndTime = new moment.utc(endTime);

      const allOccurrence = await getAllOccurrence({
        repeat,
        repeatInterval,
        listOfDays: repeatDays,
        startDate: start,
        endDate: end,
        eventStartTime,
        eventEndTime,
      });

      logger.debug(allOccurrence);

      const schedule_for_later = [];
      let have_to_schedule_now;

      allOccurrence.forEach((nextEventOn, index) => {
        const { startTime: startOn, endTime: endOn } = nextEventOn;
        const data_to_save = {
          eventId: _id,
          eventType: event_type,
          startTime: startOn,
          endTime: endOn,
          data: scheduler_extra_data,
        };
        if (index === 0 && checkEventHaveToStart(startOn)) {
          have_to_schedule_now = data_to_save;
        } else {
          schedule_for_later.push(data_to_save);
        }
      });

      if (have_to_schedule_now) {
        const scheduledJob = await scheduleService.addNewJob(
          have_to_schedule_now
        );
        logger.debug("event will be start soon after create");
        await this.scheduleStartEndOfEvent(scheduledJob);
      }

      if (schedule_for_later.length > 0) {
        const scheduledJob = await scheduleService.addNewJob(
          schedule_for_later
        );
      }

      logger.debug(
        "==================================================================================================================================================================="
      );
    } catch (error) {
      logger.warn(`Error in scheduleEvent: ${error}`);
    }
  };

  async scheduleStartEndOfEvent(event) {
    const now = new Date();
    const {
      _id: scheduledJobId,
      status: scheduledJobStatus,
      eventType,
      startTime,
      endTime,
      data: { activityType },
    } = event;
    const eventStartTime = new Date(startTime);
    const diff = eventStartTime.getTime() - now.getTime();
    if (eventType === EVENT_TYPE.MEDICATION_REMINDER) {
      if (diff > 0) {
        schedule.scheduleJob(
          eventStartTime,
          function (y) {
            scheduler
              .updateScheduledJob({
                id: scheduledJobId,
                status: "active",
                previousStatus: scheduledJobStatus,
                previousStartTime: startTime,
              })
              .then((res) => {
                if (res) {
                  const data = {
                    eventType: eventType,
                    activityType,
                    stage: STAGES.STARTED,
                    data: res,
                  };
                  ActivitySdk.execute(data);
                  logger.debug("job is started", scheduledJobId);
                }
              });
          }.bind(event)
        );

        logger.debug(`startedJob: ${event}`);
      } else {
        scheduler
          .updateScheduledJob({
            id: scheduledJobId,
            status: "active",
          })
          .then((res) => {
            const data = {
              eventType: eventType,
              activityType,
              stage: STAGES.STARTED,
              data: res,
            };
            ActivitySdk.execute(data);
            logger.debug("job is started", scheduledJobId);
          });
      }
    } else {
      if (diff > 0) {
        schedule.scheduleJob(
          eventStartTime,
          function (y) {
            logger.debug(
              "eventType instart======================>",
              event,
              scheduledJobStatus
            );
            scheduler
              .updateScheduledJob({
                id: scheduledJobId,
                status:
                  eventType === EVENT_TYPE.REMINDER ? "completed" : "started",
                previousStatus: scheduledJobStatus,
                previousStartTime: startTime,
              })
              .then((res) => {
                if (res) {
                  const data = {
                    eventType: eventType,
                    activityType,
                    stage: STAGES.STARTED,
                    data: res,
                  };
                  ActivitySdk.execute(data);
                  logger.debug("job is started", scheduledJobId);
                }
              });
          }.bind(event)
        );

        const data = {
          eventType: eventType,
          activityType,
          stage: STAGES.PRIOR,
          data: event,
        };

        logger.debug(
          "eventType instart======================>",
          event,
          scheduledJobStatus
        );
        const result = await ActivitySdk.execute(data);
        logger.debug(`startedJob: ${event}`);
      } else {
        scheduler
          .updateScheduledJob({
            id: scheduledJobId,
            status: eventType === EVENT_TYPE.REMINDER ? "completed" : "started",
          })
          .then((res) => {
            const data = {
              eventType: eventType,
              activityType,
              stage: STAGES.STARTED,
              data: res,
            };
            ActivitySdk.execute(data);
            logger.debug("job is started", scheduledJobId);
          });
      }
    }
    if (eventType === EVENT_TYPE.APPOINTMENT) {
      const eventEndTime = new Date(endTime);
      schedule.scheduleJob(eventEndTime, () => {
        const {
          data: { activityMode },
        } = event;
        let statusToUpdate = "passed";
        if (activityMode === "chat") {
          const joinedParticipants = scheduleService
            .getScheduleEventById(event._id)
            .then((result) => {
              statusToUpdate =
                result.joinedParticipants.length === 2 &&
                activityMode === "chat"
                  ? "completed"
                  : "passed";
              const updatedJob = scheduler
                .updateScheduledJob({
                  id: scheduledJobId,
                  status: statusToUpdate,
                })
                .then((res) => {
                  const data = {
                    eventType: eventType,
                    activityType,
                    stage: STAGES.PASSED,
                    data: res,
                  };
                  ActivitySdk.execute(data);
                  logger.debug(`updatedJob: ${res}`);
                });
            });
        } else {
          scheduleService.getScheduleEventById(event._id).then((response) => {
            if (response.status === STARTED) {
              const updatedJob = scheduler
                .updateScheduledJob({
                  id: scheduledJobId,
                  status: "passed",
                })
                .then((res) => {
                  const data = {
                    eventType: eventType,
                    activityType,
                    stage: STAGES.PASSED,
                    data: res,
                  };
                  ActivitySdk.execute(data);
                  logger.debug(`updatedJob: ${res}`);
                });
            }
          });
        }
      });
    }
  }

  async executeScheduledEvent() {
    const scheduledJobs = await scheduler.fetchScheduledJobs();
    const passedJobs = await scheduler.fetchPassedJobs();

    logger.debug(`scheduledJobs: , ${scheduledJobs}`);
    logger.debug(`passsedJobs: , ${passedJobs}`);

    for (const job of scheduledJobs) {
      this.scheduleStartEndOfEvent(job);
    }
    for (const job of passedJobs) {
      const { _id: scheduledJobId, eventType } = job;
      if (eventType !== EVENT_TYPE.MEDICATION_REMINDER) {
        const updatedJob = await scheduler.updateScheduledJob({
          id: scheduledJobId,
          status: eventType === EVENT_TYPE.REMINDER ? "completed" : "passed",
        });

        const {
          data: { activityType },
        } = updatedJob;

        const data = {
          eventType: eventType,
          activityType,
          stage:
            eventType === EVENT_TYPE.REMINDER ? STAGES.COMPLETE : STAGES.PASSED,
          data: updatedJob,
        };
        const result =
          eventType !== EVENT_TYPE.MEDICATION_REMINDER &&
          (await ActivitySdk.execute(data));

        logger.debug(`updatedJob: ${updatedJob}`);
      }
    }
  }
}

const Proxy_Sdk = new ProxySdk();
module.exports = { Proxy_Sdk, EVENTS };
