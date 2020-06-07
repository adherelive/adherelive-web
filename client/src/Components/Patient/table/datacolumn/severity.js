import React from "react";
import {
  TABLE_DEFAULT_BLANK_FIELD,
  SEVERITY_STATUS
} from "../../../../constant";

export default props => {
  console.log("123891 treatmentData this.props --> ", props);
  const { treatmentData: { severity_level } = {} } = props || {};

  return (
    <div className="wp100 flex align-center">
      <div
        className={`w10 h10 br50 bg-${SEVERITY_STATUS[severity_level].color}`}
      ></div>
      <div className="ml10">
        {severity_level
          ? SEVERITY_STATUS[severity_level].text
          : TABLE_DEFAULT_BLANK_FIELD}
      </div>
    </div>
  );
};
