import React from "react";
import { CONSULTATION_FEE_TYPE_TEXT } from "../../../../constant";

export default (props) => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
    } = {},
  } = props || {};

  return (
    <div>
      {/* <span> {CONSULTATION_FEE_TYPE_TEXT[type]}</span> */}
      <span> {type}</span>
    </div>
  );
};
