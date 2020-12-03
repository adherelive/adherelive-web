import React from "react";
import { EditOutlined } from "@ant-design/icons";

export default props => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
      editDoctorProduct
    } = {}
  } = props || {};

  return (
    <div>
      <EditOutlined
        className={"pointer align-self-end"}
        onClick={editDoctorProduct(id)}
        twoToneColor="#6f6f78"
        style={{ fontSize: "20px" }}
      />
    </div>
  );
};
