import React from "react";
import moment from "moment";

export default (props) => {
  const { appointmentData } = props || {};
  const { basic_info: { start_time, end_time } = {} } = appointmentData || {};

  return (
    <div>{`${moment(start_time).format("hh:mm a")} - ${moment(end_time).format(
      "hh:mm a"
    )}`}</div>
  );
};
