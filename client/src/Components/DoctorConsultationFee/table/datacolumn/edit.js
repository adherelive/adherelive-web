import React from "react";
import { EditOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";

import messages from "../messages";
import { USER_CATEGORY } from "../../../../constant";

export default (props) => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
      openConsultationFeeDrawer,
      formatMessage,
    } = {},
  } = props || {};

  const {
    data: {
      razorpay_link = "",
      creator_type = "",
      basic_info = {},
      doctors: { provider_id } = {},
    } = {},
  } = props;

  const handleEdit = (id) => (e) => {
    e.preventDefault();
    const { data = {} } = props;
    const { openConsultationFeeDrawer } = data || {};
    let paymentData = {};
    paymentData["basic_info"] = { ...basic_info, razorpay_link };
    console.log("9687w678687678", { paymentData });
    openConsultationFeeDrawer(paymentData);
  };

  if (provider_id || creator_type === USER_CATEGORY.PROVIDER) {
    return null;
  }

  return (
    <Tooltip
      placement={"bottom"}
      title={formatMessage(messages.editConsultationFee)}
    >
      <EditOutlined
        className={"pointer align-self-end"}
        onClick={handleEdit(id)}
        style={{ fontSize: "18px", color: "#6d7278" }}
      />
    </Tooltip>
  );
};
