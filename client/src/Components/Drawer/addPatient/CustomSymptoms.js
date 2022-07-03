import React from "react";
import { Select } from "antd";
import { symptoms } from "./symptomList.json";

const { Option } = Select;

const children = [];

for (let each in symptoms) {
  children.push(
    <Option key={symptoms[each].name}>{symptoms[each].name}</Option>
  );
}

function CustomSelect({
  handleSymptomsChanges,
  handleSymptomSelect,
  hendleSymptomDeselect,
}) {
  // const handleChange = (value) => {
  //   console.log(`selected ${value}`);
  // };

  // const handleSelect = (value) => {
  //   console.log(`selected ${value}`);
  // };
  return (
    <div className="mt10 mb10">
      <Select
        mode="tags"
        style={{ width: "100%" }}
        onChange={handleSymptomsChanges}
        tokenSeparators={[","]}
        placeholder="Search for symptoms"
        onSelect={handleSymptomSelect}
        onDeselect={hendleSymptomDeselect}
      >
        {children}
      </Select>
    </div>
  );
}

export default CustomSelect;
