import React from "react";
import messages from "../messages";

export default (props) => {
  const {
    dietData: { basic_info: { name } = {}, expired_on = null } = {},
    formatMessage,
  } = props || {};
  return (
    <div className="flex direction-column  ">
      <div>{name}</div>
      {expired_on && <div>{`(${formatMessage(messages.deactivated)})`}</div>}
    </div>
  );
};
