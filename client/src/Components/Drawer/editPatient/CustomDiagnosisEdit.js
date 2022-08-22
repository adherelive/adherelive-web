import React from "react";
import { Select } from "antd";
// import { diagnosisList } from "./diagnosisList.json";
import { useSelector } from "react-redux";
import isEmpty from "../../../Helper/is-empty";

const { Option } = Select;

function CustomDiagnosisEdit({
  diagnosis,
  handleDiagnosisChanges,
  onDiagnosisSearchHanlder,
}) {
  const { diagnosisList = [] } = useSelector((state) => state.cdss);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleSelect = (value) => {
    console.log(`selected ${value}`);
  };

  const children = [];

  for (let each in diagnosisList) {
    children.push(
      <Option key={diagnosisList[each]}>{diagnosisList[each]}</Option>
    );
  }

  console.log("diagnosis", diagnosis);

  console.log(typeof diagnosis);

  let finalDaignosis = diagnosis.split(",");
  console.log(finalDaignosis.length);
  if (finalDaignosis.length > 1) {
    finalDaignosis = diagnosis.split(",");
  } else {
    finalDaignosis = diagnosis;
  }
  return (
    <div className="mt10 mb10">
      <Select
        mode="tags"
        style={{ width: "100%" }}
        onChange={handleDiagnosisChanges}
        tokenSeparators={[","]}
        placeholder="Search for symptoms"
        onSelect={handleSelect}
        defaultValue={finalDaignosis}
        onSearch={onDiagnosisSearchHanlder}
      >
        {children}
      </Select>
    </div>
  );
}

export default CustomDiagnosisEdit;
