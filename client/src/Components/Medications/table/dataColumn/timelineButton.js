import React from "react";
import { FieldTimeOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";
import messages from "../messages";

export default (props) => {
  console.log("TIMELINE BTN MED PROPS", props);
  const { openResponseDrawer, formatMessage, id } = props || {};

  // AKSHAY NEW CODE IMPLEMENTATIONS
  const { medicationData } = props || {};
  const { remaining = 0, total = 0 } = medicationData || {};

  return (
    <Tooltip
      placement="bottom"
      title={formatMessage(messages.response_timeline)}
    >
      <div className="p10" onClick={openResponseDrawer(id)}>
        {/* <FieldTimeOutlined className="flex align-center justify-center" /> */}
        {/* AKSHAY NEW CODE IMPLEMENTATIONS */}
        <div className="ml10">{`${total - remaining}/${total}`}</div>
      </div>
    </Tooltip>
  );
};
