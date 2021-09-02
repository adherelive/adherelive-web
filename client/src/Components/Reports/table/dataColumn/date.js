import React from "react";
import moment from "moment";

export default ({ reportData }) => {
  const { test_date } = reportData || {};
  return <div className="fs16 fw700">{moment(test_date).format("DD/MM")}</div>;
};
