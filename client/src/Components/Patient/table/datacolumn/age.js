import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  const { patientData: { basic_info: { age } = {}, details = {} } = {} } = props || {};

  let { age_type = '' } = details || {};
  return <div>{age ? age : ''}</div>;
};
