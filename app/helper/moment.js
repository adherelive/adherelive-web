import moment from "moment";

/*
date: moment,
dateToChangeDate: moment

return changedDate : moment
 */
export function changeDate(old_date, date_to_change) {
  const dateString = new moment(old_date).format("LL");
  const timeString = new moment(date_to_change).format("LT");

  const new_date = new moment(
    `${dateString}:${timeString}`,
    "LL:LT"
  ).toISOString();

  return new_date;
}
