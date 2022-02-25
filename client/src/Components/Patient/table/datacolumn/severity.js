import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const { carePlanData: { severity = "" } = {} } = props || {};

  return (
    <div className="wp100 flex align-center">
      <div className={`w10 h10 br50 bg-${severity ? severity : ""}`}></div>
      <div className="ml0">
        {severity ? severity : TABLE_DEFAULT_BLANK_FIELD}
      </div>
    </div>
  );
};
