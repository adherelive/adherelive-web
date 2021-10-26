import React from "react";

export default (props) => {
  const {
    medicineData: { basic_info: { creator_id } = {} } = {},
    doctors = {},
  } = props || {};
  const { basic_info: { full_name = "" } = {} } = doctors || {};

  return (
    <div className="fs16 fw700 ">
      {full_name ? `Dr. ${full_name}` : "-- --"}
    </div>
  );
};
