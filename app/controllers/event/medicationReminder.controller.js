const eventService = require("../../services/event/event.service");
const Response = require("../../helper/responseFormat");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
const { ActivitySdk, STAGES } = require("../../activitySdk");
const errMessages = require("../../../config/messages.json").errMessages;
import { ObjectId } from "mongodb";

import moment from "moment";
import scheduleService from "../../services/scheduler/scheduler.service";
import { EVENT_TYPE, REPEAT_TYPE, USER_CATEGORY } from "../../../constant";
import { getEventDates, handleMedicationReminderRescheduleAll } from "./helper";

class MedicationReminderController {
  eventCategory = "medication-reminder";
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
        medicine,
        quantity,
        strength,
        unit,
        whenToTake,
        medication_stage
      } = data;
      const {
        userId: participantOne,
        userData: { category } = {}
      } = userDetails;

      let searchData = {};
      if (category === USER_CATEGORY.CARE_COACH) {
        searchData = {
          startTime: moment(startTime).toISOString(),
          "data.medicine": medicine,
          "data.medication_stage": medication_stage,
          "data.participantTwo": ObjectId(participantTwo)
        };
      } else if (category === USER_CATEGORY.PATIENT) {
        searchData = {
          startTime: moment(startTime).toISOString(),
          "data.medicine": medicine,
          "data.medication_stage": medication_stage,
          "data.participantOne": ObjectId(participantOne)
        };
      }

      const isAlreadyPresent = await scheduleService.getMedicationReminderByStartDateandMedicine(
        { ...searchData }
      );

      console.log("isAlreadyPresent======================>", isAlreadyPresent);
      if (!isAlreadyPresent) {
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
            medicine,
            quantity,
            strength,
            unit,
            medication_stage,
            whenToTake
          },
          link: ""
        };

        const medication_reminder = await eventService.addEvent(dataToSave);
        const ex = medication_reminder.toObject();
        const value = { ...ex, userId: participantOne };
        console.log("value------------------------------->", value);
        const notificationData = {
          eventType: EVENT_TYPE.MEDICATION_REMINDER,
          stage: STAGES.INIT,
          data: value
        };
        ActivitySdk.execute(notificationData);
        //prepare data for scheduling job

        const schedulerData = {
          eventId: medication_reminder._id,
          eventType: this.eventCategory,
          actionMode: medication_reminder.activityMode,
          scheduledOn: startDate,
          data: medication_reminder
        };

        // const result = ActivitySdk.execute({
        //   eventType: EVENT_TYPE.REMINDER,
        //   stage: STAGES.INIT,
        //   data: value
        // });
        await Proxy_Sdk.scheduleEvent(schedulerData);

        let response = new Response(true, 200);
        response.setMessage("Medication Reminder created succesfully");
        return res.status(200).send(response.getResponse());
      }

      let payload = {
        error: "Reminder already exits for given medication for given time.",
        code: 409
      };
      let response = new Response(false, payload.code);
      response.setError({ error: payload.error });
      return res.status(payload.code).json(response.getResponse());
    } catch (err) {
      console.log("err===========>", err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError({ error: payload.error });
      return res.status(payload.code).json(response.getResponse());
    }
  };

  async getMedicationReminders(req, res) {
    const { userId, startDate, endDate } = req.query;
    try {
      const medicationRemindersData = await eventService.getEventsByuserId({
        eventCategory: this.eventCategory,
        userId,
        startDate: startDate,
        endDate: endDate
      });

      let medicationReminders = {};
      let schedulesEvents = {};
      for (const medicationReminder of medicationRemindersData) {
        const scheduleEventList = await scheduleService.getScheduleEvent({
          eventId: medicationReminder._id,
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
        medicationReminders[reminder._id] = scheduleEventList.map(
          scheduleEvent => scheduleEvent._id
        );
      }

      const response = new Response(true, 200);
      response.setData({
        medication_reminders: medicationReminders,
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
      if (all === "false") {
        result = await scheduleService.markAllEventsAsCancel({
          id: id
        });

        const data = {
          eventType: EVENT_TYPE.REMINDER,
          stage: STAGES.CANCEL,
          data: { ...result, userId, isRepetitive: true }
        };
        const handled = await ActivitySdk.execute(data);
      } else if (all === "true") {
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
      response.setMessage("Reminder Cancelled Successfully");
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

  async editMedicationReminder(req, res) {
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
        endDate,
        medicine,
        quantity,
        strength,
        unit,
        whenToTake,
        medication_stage,
        participantOne,
        participantTwo
      } = req.body;

      const { scheduleEventId } = req.params;
      const { userId } = req.userDetails;

      if (series) {
        const rescheduleAllData = await handleMedicationReminderRescheduleAll({
          startDate,
          startTime,
          endTime,
          notes,
          scheduleEventId,
          repeat,
          repeatDays,
          repeatInterval,
          endDate,
          medicine,
          quantity,
          strength,
          medication_stage,
          unit,
          whenToTake
        });

        // let data_for_notification = {};
        // data_for_notification = rescheduleAllData.toObject();
        // data_for_notification.prevStartDate = prevStartDate;
        // data_for_notification.prevEndDate = prevEndDate;
        // data_for_notification.currentStartDate = startDate;
        // data_for_notification.currentEndDate = endDate;
        // data_for_notification.userId = userId;
        // console.log("data_for----------------------->", data_for_notification);

        // const events_data = {
        //   eventType: EVENT_TYPE.REMINDER,
        //   stage: STAGES.RESCHEDULE,
        //   data: data_for_notification
        // };
        // const result = await ActivitySdk.execute(events_data);

        const response = new Response(true, 200);
        response.setMessage("Event details updated successfully");
        return res.send(response.getResponse());
      }

      //check for only appointmnet and reminder

      const scheduleEventprevData = await scheduleService.getScheduleEventById(
        scheduleEventId
      );
      const { startTime: prevDate } = scheduleEventprevData;

      const rescheduleresult = await scheduleService.updateMedicationReminder({
        startTime,
        endTime,
        notes,
        id: scheduleEventId,
        repeat,
        repeatDays,
        repeatInterval,
        medicine,
        quantity,
        strength,
        unit,
        whenToTake,
        participantOne,
        medication_stage,
        participantTwo
      });

      // const data = {
      //   eventType: EVENT_TYPE.REMINDER,
      //   stage: STAGES.RESCHEDULE,
      //   data: {
      //     ...editNotesresult,
      //     userId: userId,
      //     prevStartDate: prevDate,
      //     currentStartDate: startTime
      //   }
      // };

      // const handled = await ActivitySdk.execute(data);

      const now = moment().add(15, "minutes");
      let startOn = moment(startTime);
      if (startOn < now) {
        await Proxy_Sdk.scheduleStartEndOfEvent(rescheduleresult);
      }

      const response = new Response(true, 200);
      response.setMessage("Event details updated successfully");
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

  async updateMedicationReminderStatus(req, res) {
    try {
      const { scheduleEventId, status } = req.params;
      const { reason } = req.body;
      //check for only appointmnet and reminder
      const result = await scheduleService.updateMedicationReminderStatus(
        scheduleEventId,
        status,
        reason
      );
      const { eventId } = result;
      let taken = "";
      let skip = "";
      taken = await scheduleService.getCountForStatusInEvent({
        eventId,
        status: "taken"
      });
      skip = await scheduleService.getCountForStatusInEvent({
        eventId,
        status: "skip"
      });

      const response = new Response(true, 200);
      response.setData({
        taken: taken,
        skip: skip,
        events: { [eventId]: result }
      });
      response.setMessage("Medication Reminder Status Updated");
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

export default new MedicationReminderController();
