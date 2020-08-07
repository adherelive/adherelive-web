import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
  console.log("283724 this.props in treatment --> ", props);
  const { carePlanData } = props || {};
  const { treatment=''} = carePlanData || {};

  // const { patientData: { treatment } = {} } = props || {};
  // console.log("283724 this.props in treatment2222 --> ", treatment);

  return (
    <div>{treatment ? treatment : TABLE_DEFAULT_BLANK_FIELD}</div>
  );
};
