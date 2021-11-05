import React from "react";

export default (props) => {
  const { vitalData } = props || {};
  const { description = "" } = vitalData || {};

  return <div>{description ? description : "--"}</div>;
};
