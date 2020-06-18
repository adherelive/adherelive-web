import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("283724 this.props --> ", props);
  const { carePlanData } = props || {};
  const { basic_info: { name } = {} } = carePlanData || {};

  return (
    <div>{name ? name : TABLE_DEFAULT_BLANK_FIELD}</div>
  );
};
