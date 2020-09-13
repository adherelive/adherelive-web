import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  const { providerData: { basic_info: { name } = {} } = {} } = props || {};

  return <div>{name ? name : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
