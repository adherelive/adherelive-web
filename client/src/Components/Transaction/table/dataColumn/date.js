import React from "react";
import moment from "moment";

export default (props) => {
  const { transactionData } = props || {};
  const { updated_at = "" } = transactionData || {};

  return (
    <div className="fs16 fw700">
      {moment(updated_at).format("Do MMM, hh:mm A")}
    </div>
  );
};
