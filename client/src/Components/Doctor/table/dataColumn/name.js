import React from "react";
import {
  TABLE_DEFAULT_BLANK_FIELD,
  TABLE_STATUS,
  USER_CATEGORY,
} from "../../../../constant";
import TableStatus from "../../../../Helper/TableStatus";
import messages from "../messages";

export default (props) => {
  const { doctorData, userData, formatMessage } = props || {};
  const { basic_info: { full_name, gender, profile_pic } = {} } =
    doctorData || {};

  const { deleted_at, category: user_category = "" } = userData || {};
  let category = user_category;
  if (user_category === USER_CATEGORY.DOCTOR) {
    category = user_category.charAt(0).toUpperCase() + user_category.slice(1);
  } else if (user_category === USER_CATEGORY.HSP) {
    category = user_category.toUpperCase();
  }

  let status = "active";
  if (deleted_at) {
    status = "inactive";
  }

  const type = TABLE_STATUS.ADMIN_DOCTOR_TABLE;
  const displayProps = {
    status,
    type,
  };

  return (
    <div className="ellipsis wp100 flex align-center justify-space-between">
      <div className="w25 h25">
        {profile_pic ? (
          <img src={profile_pic} alt="profile pic" className="w25 h25 br50" />
        ) : (
          <div className="w25 h25 br50 bg-dark-grey"></div>
        )}
      </div>
      <div className="wp100 ml10">
        <span className="fs16 fw700 black-65">
          {full_name
            ? `${full_name} (${gender ? gender.toUpperCase() : ""})`
            : TABLE_DEFAULT_BLANK_FIELD}
        </span>
        {/* <div>{`Type : ${category}`}</div>     */}
        <div>{formatMessage({ ...messages.typeText }, { category })}</div>
        <div className="ellipsis wp100 mt5">
          <TableStatus displayProps={displayProps} />
        </div>
      </div>
    </div>
  );
};
