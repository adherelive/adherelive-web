import React from "react";

export default (props) => {
  const { dietData: { basic_info: { total_calories } = {} } = {} } =
    props || {};
  return <div>{total_calories ? `${total_calories}${" "}Cal` : "--"}</div>;
};
