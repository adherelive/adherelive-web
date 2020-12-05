import React from "react";
import { EditOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";

import messages from "../messages";

export default props => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
      editDoctorProduct,
        formatMessage
    } = {}
  } = props || {};

  return (
      <Tooltip placement={"bottom"} title={formatMessage(messages.editConsultationFee)}>
        <EditOutlined
            className={"pointer align-self-end"}
            onClick={editDoctorProduct(id)}
            style={{ fontSize: "18px",color: "#6d7278" }}
        />
      </Tooltip>
  );
};
