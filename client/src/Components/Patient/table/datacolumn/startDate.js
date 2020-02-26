import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("28374 this.props --> ", props);
  const { treatmentData: { start_date } = {} } = props || {};

  return <div>{start_date ? start_date : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
