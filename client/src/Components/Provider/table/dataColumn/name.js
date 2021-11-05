import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const { providerData } = props || {};
  const { basic_info: { name } = {} } = providerData || {};

  return (
    <div className="ellipsis wp100  ">
      <div className="wp100 ">
        {name ? `${name}` : TABLE_DEFAULT_BLANK_FIELD}
      </div>
    </div>
  );
};
