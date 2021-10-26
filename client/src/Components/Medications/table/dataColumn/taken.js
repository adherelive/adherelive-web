import React from "react";

export default (props) => {
  const { medicationData } = props || {};
  const { remaining = 0, total = 0 } = medicationData || {};
  // console.log("56354323543674563453",medicationData);

  return <div className="ml10">{`${total - remaining}/${total}`}</div>;
};
