import React from "react";
import { Icon } from "antd";

import {
  MEDICATION_TIMING,
  DAYS_TEXT_NUM_SHORT,
  EVENT_TYPE,
  MEDICATION_TIMING_HOURS,
  MEDICATION_TIMING_MINUTES,
  TABLET,
  SYRUP,
  MEDICINE_FORM_TYPE,
} from "../../../../constant";
import moment from "moment";
import TabletIcon from "../../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../../Assets/images/injectionIcon3x.png";
import SyrupIcon from "../../../../Assets/images/pharmacy.png";

export default (props) => {
  const {
    template_medication_ids,
    medicationsData = {},
    medicines = {},
  } = props;
  //   const { medicationsData : { basic_info: { medicine_id  = '' } = {} } = {}  , template_medication_ids } = props || {};

  let meds = [];
  let medCount = 0;
  let medMore = 0;

  for (let key of template_medication_ids) {
    if (medCount === 1) {
      medMore = template_medication_ids.length - medCount;
      break;
    }
    let {
      basic_info: { medicine_id = "" } = {},
      schedule_data: {
        when_to_take = "",
        start_date = moment(),
        medicine_type = "1",
        repeat_days = [],
      } = {},
    } = medicationsData[key];
    const medicineType = MEDICINE_FORM_TYPE[medicine_type] || "";
    const { basic_info: { name: medicine = "" } = {} } =
      medicines[medicine_id] || {};
    when_to_take.sort();
    let nextDueTime = moment().format("HH:MM A");
    let closestWhenToTake = 0;
    let minDiff = 0;
    const date = moment();
    const dow = date.day();
    let dayNum = dow;

    if (
      typeof DAYS_TEXT_NUM_SHORT[dow] !== "undefined" &&
      !repeat_days.includes(DAYS_TEXT_NUM_SHORT[dow])
    ) {
      while (
        typeof DAYS_TEXT_NUM_SHORT[dayNum] !== "undefined" &&
        !repeat_days.includes(DAYS_TEXT_NUM_SHORT[dayNum])
      ) {
        if (dayNum > 7) {
          dayNum = 1;
        } else {
          dayNum++;
        }
      }
      start_date = moment().isoWeekday(dayNum);
    }

    if (moment(start_date).isSame(moment(), "D")) {
      for (let wtt of when_to_take) {
        let newMinDiff = moment()
          .set({
            hour: MEDICATION_TIMING_HOURS[wtt],
            minute: MEDICATION_TIMING_MINUTES[wtt],
          })
          .diff(moment());
        minDiff =
          minDiff === 0 && newMinDiff > 0
            ? newMinDiff
            : newMinDiff > 0 && newMinDiff < minDiff
            ? newMinDiff
            : minDiff;
        closestWhenToTake = minDiff === newMinDiff ? wtt : closestWhenToTake;
      }
    }
    let medTimingsToShow = "";
    let count = 0;
    let more = 0;
    for (let wtt in when_to_take) {
      if (count === 1) {
        more = when_to_take.length - count;
        break;
      }
      count += 1;
      medTimingsToShow += `${MEDICATION_TIMING[when_to_take[wtt]].text} `;
      medTimingsToShow += `(${MEDICATION_TIMING[when_to_take[wtt]].time})${
        wtt < when_to_take.length - 1 ? ", " : ""
      }`;
    }
    // nextDueTime = MEDICATION_TIMING[closestWhenToTake ? closestWhenToTake : '4'].time;

    // let nextDue = moment(start_date).isSame(moment(), 'D') ? `Today at ${nextDueTime}` : `${moment(start_date).format('D MMM')} at ${MEDICATION_TIMING[when_to_take[0]].time}`;

    meds.push(
      <div className="flex wp100 align-center " key={key}>
        <div className="flex direction-column mb10">
          <div className="flex align-center">
            <div className="fs18 fw600">{medicine ? medicine : "MEDICINE"}</div>
            {medicineType && (
              <img
                src={
                  medicine_type === TABLET
                    ? TabletIcon
                    : medicine_type === SYRUP
                    ? SyrupIcon
                    : InjectionIcon
                }
                className={"medication-image-tablet"}
              />
            )}
          </div>
          <div className="flex direction-column">
            {medTimingsToShow}
            {more > 0 ? `+${more} more` : ""}
          </div>

          {/* <div className=''>{`Next due: ${nextDue}`}</div> */}
        </div>
      </div>
    );
    medCount += 1;
  }

  if (medMore > 0) {
    meds.push(<div className="fs16 fw700">{`+ ${medMore} more`}</div>);
  }

  return meds;
};
