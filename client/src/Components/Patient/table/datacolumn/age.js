import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("28374 this.props --> ", props);
  const { patientData: { basic_info: { age } = {} } = {} } = props || {};

  return <div>{age ? age : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
