import React from "react";
import { EditOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";

import messages from "../messages";

export default (props) => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
      editDoctorProduct,
      formatMessage,
    } = {},
  } = props || {};

  const { data: { doctors: { provider_id } = {} } = {} } = props;

  // console.log("5464564564645654",provider_id);

  if (provider_id) {
    return null;
  }

  return (
    <Tooltip
      placement={"bottom"}
      title={formatMessage(messages.editConsultationFee)}
    >
      <EditOutlined
        className={"pointer align-self-end"}
        onClick={editDoctorProduct(id)}
        style={{ fontSize: "18px", color: "#6d7278" }}
      />
    </Tooltip>
  );
};
