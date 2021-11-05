import React from "react";

export default (props) => {
  const { appointmentData } = props || {};
  const { basic_info: { description } = {} } = appointmentData || {};

  return <div>{description ? description : "--"}</div>;
};
