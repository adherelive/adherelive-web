// import moment from "moment";
const moment = require("moment");

const REPEAT_DAYS = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly"
};

function* nextEventTime(startDate, endDate, repeatInterval, listOfDays) {
  const noOfDaysInWeek = 7;
  let noOfDays = 0;
  let curr = 0;
  const next = moment(startDate)
    .clone()
    .startOf("day");
  const totalNoOfDays = listOfDays.length;
  const daysMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };
  while (true) {
    const startTime_copy = next.clone();
    const nextValidDay = startTime_copy
      .day(daysMap[listOfDays[curr]] + noOfDays)
      .clone();

    if (curr + 1 === totalNoOfDays) {
      noOfDays = noOfDays + repeatInterval * noOfDaysInWeek;
    }
    curr = (curr + 1) % totalNoOfDays;
    yield {
      startTime: nextValidDay
        .clone()
        .startOf("day")
        .clone(),
      endTime: nextValidDay
        .clone()
        .endOf("day")
        .clone(),
      valid: next <= nextValidDay
    };
  }
}

const getWeeklyRepeatEventDaysList = async (
  startDate,
  endDate,
  repeatInterval,
  listOfDays
) => {
  const eventGenartor = await nextEventTime(
    startDate,
    endDate,
    repeatInterval,
    listOfDays
  );
  let events = [];
  const lastValidDate = moment(endDate);
  while (true) {
    const event = eventGenartor.next().value;
    const { startTime, endTime, valid } = event;
    if (endTime < lastValidDate) {
      if (valid) {
        events.push({ startDate: startTime, endDate: endTime });
      }
    } else {
      break;
    }
  }
  return events;
};

const getMonthlyRepeatEventDaysList = async (
  startDate,
  endDate,
  repeatInterval
) => {
  let eventDaysList = [];
  let nextDate = moment(startDate).clone();
  const lastDate = moment(endDate);
  while (nextDate < lastDate) {
    const start = nextDate.clone().startOf("day");
    const end = nextDate.clone().endOf("day");
    eventDaysList.push({ startDate: start, endDate: end });
    nextDate = nextDate.add(repeatInterval, "M");
  }
  return eventDaysList;
};

const getYearlyRepeatEventDaysList = async (
  startDate,
  endDate,
  repeatInterval
) => {
  let eventDaysList = [];

  let nextDate = moment(startDate).clone();
  const lastDate = moment(endDate);

  while (nextDate < lastDate) {
    const start = nextDate.clone().startOf("day");
    const end = nextDate.clone().endOf("day");
    eventDaysList.push({ startDate: start, endDate: end });
    nextDate = nextDate.add(repeatInterval, "y");
  }
  return eventDaysList;
};

const getDailyRepeatEventDaysList = async (startDate, endDate) => {
  return [{ startDate, endDate }];
};

const getNoRepeatEventDaysList = async (startDate, endDate) => {
  return [{ startDate, endDate }];
};

const getEventDaysList = async data => {
  const {
    startDate,
    endDate,
    startTime,
    endTime,
    repeat,
    repeatInterval: interval,
    repeatDays: repeatDayStr = ""
  } = data;
  const repeatDays = repeatDayStr.split(",");
  let eventDaysList = [];
  const repeatInterval = Number(interval);
  try {
    switch (repeat) {
      case REPEAT_DAYS.NONE:
        eventDaysList = await getNoRepeatEventDaysList(startDate, endDate);
        break;
      case REPEAT_DAYS.DAILY:
        eventDaysList = await getDailyRepeatEventDaysList(startDate, endDate);
        break;
      case REPEAT_DAYS.WEEKLY:
        eventDaysList = await getWeeklyRepeatEventDaysList(
          startDate,
          endDate,
          repeatInterval,
          repeatDays
        );
        break;
      case REPEAT_DAYS.MONTHLY:
        eventDaysList = await getMonthlyRepeatEventDaysList(
          startDate,
          endDate,
          repeatInterval
        );
        break;
      case REPEAT_DAYS.YEARLY:
        eventDaysList = await getYearlyRepeatEventDaysList(
          startDate,
          endDate,
          repeatInterval
        );
        break;
      default:
        break;
    }
  } catch (err) {}

  console.log("eventDaysList :", eventDaysList);

  return eventDaysList;
};

module.exports = getEventDaysList;
