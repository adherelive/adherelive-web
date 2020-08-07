import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD, CONDITIONS } from "../../../../constant";

export default props => {
  console.log("283we74 this.props --> ", props);
  const { patientData: { condition } = {} } = props || {};
  // const { value } = CONDITIONS[condition] || {};

  return <div>{condition ? condition : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
