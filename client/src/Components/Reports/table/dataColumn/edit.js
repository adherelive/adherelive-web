import React from "react";
import edit_image from "../../../../Assets/images/edit.svg";
import messages from "../message";
import Tooltip from "antd/es/tooltip";

export default (props) => {
  const {
    openEditDrawer,
    id,
    formatMessage,
    reportData,
    uploaderData,
    documentData,
  } = props || {};

  return (
    <Tooltip placement="bottom" title={formatMessage(messages.edit)}>
      <div
        className="p10"
        onClick={openEditDrawer({
          id,
          reportData,
          uploaderData,
          documentData,
          report_id: id,
        })}
      >
        <div className="flex align-center justify-center">
          <img src={edit_image} alt="edit button" />
        </div>
      </div>
    </Tooltip>
  );
};
