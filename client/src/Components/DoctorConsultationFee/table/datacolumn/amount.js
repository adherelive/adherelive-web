import React from "react";

export default (props) => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
    } = {},
  } = props || {};

  return (
    <div>
      <span>{`Rs ${amount}`}</span>
    </div>
  );
};
