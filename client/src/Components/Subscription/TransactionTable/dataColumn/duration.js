import React from "react";
import moment from "moment";

export default (props) => {
  // const { transactionData } = props || {};
  // const { updated_at = "" } = transactionData || {};

  return (
    <div className="ellipsis wp100 flex direction-column  ">
      <div className="wp100 fs16 fw600">
        {/* {name ? `${name}` : TABLE_DEFAULT_BLANK_FIELD} */}4 Months
      </div>
      <div className="wp100 ">
        {/* {feeType ? `${feeType}` : TABLE_DEFAULT_BLANK_FIELD} */}
        27 Jan 22 - 27 Jan 22
      </div>
    </div>
  );
};
