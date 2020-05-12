import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("283724 this.props --> ", props);
  const { treatmentData } = props || {};
  const { basic_info: { treatment_type } = {} } = treatmentData || {};

  return (
    <div>{treatment_type ? treatment_type : TABLE_DEFAULT_BLANK_FIELD}</div>
  );
};
