import React from "react";
import { Select } from "antd";
import { diagnosis } from "./diagnosisList.json";

const { Option } = Select;

const children = [];

for (let each in diagnosis) {
  children.push(
    <Option key={diagnosis[each].name}>{diagnosis[each].name}</Option>
  );
}

function CustomDiagnosis({ handleDiagnosisChanges }) {
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleSelect = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div className="mt10 mb10">
      <Select
        mode="tags"
        style={{ width: "100%" }}
        onChange={handleDiagnosisChanges}
        tokenSeparators={[","]}
        placeholder="Search for symptoms"
        onSelect={handleSelect}
      >
        {children}
      </Select>
    </div>
  );
}

export default CustomDiagnosis;
