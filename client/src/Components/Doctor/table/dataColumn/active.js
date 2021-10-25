import React from "react";
import TableStatus from "../../../../Helper/TableStatus";

export default (props) => {
  const { userData } = props || {};
  const { deleted_at } = userData || {};

  let flag = true;
  if (deleted_at) {
    flag = false;
  }

  return (
    <div className="flex direction-row align-center">
      <TableStatus
        flag={flag}
        trueText={"ACTIVE"}
        falseText={"INACTIVE"}
        trueColor="green"
        falseColor="red"
      />
    </div>
  );
};
