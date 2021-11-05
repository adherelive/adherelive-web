import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const { providerData } = props || {};

  const { basic_info: { address } = {} } = providerData || {};

  return <div>{`${address ? address : TABLE_DEFAULT_BLANK_FIELD}`}</div>;
};
