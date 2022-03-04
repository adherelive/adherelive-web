import React from "react";
import moment from "moment";

export default (props) => {
  const { medicineData = {} } = props || {};
  const { updated_at = "" } = medicineData || {};

  return (
    <div>
      {updated_at ? moment(updated_at).format("Do MMM, hh:mm A") : "--"}
    </div>
  );
};
