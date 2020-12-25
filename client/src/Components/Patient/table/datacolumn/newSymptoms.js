import React from "react";
import {  SYMPTOM } from "../../../../constant";

export default props => {
  const {
    patientData: { new_symptom = false }
  } = props || {};

  return <div>{new_symptom ? SYMPTOM.NEW : SYMPTOM.OLD}</div>;
};
