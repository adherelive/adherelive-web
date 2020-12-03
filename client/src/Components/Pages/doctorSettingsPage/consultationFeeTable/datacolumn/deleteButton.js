import React from "react";
import { DeleteTwoTone } from "@ant-design/icons";

export default props => {
  const {
    data: {
      basic_info: { id = null, name = "", type = "", amount = "" } = {},
      deleteDoctorProduct
    } = {}
  } = props || {};

  return (
    <div>
      <DeleteTwoTone
        className={"pointer align-self-end"}
        onClick={deleteDoctorProduct(id, name, type, amount)}
        twoToneColor="#6f6f78"
        style={{ fontSize: "20px" }}
      />
    </div>
  );
};
