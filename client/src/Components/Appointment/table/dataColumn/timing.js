import React from "react";
import moment from "moment";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("28374 this.props --> ", props);
  const { appointmentData } = props || {};
  const { basic_info: { details: { start_time, end_time } = {} } = {} } =
    appointmentData || {};

  return (
    <div>{`${moment(start_time).format("hh:mm a")} - ${moment(end_time).format(
      "hh:mm a"
    )}`}</div>
  );
};
