import React from "react";
import moment from "moment";

export default (props) => {
  const { patientData: { created_at = "" } = {} } = props || {};

  return (
    <div>
      {created_at ? moment(created_at).format("Do MMM, hh:mm A") : "--"}
    </div>
  );
};
