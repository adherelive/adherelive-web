import React from "react";

export default props => {
  const { appointmentData } = props || {};
  const { basic_info: { description } = {} } = appointmentData || {};
  console.log("18237183 this.props --> ", appointmentData.basic_info.description);


  return <div>{description ? description : "--"}</div>;
};
