import React from "react";
import moment from "moment";
import messages from "../messages";

const getTimings = (timings = {}) => {
  return Object.keys(timings).map((date) => {
    const startTimeArray = timings[date] || {};
    const timesArr = startTimeArray.map((timeObj) => {
      const { end_time } = timeObj || {};
      return moment(end_time).format("hh:mm A");
    });
    return (
      <div className="flex wp100">
        <div className="pr6 wp20">{moment(date).format("Do MMM")}</div>
        <div className="wp80">{`(${timesArr.join(", ")})`}</div>
      </div>
    );
  });
};

export default (props) => {
  const { formatMessage, onClick, name, time, vital } = props;
  return (
    <div className="bw-cool-grey br5 mb10 p10">
      <div className="fs18 fw700 pointer black-85" onClick={onClick}>
        {name}
      </div>

      <div className="fs14 fw600 brown-grey mb20 italic">{vital}</div>

      <div className="fs14 fw700 black-65 mb5">
        {formatMessage(messages.missed_timings)}
      </div>

      {/*  todo: change the time array once driven from events & backend updated  */}
      <div className="flex direction-column align-start">
        {getTimings(time)}
      </div>
    </div>
  );
};
