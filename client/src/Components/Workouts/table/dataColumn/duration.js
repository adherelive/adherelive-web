import React from "react";
import moment from "moment";

export default (props) => {
  const { workoutData: { end_date = "" } = {} } = props || {};
  return (
    <div>{end_date ? `Till ${moment(end_date).format("DD MMMM")}` : "--"}</div>
  );
};
