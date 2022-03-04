import React from "react";
import edit_image from "../../../../Assets/images/edit.svg";
import messages from "../messages";
import Tooltip from "antd/es/tooltip";
import EyeFilled from "@ant-design/icons/EyeFilled";

export default (props) => {
  const { action, id, formatMessage, canViewDetails = false } = props || {};

  const { dietData: { expired_on = null } = {} } = props || {};
  return (
    <Tooltip
      placement="bottom"
      title={
        expired_on || canViewDetails
          ? formatMessage(messages.view)
          : formatMessage(messages.edit)
      }
    >
      <div className="p10" onClick={action(id)}>
        <div className="flex align-center justify-center">
          {expired_on || canViewDetails ? (
            <EyeFilled
              className="w20"
              className={"del doc-opt"}
              style={{ fontSize: "18px", color: "#1890ff" }}
            />
          ) : (
            <img src={edit_image} alt="edit button" />
          )}
        </div>
      </div>
    </Tooltip>
  );
};
