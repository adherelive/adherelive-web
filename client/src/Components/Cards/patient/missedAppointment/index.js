import React from "react";
import moment from "moment";
import messages from "../messages";

const getTimings = (timings) => {
  // console.log("876324237483294",timings);

  return timings.map((time) => {
    return <div>{moment(time).format("Do MMM  (hh:mm A)")}</div>;
  });
};

export default (props) => {
  const { formatMessage, onClick, name, time, treatment_type } = props;
  return (
    <div className="bw-cool-grey br5 mb10 p10">
      <div className="fs18 fw700 pointer black-85" onClick={onClick}>
        {name}
      </div>

      <div className="fs14 fw600 brown-grey mb20 italic">{treatment_type}</div>

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
