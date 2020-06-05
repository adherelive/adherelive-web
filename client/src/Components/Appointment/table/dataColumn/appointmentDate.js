import React from "react";
import moment from "moment";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("28374 this.props --> ", props);
  const { appointmentData } = props || {};
  const { basic_info: { start_date } = {} } = appointmentData || {};

  return (
    <div>
      {start_date
        ? `${moment(start_date).format("DD-MM-YYYY")}`
        : TABLE_DEFAULT_BLANK_FIELD}
    </div>
  );
};
