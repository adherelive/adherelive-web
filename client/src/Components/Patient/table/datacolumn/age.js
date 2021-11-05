import React from "react";

export default (props) => {
  const { patientData: { basic_info: { age } = {} } = {} } = props || {};

  return <div>{age ? age : "--"}</div>;
};
