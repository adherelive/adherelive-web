import React from "react";
import { FieldTimeOutlined } from "@ant-design/icons";

import messages from "../messages";
import Tooltip from "antd/es/tooltip";
import message from "antd/es/message";

export default (props) => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
      deleteDoctorProduct,
      formatMessage,
      onOpenMyTasksDrawer,
    } = {},
  } = props || {};

  const handleDelete = (id) => async (e) => {
    e.preventDefault();
    alert("delete");
    // try {
    //   const {data = {}} = props;
    //   const {deleteDoctorProduct} = data || {};
    //   const response = await deleteDoctorProduct({id});
    //   const {
    //     status,
    //     statusCode,
    //     payload: {data: resp_data = {}, message: resp_msg = ""} = {},
    //   } = response || {};

    //   if (status) {
    //     message.success(resp_msg);
    //   } else {
    //     message.warn(resp_msg);
    //   }
    // } catch (error) {
    //   console.log("error ==>", error);
    // }
  };

  const { data: { editable } = {} } = props;
  // console.log("5464564564645654",provider_id);

  if (!editable) {
    return null;
  }

  return (
    <Tooltip
      placement={"bottom"}
      // title={formatMessage(messages.deleteConsultationFee)}
      title={"My Tasks"}
    >
      <div className="p10" onClick={onOpenMyTasksDrawer}>
        <FieldTimeOutlined className="flex align-center justify-center" />
      </div>
    </Tooltip>
  );
};
