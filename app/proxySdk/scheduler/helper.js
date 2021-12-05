import {REPEAT_TYPE} from "../../../constant";

const moment = require("moment");

const isBeforeOffset = (date) => {
  const hh = date.format("HH");
  const mm = date.format("mm");
  const offset = process.config.UTC_OFFSET_STR.split(":");
  console.log(
    "first: ",
    (24 - hh) * 60 + mm,
    "second: ",
    offset[0] * 60 + offset[1]
  );
  //return hh * 60 + mm <= offset[0] * 60 + offset[1];
  return Number((24 - hh) * 60 + mm) <= Number(offset[0] * 60 + offset[1]);
};

function* nextEventTime(
  eventStartTime,
  eventEndTime,
  repeatInterval,
  listOfDays
) {
  const noOfDaysInWeek = 7;
  
  //for next day
  let noOfDays = 0;
  let curr = 0;
  const startTime = moment.utc(eventStartTime);
  const endTime = moment.utc(eventEndTime);
  const totalNoOfDays = listOfDays.length;
  const daysMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  while (true) {
    const startTime_copy = startTime.clone();
    const endTime_copy = endTime.clone();
    const start = startTime_copy
      .day(daysMap[listOfDays[curr]] + noOfDays)
      .clone();
    const end = endTime_copy.day(daysMap[listOfDays[curr]] + noOfDays).clone();
    
    if (curr + 1 === totalNoOfDays) {
      noOfDays = noOfDays + repeatInterval * noOfDaysInWeek;
    }
    curr = (curr + 1) % totalNoOfDays;
    yield {startTime: start, endTime: end, valid: startTime <= start};
  }
}

const getEventListByWeekly = async ({
                                      startDate,
                                      endDate,
                                      eventStartTime,
                                      eventEndTime,
                                      repeatInterval,
                                      listOfDays,
                                    }) => {
  console.log("start------------------------------------", eventStartTime);
  const eventGenartor = await nextEventTime(
    eventStartTime,
    eventEndTime,
    repeatInterval,
    listOfDays
  );
  
  let events = [];
  const endOfEndDate = endDate.clone().endOf("day");
  while (true) {
    const event = eventGenartor.next().value;
    const {startTime, endTime, valid} = event;
    if (endTime <= endOfEndDate) {
      if (valid) {
        events.push({startTime: startTime, endTime: endTime});
      }
    } else {
      break;
    }
  }
  
  return events.map((eventDate) => {
    let start = eventDate.startTime;
    let end = eventDate.endTime;
    
    if (isBeforeOffset(start)) {
      start = start.clone().subtract({days: 1});
    }
    if (isBeforeOffset(end)) {
      end = end.clone().subtract({days: 1});
    }
    
    return {startTime: start, endTime: end};
  });
};

function getAllEventList({
                           startDate,
                           endDate,
                           eventStartTime,
                           eventEndTime,
                           toAdd,
                         }) {
  let startTime = eventStartTime.clone();
  let endTime = eventEndTime.clone();
  const list = [];
  
  for (let next = startDate; next < endDate; next = next.add(toAdd)) {
    list.push({
      startTime,
      endTime,
    });
    startTime = startTime.clone().add(toAdd);
    endTime = endTime.clone().add(toAdd);
  }
  return list;
}

function getEventList({
                        startDate,
                        endDate,
                        repeat,
                        eventStartTime,
                        eventEndTime,
                        repeatInterval,
                        listOfDays,
                      }) {
  switch (repeat) {
    case REPEAT_TYPE.NONE:
      return [{startTime: eventStartTime, endTime: eventEndTime}];
    case REPEAT_TYPE.WEEKLY:
      return getEventListByWeekly({
        startDate,
        endDate,
        eventStartTime,
        eventEndTime,
        repeatInterval,
        listOfDays,
      });
    case REPEAT_TYPE.DAILY:
      return getAllEventList({
        startDate,
        endDate,
        eventStartTime,
        eventEndTime,
        toAdd: {days: 1},
      });
    case REPEAT_TYPE.MONTHLY:
      return getAllEventList({
        startDate,
        endDate,
        eventStartTime,
        eventEndTime,
        toAdd: {months: repeatInterval},
      });
    case REPEAT_TYPE.YEARLY:
      return getAllEventList({
        startDate,
        endDate,
        eventStartTime,
        eventEndTime,
        toAdd: {years: repeatInterval},
      });
    default:
      return [];
  }
}

module.exports = getEventList;
