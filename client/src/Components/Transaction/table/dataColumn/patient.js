import React from "react";
import { getFullName } from "../../../../Helper/common";
import Tooltip from "antd/es/tooltip";
import Avatar from "antd/es/avatar";

export default (props) => {
  const { patientData } = props || {};
  const {
    basic_info: {
      first_name,
      middle_name,
      last_name,
      full_name = "",
      uid = "",
    } = {},
    details: { profile_pic = null } = {},
  } = patientData || {};

  console.log("73542345237843246324", patientData);

  let initials = `${first_name ? first_name[0] : ""}${
    last_name ? last_name[0] : ""
  }`;

  return (
    <div className="flex direction-row  justify-space-between">
      <div className=" wp10 flex direction-column align-center justify-center">
        <Tooltip placement="right">
          {initials ? (
            <Avatar src={profile_pic}>{initials}</Avatar>
          ) : (
            <Avatar icon="user" />
          )}
        </Tooltip>
      </div>
      <div className="flex direction-column ha wp85 ml24">
        <span className="fs16 fw700 ellipsis "> {full_name}</span>
        <span className="flex direction-row justify-space-between">
          <span>{uid}</span>
        </span>
      </div>
    </div>
  );
};
