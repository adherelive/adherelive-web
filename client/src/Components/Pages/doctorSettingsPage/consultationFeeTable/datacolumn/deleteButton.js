import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import messages from "../messages";
import Tooltip from "antd/es/tooltip";

export default (props) => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
      deleteDoctorProduct,
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
      title={formatMessage(messages.deleteConsultationFee)}
    >
      <DeleteOutlined
        className={"pointer align-self-end"}
        onClick={deleteDoctorProduct(id, name, type, amount)}
        style={{ fontSize: "18px", color: "#6d7278" }}
      />
    </Tooltip>
  );
};
