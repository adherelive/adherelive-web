import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("treatmentData this.props --> ", props);
  const { treatmentData: { basic_info: { severity_level } = {} } = {} } =
    props || {};

  return (
    <div>{severity_level ? severity_level : TABLE_DEFAULT_BLANK_FIELD}</div>
  );
};
