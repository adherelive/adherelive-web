import React from "react";
import { Select } from "antd";
// import { diagnosisList } from "./diagnosisList.json";
import { useSelector } from "react-redux";

const { Option } = Select;

function CustomDiagnosisEdit({ diagnosis, handleDiagnosisChanges }) {
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

  return (
    <div className="mt10 mb10">
      <Select
        mode="tags"
        style={{ width: "100%" }}
        onChange={handleDiagnosisChanges}
        tokenSeparators={[","]}
        placeholder="Search for symptoms"
        onSelect={handleSelect}
        defaultValue={diagnosis.split(",")}
      >
        {children}
      </Select>
    </div>
  );
}

export default CustomDiagnosisEdit;
