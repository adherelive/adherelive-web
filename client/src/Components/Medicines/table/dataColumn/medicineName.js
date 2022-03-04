import React from "react";

export default (props) => {
  const { medicineData: { basic_info: { name = "" } = {} } = {} } = props || {};

  return <div className="fs16 fw700">{name ? name : "--"}</div>;
};
