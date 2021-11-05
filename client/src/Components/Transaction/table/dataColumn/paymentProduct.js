import React from "react";
import {
  TABLE_DEFAULT_BLANK_FIELD,
  CONSULTATION_FEE_TYPE_TEXT,
} from "../../../../constant";

export default (props) => {
  const { paymentProductData } = props || {};
  const { basic_info: { name, type = "" } = {} } = paymentProductData || {};

  const feeType = CONSULTATION_FEE_TYPE_TEXT[type];

  return (
    <div className="ellipsis wp100 flex direction-column  ">
      <div className="wp100 fs16 fw600">
        {name ? `${name}` : TABLE_DEFAULT_BLANK_FIELD}
      </div>
      <div className="wp100 ">
        {feeType ? `${feeType}` : TABLE_DEFAULT_BLANK_FIELD}
      </div>
    </div>
  );
};
