import React from "react";
import Button from "antd/es/button";
import message from "antd/es/message";
import { CopyOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";

export default (props) => {
  const { id, duplicateCareplanTemplate } = props || {};

  const handleCreateDuplicate = async (e) => {
    e.preventDefault();
    try {
      const response = await duplicateCareplanTemplate(id);
      const {
        payload: { data = {}, message: resp_message = "" } = {},
        status,
        statusCode,
      } = response;
      if (status) {
        message.success(resp_message);
      }
    } catch (error) {
      console.log("error ===>", error);
      message.warn(error);
    }
  };

  return (
    <div className="fs18 fw600">
      <Tooltip title="Duplicate Template">
        <CopyOutlined
          type="default"
          className="tab-color"
          onClick={handleCreateDuplicate}
        />
      </Tooltip>
    </div>
  );
};
