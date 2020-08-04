import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  const { patientData: { condition } = {} } = props || {};
  // const { value } = CONDITIONS[condition] || {};

  return <div>{condition ? condition : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
