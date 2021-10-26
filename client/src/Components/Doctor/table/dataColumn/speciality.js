import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const { specialityData } = props || {};
  const { basic_info: { name } = {} } = specialityData || {};

  return <div>{name ? name : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
