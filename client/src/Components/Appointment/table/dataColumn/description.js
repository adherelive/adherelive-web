import React from "react";
import moment from "moment";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("28374 this.props --> ", props);
  const { appointmentData } = props || {};
  const { basic_info: { description } = {} } = appointmentData || {};

  return <div>{description ? description : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
