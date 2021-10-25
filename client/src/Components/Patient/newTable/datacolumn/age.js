import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const { patientData: { basic_info: { age } = {} } = {} } = props || {};

  return <div>{age ? age : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
