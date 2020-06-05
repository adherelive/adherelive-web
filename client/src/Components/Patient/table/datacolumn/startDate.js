import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  const { treatmentData: { start_date } = {} } = props || {};

  return <div>{start_date ? start_date : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
