import React from "react";

export default (props) => {
  const { vitalTemplateData } = props || {};
  const { basic_info: { name } = {} } = vitalTemplateData || {};

  return <div>{name ? name : "--"}</div>;
};
