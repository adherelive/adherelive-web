import React from "react";
import edit_image from "../../../../Assets/images/edit.svg";
import messages from "../messages";
import Tooltip from "antd/es/tooltip";

export default props => {
  const { action, id, formatMessage } = props || {};

  return (
    <div onClick={action(id)}>
      <Tooltip placement="bottom" title={formatMessage(messages.edit)}>
          <div className="flex align-center justify-center">
              <img src={edit_image} alt="edit button" />
          </div>
      </Tooltip>
    </div>
  );
};
