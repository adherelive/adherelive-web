import React from "react";

export default (props) => {
  const { vitalData } = props || {};
  const { remaining = 0, total = 0 } = vitalData || {};

  return <div>{`${total - remaining}/${total}`}</div>;
};
