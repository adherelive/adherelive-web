import React from "react";
import moment from "moment";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const { patientData: { created_at = "" } = {} } = props || {};

  return (
    <div>
      {created_at
        ? moment(created_at).format("Do MMM, hh:mm A")
        : TABLE_DEFAULT_BLANK_FIELD}
    </div>
  );
};
