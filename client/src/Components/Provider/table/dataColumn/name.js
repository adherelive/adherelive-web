import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  const { doctorData } = props || {};
  const {
    basic_info: {
      first_name,
      middle_name,
      last_name,
      gender,
      profile_pic
    } = {}
  } = doctorData || {};

  return (
    <div className="ellipsis wp100 flex align-center justify-space-between">
        <div className="w25 h25">
            {profile_pic ? <img src={profile_pic} alt="profile pic" className="w25 h25 br50"/> : <div className="w25 h25 br50 bg-dark-grey"></div>}
        </div>
      <div className="wp100 ml10">
        {first_name
          ? `${first_name} ${middle_name ? `${middle_name} ` : ""}${
              last_name ? last_name : ""
            } (${gender ? gender.toUpperCase() : ""})`
          : TABLE_DEFAULT_BLANK_FIELD}
      </div>
    </div>
  );
};
