import React from "react";
import { FieldTimeOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";
import messages from "../messages";

export default (props) => {
  console.log("TIMELINE BTN MED PROPS", props);
  const { openResponseDrawer, formatMessage, id } = props || {};

  return (
    <Tooltip
      placement="bottom"
      title={formatMessage(messages.response_timeline)}
    >
      <div className="p10" onClick={openResponseDrawer(id)}>
        <FieldTimeOutlined className="flex align-center justify-center" />
      </div>
    </Tooltip>
  );
};
