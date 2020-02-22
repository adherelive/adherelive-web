const eventService = require("../../services/event/event.service");
const Response = require("../../helper/responseFormat");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
const { ActivitySdk, STAGES } = require("../../activitySdk");
const errMessages = require("../../../config/messages.json").errMessages;

import moment from "moment";
import scheduleService from "../../services/scheduler/scheduler.service";
import { EVENT_TYPE } from "../../../constant";
import { handleRescheduleAll, getEventDates } from "./helper";

const scheduleEventTime = ["0", "15", "30", "45"];

class ReminderController {
  eventCategory = "reminder";
  create = async (req, res) => {
    try {
      const { body: data, userDetails } = req;
      const {
        participantTwo,
        startTime,
        startDate,
        endDate,
        repeat,
        repeatDays,
        repeatInterval,
        notes,
        title
      } = data;
      const { userId: participantOne } = userDetails;
      //create link of this et
      const dataToSave = {
        eventCategory: this.eventCategory,
        participantOne,
        participantTwo,
        startDate: startDate,
        endDate: endDate,
        details: {
          repeat,
          repeatDays,
          repeatInterval,
          startTime,
          endTime: startTime,
          notes,
          title
        },
        link: ""
      };

      const reminder = await eventService.addEvent(dataToSave);
      console.log("reminder=====================>", reminder);
      const ex = reminder.toObject();
      const value = { ...ex, userId: participantOne };

      const notificationData = {
        eventType: EVENT_TYPE.REMINDER,
        stage: STAGES.INIT,
        data: value
      };
      ActivitySdk.execute(notificationData);
      //prepare data for scheduling job

      const schedulerData = {
        eventId: reminder._id,
        eventType: this.eventCategory,
        actionMode: reminder.activityMode,
        scheduledOn: startDate,
        data: reminder
      };

      // const result = ActivitySdk.execute({
      //   eventType: EVENT_TYPE.REMINDER,
      //   stage: STAGES.INIT,
      //   data: value
      // });
      await Proxy_Sdk.scheduleEvent(schedulerData);

      let response = new Response(true, 200);
      response.setMessage("Reminder created succesfully");
      return res.status(200).send(response.getResponse());
    } catch (err) {
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError({ error: payload.error });
      return res.status(payload.code).json(response.getResponse());
    }
  };

