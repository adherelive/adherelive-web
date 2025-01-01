import Controller from "../index";

import {
  BREAKFAST,
  DINNER,
  EVENING,
  LUNCH,
  SLEEP,
  WAKE_UP,
} from "../../../constant";
import moment from "moment";

export const getTimings = (timings) => {
  let formattedTimings = [];

  Object.keys(timings).forEach((id) => {
    const { value } = timings[id] || {};

    switch (id) {
      case WAKE_UP:
        formattedTimings.push({
          text: "After Wake Up",
          time: moment(value).toISOString(),
        });
        break;
      case SLEEP:
        formattedTimings.push({
          text: "Before Sleep",
          time: moment(value).toISOString(),
        });
        break;
      case BREAKFAST:
        formattedTimings.push(
          {
            text: "Before Breakfast",
            time: moment(value).subtract(30, "minutes").toISOString(),
          },
          {
            text: "After Breakfast",
            time: moment(value).add(30, "minutes").toISOString(),
          }
        );
        break;
      case LUNCH:
        formattedTimings.push(
          {
            text: "Before Lunch",
            time: moment(value).subtract(30, "minutes").toISOString(),
          },
          {
            text: "With Lunch",
            time: moment(value).toISOString(),
          },
          {
            text: "After Lunch",
            time: moment(value).add(30, "minutes").toISOString(),
          }
        );
        break;
      case EVENING:
        formattedTimings.push(
          {
            text: "Before Evening Snacks",
            time: moment(value).subtract(30, "minutes").toISOString(),
          },
          {
            text: "After Evening Snacks",
            time: moment(value).add(30, "minutes").toISOString(),
          }
        );
        break;
      case DINNER:
        formattedTimings.push(
          {
            text: "Before Dinner",
            time: moment(value).subtract(30, "minutes").toISOString(),
          },
          {
            text: "With Dinner",
            time: moment(value).toISOString(),
          },
          {
            text: "After Dinner",
            time: moment(value).add(30, "minutes").toISOString(),
          }
        );
        break;
    }
  });

  return formattedTimings;
};
