import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  // const { transactionData } = props || {};
  // const { basic_info: { transaction_id } = {} } = transactionData || {};

  return (
    <div className="ellipsis wp100">
      <div className="wp100 fs16 fw700">
        {/* {transaction_id ? transaction_id : TABLE_DEFAULT_BLANK_FIELD} */}
        3400
      </div>
    </div>
  );
};
