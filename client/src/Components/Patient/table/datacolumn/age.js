import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("28374 this.props --> ", props);
  const { patientData: { basic_info: { age } = {}, details = {} } = {} } = props || {};

  let { age_type = '' } = details || {};
  return <div>{age+`${age_type === '2' && age > 1 ? ' months' : age_type === '2' ? ' month' : age_type === '1' && age > 1 ? ' days' : age_type === '1' ? ' day' : ''}`}</div>;
};
