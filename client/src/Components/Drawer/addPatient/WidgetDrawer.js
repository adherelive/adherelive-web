import React, { Component, Fragment, useState, useEffect } from "react";
import { injectIntl } from "react-intl";
import {
  Drawer,
  Icon,
  Select,
  Input,
  message,
  Button,
  Spin,
  Radio,
  DatePicker,
} from "antd";
import { Checkbox, Row, Col } from "antd";

// import { CONSULTATION_FEE_TYPE_TEXT } from "../../../constant";

import moment from "moment";
import throttle from "lodash-es/throttle";

// import messages from "./message";
import Footer from "../footer";
import { durations } from "./durationList.json";
import isEmpty from "../../../Helper/is-empty";

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const bodyPartsOptions = [
  { label: "Generalised", value: "Generalised", checked: true },
  { label: "Head", value: "Head", checked: false },
  { label: "Left Eye", value: "Left Eye", checked: false },
  { label: "Right Eye", value: "Right Eye", checked: false },
  { label: "Right Ear", value: "Right Ear", checked: false },
  { label: "Left Ear", value: "Left Ear", checked: false },
  { label: "Nose", value: "Nose", checked: false },
  { label: "Mouth", value: "Mouth", checked: false },
  { label: "Neck", value: "Neck", checked: false },
  { label: "Right Shoulder", value: "Right Shoulder", checked: false },
  { label: "Left Shoulder", value: "Left Shoulder", checked: false },
  { label: "Chest", value: "Chest", checked: false },
  { label: "Right Arm", value: "Right Arm", checked: false },
  { label: "Left Arm", value: "Left Arm", checked: false },
  { label: "Right Elbow", value: "Right Elbow", checked: false },
  { label: "Left Elbow", value: "Left Elbow", checked: false },
  { label: "Stomach", value: "Stomach", checked: false },
  { label: "Abdomen", value: "Abdomen", checked: false },
  { label: "Right Forearm", value: "Right Forearm", checked: false },
  { label: "Left Forearm", value: "Left Forearm", checked: false },
  { label: "Right Wrist", value: "Right Wrist", checked: false },
  { label: "Left Wrist", value: "Left Wrist", checked: false },
  { label: "Right Hand", value: "Right Hand", checked: false },
  { label: "Left Hand", value: "Left Hand", checked: false },
  { label: "Right Hand Finger", value: "Right Hand Finger", checked: false },
  { label: "Left Hand Finger", value: "Left Hand Finger", checked: false },
  { label: "Right Hip", value: "Right Hip", checked: false },
  { label: "Left Hip", value: "Left Hip", checked: false },
  { label: "Right Thigh", value: "Right Thigh", checked: false },
  { label: "Left Thigh", value: "Left Thigh", checked: false },
  { label: "Right Knee", value: "Right Knee", checked: false },
  { label: "Left Knee", value: "Left Knee", checked: false },
  { label: "Right Shin", value: "Right Shin", checked: false },
  { label: "Left Shin", value: "Left Shin", checked: false },
  { label: "Right Ankle", value: "Right Ankle", checked: false },
  { label: "Left Ankle", value: "Left Ankle", checked: false },
  { label: "Right Foot", value: "Right Foot", checked: false },
  { label: "Left Foot", value: "Left Foot", checked: false },
  { label: "Right Toe", value: "Right Toe", checked: false },
  { label: "Left Toe", value: "Left Toe", checked: false },
  { label: "Urinary Bladder", value: "Urinary Bladder", checked: false },
  { label: "Back", value: "Back", checked: false },
  { label: "Lower Back", value: "Lower Back", checked: false },
  { label: "Left Tricep", value: "Left Tricep", checked: false },
  { label: "Right Tricep", value: "Right Tricep", checked: false },
  { label: "Left Hamstring", value: "Left Hamstring", checked: false },
  { label: "Right Hamstring", value: "Right Hamstring", checked: false },
  { label: "Left Calf", value: "Left Calf", checked: false },
  { label: "Right Calf", value: "Right Calf", checked: false },
];

