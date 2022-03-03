import React from "react";

export default (props) => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
    } = {},
  } = props || {};

  return (
    <div>
      {/* <span>{`Rs ${amount}`}</span> */}
      <span>
        4 months <br></br> 21 Mar 22 - 21 Jun 22
      </span>
    </div>
  );
};
