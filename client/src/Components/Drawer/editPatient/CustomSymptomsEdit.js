import React from "react";
import { Select } from "antd";
import { symptoms } from "../addPatient/symptomList.json";
import isEmpty from "../../../Helper/is-empty";

const { Option } = Select;

const children = [];

for (let each in symptoms) {
  children.push(
    <Option key={symptoms[each].name}>{symptoms[each].name}</Option>
  );
}

function CustomSymptomsEdit({
  symptoms,
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
        defaultValue={symptoms}
      >
        {children}
      </Select>
    </div>
  );
}

export default CustomSymptomsEdit;
