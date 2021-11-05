import React from "react";
import Tooltip from "antd/es/tooltip";
import edit_image from "../../../../Assets/images/edit.svg";

export default (props) => {
  const { openEditProviderDrawer } = props;
  const { basic_info: { id: provider_id } = {} } = props || {};

  return (
    <Tooltip
      placement={"bottom"}
      className={"pointer"}
      style={{ fontSize: "18px", color: "#6d7278" }}
    >
      <div
        className="wp100 flex justify-center"
        onClick={openEditProviderDrawer({ provider_id })}
      >
        <img src={edit_image} className="edit-patient-icon" />
      </div>
    </Tooltip>
  );
};