function WidgetDrawer({
  visible,
  onCloseDrawer,
  finalSymptomData,
  generateFinalSymptomData,
  selectedSymptom,
  handleSelectSymptom,
  EditWidget,
}) {
  const [values, setValues] = useState({
    duration: "1 Day",
    submitting: false,
  });

  const [bodyParts, setBodyParts] = useState(bodyPartsOptions);

  useEffect(() => {
    if (EditWidget === true) {
      let copy = [...bodyParts];
      copy.forEach((symptom) => {
        if (finalSymptomData[0].bodyParts.includes(symptom.value)) {
          symptom.checked = true;
        } else {
          symptom.checked = false;
        }
      });
      setBodyParts(copy);
      setValues({
        ...values,
        // selectedSymptom: symptomData.symptomName,
        duration: finalSymptomData[0].duration,
      });
      handleSelectSymptom(finalSymptomData[0].symptomName);
    }
  }, [EditWidget]);

  const onSubmit = () => {
    let copy = [...bodyParts];
    copy.forEach((ele) => {
      if (ele.value === "Generalised") {
        ele.checked = true;
      } else {
        ele.checked = false;
      }
    });

    console.log("final symptom data", finalSymptomData);

    setBodyParts(copy);
    setValues({
      ...values,
      duration: "1 Day",
    });
    onCloseDrawer();
  };

  const onClose = () => {};

  const setDuration = (value) => {
    console.log("finalSymptomData", finalSymptomData);
    console.log("selectedSymptom", selectedSymptom);
    let data = finalSymptomData;
    data.forEach((symptom) => {
      if (symptom.symptomName === selectedSymptom) {
        symptom.duration = value;
      }
    });

    generateFinalSymptomData(data);

    setValues({
      ...values,
      duration: value,
    });
  };

  const getDurationOptions = () => {
    let options = [];
    durations.forEach((service) => {
      options.push(
        <Option key={service.id} value={service.name}>
          {service.name}
        </Option>
      );
    });

    return options;
  };

  const onChangeCheckbox = (checkedValues) => {
    console.log("selectedSymptom", selectedSymptom);
    console.log("checked = ", checkedValues);

    let checked = checkedValues.target.checked;
    let value = checkedValues.target.value;
    let bodyPartsCopy = [...bodyParts];
    bodyPartsCopy.forEach((ele) => {
      if (ele.value === value) {
        ele.checked = checked;
      }
    });
    setBodyParts(bodyPartsCopy);

    let finalBodyPart = [];
    let bodyPartFilter = bodyPartsCopy.filter((ele) => ele.checked === true);
    if (!isEmpty(bodyPartFilter)) {
      bodyPartFilter.forEach((ele) => {
        finalBodyPart.push(ele.value);
      });
    }
    let data = finalSymptomData;
    data.forEach((symptom) => {
      if (symptom.symptomName === selectedSymptom) {
        symptom.bodyParts = finalBodyPart;
      }
    });
    generateFinalSymptomData(data);
  };

  const onSelectSymptom = (symptomData) => {
    console.log("symptomData", symptomData);
    let copy = [...bodyParts];

    copy.forEach((symptom) => {
      if (symptomData.bodyParts.includes(symptom.value)) {
        symptom.checked = true;
      } else {
        symptom.checked = false;
      }
    });

    setBodyParts(copy);
    setValues({
      ...values,
      // selectedSymptom: symptomData.symptomName,
      duration: symptomData.duration,
    });
    handleSelectSymptom(symptomData.symptomName);
  };

  const renderSymptomName = () => {
    console.log("finalSymptomData", finalSymptomData);
    console.log("selectedSymptom", selectedSymptom);
    return finalSymptomData.map((ele, index) => {
      return (
        <div
          key={index}
          className="form-headings
          //    flex align-center justify-start
             tac"
        >
          <span
            onClick={() => onSelectSymptom(ele)}
            className={
              selectedSymptom == ele.symptomName
                ? "fwbolder fs18 mb10 mr10 cdss-active-symptom-names pointer"
                : "fwbolder fs18  mb10 mr10 cdss-symptom-names pointer"
            }
          >
            {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
            {ele.symptomName}
          </span>
        </div>
      );
    });
  };

  const renderWidgetForm = () => {
    const { duration = "" } = values;

    return (
      <div className="form-block-ap">
        <div className="flex cdss-container">{renderSymptomName()}</div>

        <div
          className="form-headings
                //    flex align-center justify-start
                   tac"
        >
          <span className="fwbolder fs18 mb10">
            {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
            Body Parts
          </span>
        </div>
        <div className="mb10">
          {/* <Checkbox.Group
            style={{ width: "100%" }}
            onChange={onChangeCheckbox}
            defaultValue={["Generalised"]}
          > */}
          <Row>
            {bodyParts.map((part, index) => {
              return (
                <Col
                  style={
                    part.value === "Generalised"
                      ? { position: "absolute", top: "-35px", left: "143px" }
                      : {}
                  }
                  key={index}
                  span={8}
                >
                  <Checkbox
                    checked={part.checked}
                    // disabled={disabled}
                    onChange={onChangeCheckbox}
                    value={part.value}
                  >
                    {part.label}
                  </Checkbox>

                  {/* <Checkbox value={part.value}>{part.value}</Checkbox> */}
                </Col>
              );
            })}
          </Row>
          {/* </Checkbox.Group> */}
        </div>

        <div
          className="form-headings
                //    flex align-center justify-start
                   tac"
        >
          <span className="fwbolder fs18 ">
            {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
            Duration
          </span>
        </div>

        <Select
          showSearch
          placeholder="Select Duration"
          className="form-inputs-ap drawer-select"
          value={duration}
          onChange={setDuration}
          autoComplete="off"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children
              .toLowerCase()
              .indexOf(input.trim().toLowerCase()) >= 0
          }
        >
          {getDurationOptions()}
        </Select>
      </div>
    );
  };

  return (
    // const { consultation, submitting } = this.state;

    <Fragment>
      <Drawer
        title={"Symptoms"}
        placement="right"
        maskClosable={false}
        headerStyle={{
          position: "sticky",
          zIndex: "9999",
          top: "0px",
        }}
        destroyOnClose={true}
        onClose={onSubmit}
        visible={visible} // todo: change as per state, -- WIP --
        width={480}
      >
        {renderWidgetForm()}

        <Footer
          onSubmit={onSubmit}
          onClose={onClose}
          // submitText={this.formatMessage(messages.submit)}
          submitText={"Submit"}
          submitButtonProps={{}}
          cancelComponent={null}
          submitting={values.submitting}
        />
      </Drawer>
    </Fragment>
  );
}

export default WidgetDrawer;
