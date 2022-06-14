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

console.log("children", children);
function CustomSelect() {
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const handleSelect = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <div>
      <Select
        mode="tags"
        style={{ width: "100%" }}
        onChange={handleChange}
        tokenSeparators={[]}
        placeholder="Search for symptoms"
        onSelect={handleSelect}
      >
        {children}
      </Select>
    </div>
  );
}

export default CustomSelect;
