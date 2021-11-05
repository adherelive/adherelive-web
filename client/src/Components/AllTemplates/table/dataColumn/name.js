import React from "react";

export default (props) => {
  const { templateData: { basic_info: { name = "" } = {} } = {} } = props || {};

  return <div className="fs18 fw600">{name ? name : "--"}</div>;
};
