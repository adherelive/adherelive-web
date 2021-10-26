import React from "react";
import TableStatus from "../../../../Helper/TableStatus";
import { TABLE_STATUS } from "../../../../constant";

export default (props) => {
  const { transactionData } = props || {};
  const { status = "" } = transactionData || {};

  const type = TABLE_STATUS.TRANSACTION_TABLE;
  const displayProps = {
    status,
    type,
  };

  return (
    <div className="ellipsis wp100  ">
      <div className="wp100 ">
        <TableStatus displayProps={displayProps} />
      </div>
    </div>
  );
};
