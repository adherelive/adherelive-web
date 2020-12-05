import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import messages from "../messages";
import Tooltip from "antd/es/tooltip";

export default props => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
      deleteDoctorProduct,
        formatMessage
    } = {}
  } = props || {};

  return (
      <Tooltip placement={"bottom"} title={formatMessage(messages.deleteConsultationFee)}>
          <DeleteOutlined
            className={"pointer align-self-end"}
            onClick={deleteDoctorProduct(id, name, type, amount)}
            style={{ fontSize: "18px", color: "#6d7278" }}
          />
      </Tooltip>
  );
};
