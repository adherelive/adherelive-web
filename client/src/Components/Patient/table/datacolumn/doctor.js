import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const {
    doctorData: {
      basic_info: { first_name, middle_name, last_name } = {},
    } = {},
  } = props || {};

  return (
    <div>
      {first_name
        ? `Dr. ${first_name} ${
            middle_name ? `${middle_name} ` : ""
          }${last_name}`
        : TABLE_DEFAULT_BLANK_FIELD}
    </div>
  );
};
