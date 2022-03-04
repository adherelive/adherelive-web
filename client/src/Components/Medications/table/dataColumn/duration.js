import React from "react";
import moment from "moment";

export default (props) => {
  const { medicationData: { basic_info: { end_date } = {} } = {} } =
    props || {};
  return (
    <div>{end_date ? `Till ${moment(end_date).format("DD MMMM")}` : "--"}</div>
  );
};
