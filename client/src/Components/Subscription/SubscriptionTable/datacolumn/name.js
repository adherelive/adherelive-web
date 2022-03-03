import React from "react";

export default (props) => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
    } = {},
  } = props || {};

  return (
    <div>
      {/* <span> {name}</span> */}
      <span> Health lite (plan)</span>
    </div>
  );
};
