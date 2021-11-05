import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const { carePlanData } = props || {};
  const { treatment = "" } = carePlanData || {};

  return <div>{treatment ? treatment : TABLE_DEFAULT_BLANK_FIELD}</div>;
};
