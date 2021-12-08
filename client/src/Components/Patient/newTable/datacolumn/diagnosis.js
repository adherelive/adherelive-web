import React from "react";
import {
  DIAGNOSIS_TYPE,
  TABLE_DEFAULT_BLANK_FIELD,
} from "../../../../constant";

export default (props) => {
  const {
    carePlanData: {
      details: { diagnosis: { description = "", type = "2" } = {} } = {},
    } = {},
  } = props || {};

  const diagnosisType = DIAGNOSIS_TYPE[type];
  const diagnosisTypeValue = diagnosisType["value"] || "";

  return (
    <div>
      <div className="flex direction-column">
        <span className="mr10 fw600">{diagnosisTypeValue}</span>
        <span>{description ? description : TABLE_DEFAULT_BLANK_FIELD}</span>
      </div>
    </div>
  );
};
