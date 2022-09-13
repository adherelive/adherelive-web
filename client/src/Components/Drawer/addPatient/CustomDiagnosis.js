import React, { useState } from "react";
import { Select } from "antd";
// import { diagnosisList } from "./diagnosisList.json";
import { useSelector } from "react-redux";

const { Option } = Select;

function CustomDiagnosis({ handleDiagnosisChanges, onDiagnosisSearchHanlder }) {
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

  return (
    <div className="mt10 mb10">
      <Select
        mode="tags"
        style={{ width: "100%" }}
        onChange={handleDiagnosisChanges}
        tokenSeparators={[","]}
        placeholder="Search for diagnosis"
        onSelect={handleSelect}
        onSearch={onDiagnosisSearchHanlder}
      >
        {children}
      </Select>
    </div>
  );
}

export default CustomDiagnosis;
