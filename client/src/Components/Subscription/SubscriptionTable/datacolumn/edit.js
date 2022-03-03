import React from "react";
import { EditOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";

import messages from "../messages";
import { USER_CATEGORY } from "../../../../constant";
import edit_image from "../../../../Assets/images/edit.svg";

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
    const { openConsultationFeeDrawer, onOpenEditServiceDrawer } = data || {};
    let paymentData = {};
    paymentData["basic_info"] = { ...basic_info, razorpay_link };
    console.log("9687w678687678", { paymentData });
    // openConsultationFeeDrawer(paymentData);

    onOpenEditServiceDrawer();
  };

  if (provider_id || creator_type === USER_CATEGORY.PROVIDER) {
    return null;
  }

  return (
    <Tooltip
      placement={"bottom"}
      // title={formatMessage(messages.editConsultationFee)}
      title={"Edit subscription"}
    >
      {/* <EditOutlined
        className={"pointer align-self-end"}
        onClick={handleEdit(id)}
        style={{ fontSize: "18px", color: "#6d7278" }}
      /> */}
      <div className="p10" onClick={handleEdit(id)}>
        <div className="flex align-center justify-center">
          <img src={edit_image} alt="edit button" />
        </div>
      </div>
    </Tooltip>
  );
};
