import React from "react";
import moment from "moment";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const { carePlanData: { activated_on } = {} } = props || {};

  return (
    <div>
      {activated_on
        ? moment(activated_on).format("Do MMM YYYY")
        : TABLE_DEFAULT_BLANK_FIELD}
    </div>
  );
};
