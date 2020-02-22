import dateFns from "date-fns";
const eventService = require("../../services/event/event.service");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
import scheduleService from "../../services/scheduler/scheduler.service";
import { USER_CATEGORY } from "../../../constant";

export const handleRescheduleAll = async (data = {}) => {
  try {
    const {
      startDate,
      startTime,
      endTime,
      notes,
      scheduleEventId,
      repeat,
      repeatDays,
      repeatInterval,
      endDate
    } = data;
    const scheduleEventData = await scheduleService.getScheduleEventById(
      scheduleEventId
    );
    const { eventId } = scheduleEventData;
    const eventData = await eventService.getEventById(eventId);
    await scheduleService.cancelEventBetweenRange({
      id: eventId,
      startDate,
      endDate
    });
    const { _id, ...restData } = eventData;
    const { details = {} } = restData;
    const newEventData = {
      ...restData,
      startDate,
      endDate,
      details: {
        ...details,
        startTime,
        endTime,
        notes,
        repeat,
        repeatInterval,
        repeatDays
      }
    };
    let newEvent = await eventService.addEvent(newEventData);
    const scheduledJob = await Proxy_Sdk.scheduleEvent({
      data: newEvent
    });

    return newEvent;
  } catch (err) {
    throw err;
  }

  // await scheduleService.cancelEventBetweenRange({id:scheduleEventId,startDate,endDate});
  // const res = await eventService.
};

export const getEventDates = async scheduleEventId => {
  try {
    const scheduleEventData = await scheduleService.getScheduleEventById(
      scheduleEventId
    );
    const { eventId } = scheduleEventData;
    const eventData = await eventService.getEventById(eventId);
    // console.log("eventData--------------------------->", eventData);
    const { startDate, endDate } = eventData || {};
    return { startDate, endDate };
  } catch (err) {
    throw err;
  }

  // await scheduleService.cancelEventBetweenRange({id:scheduleEventId,startDate,endDate});
  // const res = await eventService.
};

export const handleMedicationReminderRescheduleAll = async (data = {}) => {
  try {
    const {
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
      unit,
      whenToTake
    } = data;
    const scheduleEventData = await scheduleService.getScheduleEventById(
      scheduleEventId
    );
    const { eventId } = scheduleEventData;
    const eventData = await eventService.getEventById(eventId);
    await scheduleService.cancelEventBetweenRange({
      id: eventId,
      startDate,
      endDate
    });
    const { _id, ...restData } = eventData;
    const { details = {} } = restData;
    const newEventData = {
      ...restData,
      startDate,
      endDate,
      details: {
        ...details,
        startTime,
        endTime,
        notes,
        repeat,
        repeatInterval,
        repeatDays,
        medicine,
        quantity,
        strength,
        unit,
        whenToTake
      }
    };
    let newEvent = await eventService.addEvent(newEventData);
    const scheduledJob = await Proxy_Sdk.scheduleEvent({
      data: newEvent
    });
    return scheduledJob;
  } catch (err) {
    throw err;
  }

  // await scheduleService.cancelEventBetweenRange({id:scheduleEventId,startDate,endDate});
  // const res = await eventService.
};

export const getCurrrentWeekReminderByDate = async (userId, category) => {
  try {
    let appointmentsData = {};
    let scheduleEventListByDate = {};
    const currentDate = new Date();

    const startDate = dateFns.format(
      dateFns.startOfWeek(currentDate),
      "YYYY-MM-DD"
    );
    const endDate = dateFns.format(
      dateFns.endOfWeek(currentDate),
      "YYYY-MM-DD"
    );
    if (category === USER_CATEGORY.PATIENT) {
      appointmentsData = await eventService.getEventsByuserId({
        eventCategories: ["reminder", "medication-reminder"],
        userId,
        status: ["pending", "completed", "expired", "active"],
        startDate: startDate,
        endDate: endDate
      });
    } else {
      appointmentsData = await eventService.getEventsByuserId({
        eventCategories: ["reminder"],
        userId,
        status: ["pending", "completed", "expired"],
        startDate: startDate,
        endDate: endDate
      });
    }

    const eventList = appointmentsData.map(appointment => appointment._id);

    const scheduleEventListData = await scheduleService.getScheduleEventByEventIdGroupByDate(
      { eventIds: eventList, startDate, endDate }
    );
    scheduleEventListData.forEach(scheduleEvent => {
      const { _id, scheduleEvents = [] } = scheduleEvent;
      scheduleEventListByDate[_id] = scheduleEvents;
    });

    return scheduleEventListByDate;
  } catch (error) {
    console.log("error====================================>", error);
  }
};
