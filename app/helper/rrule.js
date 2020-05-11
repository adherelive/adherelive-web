import { RRule } from "rrule";
import { SUN, MON, TUE, WED, THU, FRI, SAT, REPEAT_TYPE } from "../../constant";

const RRULE_DAY_MAPPER = {
  [SUN]: RRule.SU,
  [MON]: RRule.MO,
  [TUE]: RRule.TU,
  [WED]: RRule.WE,
  [THU]: RRule.TH,
  [FRI]: RRule.FR,
  [SAT]: RRule.SA
};

const RRULE_FREQ_MAPPER = {
  [REPEAT_TYPE.DAILY]: RRule.DAILY,
  [REPEAT_TYPE.MONTHLY]: RRule.MONTHLY,
  [REPEAT_TYPE.WEEKLY]: RRule.WEEKLY,
  [REPEAT_TYPE.YEARLY]: RRule.YEARLY
};

export const getAllOccurrence = ({
  repeat,
  repeatInterval,
  repeatDays = [],
  startDate,
  endDate,
  startTime,
  endTime
}) => {
  if (repeat === REPEAT_TYPE.NONE) {
    return [{ startTime, endTime }];
  }

  let start_rule_options = {};
  let end_rule_options = {};

  switch (repeat) {
    case REPEAT_TYPE.WEEKLY:
      start_rule_options = {
        freq: RRULE_FREQ_MAPPER[repeat],
        interval: repeatInterval,
        byweekday: repeatDays.map(day => RRULE_DAY_MAPPER[day]),
        wkst: RRule.SU,
        dtstart: new Date(startTime),
        until: new Date(endDate)
      };
      end_rule_options = {
        freq: RRULE_FREQ_MAPPER[repeat],
        interval: repeatInterval,
        byweekday: repeatDays.map(day => RRULE_DAY_MAPPER[day]),
        wkst: RRule.SU,
        dtstart: new Date(endTime),
        until: new Date(endDate)
      };
      break;
    default:
      start_rule_options = {
        freq: RRULE_FREQ_MAPPER[repeat],
        interval: repeatInterval,
        dtstart: new Date(startTime),
        until: new Date(endDate)
      };
      end_rule_options = {
        freq: RRULE_FREQ_MAPPER[repeat],
        interval: repeatInterval,
        dtstart: new Date(endTime),
        until: new Date(endDate)
      };
      break;
  }

  const startRule = new RRule(start_rule_options);

  const endRule = new RRule(end_rule_options);

  console.log(startRule);

  const allStartDay = startRule.all();
  const allEndDay = endRule.all();

  const allEventsTime = [];

  allStartDay.forEach((nextDate, index) => {
    allEventsTime.push({ startTime: nextDate, endTime: allEndDay[index] });
  });

  return allEventsTime;
};