  async getReminders(req, res) {
    const { userId, startDate, endDate } = req.query;
    try {
      const remindersData = await eventService.getEventsByuserId({
        eventCategory: "reminder",
        userId,
        startDate: startDate,
        endDate: endDate
      });

      let reminders = {};
      let schedulesEvents = {};
      for (const reminder of remindersData) {
        const scheduleEventList = await scheduleService.getScheduleEvent({
          eventId: reminder._id,
          startDate: startDate,
          endDate: endDate
        });

        scheduleEventList.forEach(scheduleEvent => {
          const {
            _id,
            eventType,
            eventId,
            startTime,
            endTime,
            data,
            status
          } = scheduleEvent;
          schedulesEvents[_id] = {
            id: _id,
            eventType: eventType,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            data: data,
            status: status
          };
        });
        reminders[reminder._id] = scheduleEventList.map(
          scheduleEvent => scheduleEvent._id
        );
      }

      const response = new Response(true, 200);
      response.setData({
        reminders: reminders,
        events: schedulesEvents
      });

      return res.send(response.getResponse());
    } catch (err) {
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
  async cancel(req, res) {
    try {
      const { id, all } = req.query;
      const { userId } = req.userDetails;
      let result = {};
      let message;
      if (all === "false") {
        result = await scheduleService.markAllEventsAsCancel({
          id: id
        });
        message = "Reminder(s) cancelled successfully";
        const data = {
          eventType: EVENT_TYPE.REMINDER,
          stage: STAGES.CANCEL,
          data: { ...result, userId, isRepetitive: true }
        };
        const handled = await ActivitySdk.execute(data);
      } else if (all === "true") {
        message = "Reminder cancelled successfully";
        result = await scheduleService.scheduleEventMarkAsCancel({
          id: id
        });
        const data = {
          eventType: EVENT_TYPE.REMINDER,
          stage: STAGES.CANCEL,
          data: { ...result, userId }
        };
        const handled = await ActivitySdk.execute(data);
      }

      //ActivitySdk.execute();
      let response = new Response(true, 200);
      response.setMessage(message);
      return res.send(response.getResponse());
    } catch (err) {
      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async editReminder(req, res) {
    try {
      const {
        startDate,
        startTime,
        endTime,
        notes,
        series = false,
        repeat,
        repeatDays,
        repeatInterval,
        endDate
      } = req.body;
      const { scheduleEventId } = req.params;
      const { userId } = req.userDetails;

      if (series) {
        const prevdates = await getEventDates(scheduleEventId);
        const { startDate: prevStartDate, endDate: prevEndDate } =
          prevdates || {};
        console.log("prevdates ---------------------->", prevdates);
        const rescheduleAllData = await handleRescheduleAll({
          startDate,
          startTime,
          endTime,
          notes,
          scheduleEventId,
          repeat,
          repeatDays,
          repeatInterval,
          endDate,
          prevStartDate,
          prevEndDate,
          userId
        });

        let data_for_notification = {};
        data_for_notification = rescheduleAllData.toObject();
        data_for_notification.prevStartDate = prevStartDate;
        data_for_notification.prevEndDate = prevEndDate;
        data_for_notification.currentStartDate = startDate;
        data_for_notification.currentEndDate = endDate;
        data_for_notification.userId = userId;
        console.log("data_for----------------------->", data_for_notification);

        const events_data = {
          eventType: EVENT_TYPE.REMINDER,
          stage: STAGES.RESCHEDULE,
          data: data_for_notification
        };
        const result = await ActivitySdk.execute(events_data);

        const response = new Response(true, 200);
        response.setMessage("Reminder(s) rescheduled successfully");
        return res.send(response.getResponse());
      }

      //check for only appointmnet and reminder

      const scheduleEventprevData = await scheduleService.getScheduleEventById(
        scheduleEventId
      );
      const { startTime: prevDate } = scheduleEventprevData;

      const rescheduleresult = await scheduleService.reschedule({
        id: scheduleEventId,
        on: startDate,
        startTime: startTime,
        endTime: startTime
      });
      const editNotesresult = await scheduleService.editNotes({
        id: scheduleEventId,
        notes: notes
      });

      const data = {
        eventType: EVENT_TYPE.REMINDER,
        stage: STAGES.RESCHEDULE,
        data: {
          ...editNotesresult,
          userId: userId,
          prevStartDate: prevDate,
          currentStartDate: startTime
        }
      };

      const handled = await ActivitySdk.execute(data);

      var m = moment(new Date());
      var minutes = m.minute();

      console.log("minutes================================>", minutes);
      let slotTime = "";
      for (let time in scheduleEventTime) {
        if (parseInt(minutes) < scheduleEventTime[time]) {
          slotTime = scheduleEventTime[time];
          break;
        }
      }

      const now = moment().add(15, "minutes");
      let startOn = moment(startTime);
      const startMinutes = moment(startTime).minute();
      if (startOn < now && startMinutes < slotTime) {
        console.log(
          "startOn < now====================>",
          startOn < now,
          rescheduleresult
        );
        await Proxy_Sdk.scheduleStartEndOfEvent(rescheduleresult);
      }

      const response = new Response(true, 200);
      response.setMessage("Reminder rescheduled successfully");
      return res.send(response.getResponse());
    } catch (err) {
      console.log(err);

      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async editNotesScheduleEvent(req, res) {
    try {
      const { notes } = req.body;
      const { scheduleEventId } = req.params;
      const { userId } = req.userDetails;
      //check for only appointmnet and reminder
      const result = await scheduleService.editNotes({
        id: scheduleEventId,
        notes: notes
      });

      const data = {
        eventType: EVENT_TYPE.REMINDER,
        stage: STAGES.EDIT_NOTES,
        data: { ...result, userId }
      };
      const handled = await ActivitySdk.execute(data);
      const response = new Response(true, 200);
      response.setMessage("Reminder's note updated successfully");
      return res.send(response.getResponse());
    } catch (err) {
      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

export default new ReminderController();
