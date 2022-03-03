import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";
import { getName } from "../../../../Helper/validation";
import { Tooltip, Avatar } from "antd";

export default (props) => {
  // const { doctorData, users } = props || {};
  // const { basic_info: { full_name, profile_pic, user_id } = {} } =
  //   doctorData || {};

  // const { basic_info: { email } = {} } = users[user_id] || {};

  // let initials = `${full_name ? full_name[0] : ""}`;

  return (
    <div className="flex direction-row  justify-space-between">
      {/* <div className=" wp10 flex direction-column align-center justify-center">
        <Tooltip placement="right">
          <Avatar icon="user" />
        </Tooltip>
      </div> */}
      <div className="flex direction-column ha wp85 ml24">
        <span className="fs16 fw700 ellipsis "> {`Dr. Sparsh Jaiswal`}</span>
        <span className="flex justify-space-between ellipsis">
          akshay@gmail.com
        </span>
      </div>
    </div>
  );
};
