import React from "react";

export default (props) => {
  const {
    medicationData: {
      basic_info: { details: { repeat_days = [] } = {} } = {},
    } = {},
  } = props || {};

  return <div>{`${repeat_days ? repeat_days.join(", ") : "--"}`}</div>;
};
