import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD, SYMPTOM } from "../../../../constant";

export default props => {
  console.log("2837412 this.props --> ", props);
  const {
    patientData: { new_symptom = false }
  } = props || {};
  console.log("12312345 new_symptom -> ", new_symptom);

  return <div>{new_symptom ? SYMPTOM.NEW : SYMPTOM.OLD}</div>;
};
