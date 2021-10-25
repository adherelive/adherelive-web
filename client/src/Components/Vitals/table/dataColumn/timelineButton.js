import React from "react";
import { FieldTimeOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";
import messages from "../messages";

export default (props) => {
  const { action, formatMessage, id } = props || {};

  return (
    <Tooltip
      placement="bottom"
      title={formatMessage(messages.response_timeline)}
    >
      <div className="p10" onClick={action(id)}>
        <FieldTimeOutlined className="flex align-center justify-center" />
      </div>
    </Tooltip>
  );
};
