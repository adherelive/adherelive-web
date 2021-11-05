import React from "react";

export default (props) => {
  const { userData } = props || {};
  const { basic_info: { full_name } = {} } = userData || {};

  return <div>{full_name}</div>;
};
