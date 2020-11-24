import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD,DIAGNOSIS_TYPE } from "../../../../constant";

export default props => {
  const { patientData: { condition} = {} } = props || {};
  const {patientData} = props;
  const { patientData : {carePlanData : {details : {diagnosis : {description = '' , type = '1' } ={} } = {}} = {} } ={} } = props || {};
  const diagnosisType = DIAGNOSIS_TYPE[type];
  const diagnosisTypeValue = diagnosisType["value"] || '';

  // const { value } = CONDITIONS[condition] || {};

  // return <div>{condition ? condition : TABLE_DEFAULT_BLANK_FIELD}</div>;
  return <div>
    <div className="flex direction-column">
      <span className="mr10 fw600">{diagnosisTypeValue}</span>
      <span>{description ? description : "--"}</span>
    </div>
  </div>
};
