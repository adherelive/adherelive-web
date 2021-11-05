import React, { Fragment } from "react";
import repeatType from "../repeatType";
// import repeatInterval from "../repeatInterval";
import startDate from "../startDate";
import endDate from "../endDate";
import selectedDays from "../selectedDays";
// import { REPEAT_TYPE } from "../../../../../constant";
import { Radio } from "antd";
import moment from "moment";
import messages from "../../message";
import { ALTERNATE_DAYS, DAYS } from "../../../../../constant";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default (props) => {
  const {
    form: { getFieldValue },
  } = props;

  let start = getFieldValue(startDate.field_name);
  let end = getFieldValue(endDate.field_name);
  let selectedDaysValue = getFieldValue(selectedDays.field_name);
  let selectedDaysArray = [];
  let selectedDaysRadio = 2;
  if (selectedDaysValue) {
    if (Array.isArray(selectedDaysValue)) {
      selectedDaysArray = selectedDaysValue;
    } else {
      selectedDaysArray = selectedDaysValue.split(",");
    }
    if (selectedDaysArray.length == 7) {
      selectedDaysRadio = 1;
    } else if (selectedDaysArray.length == 4) {
      ALTERNATE_DAYS.map((value) => {
        if (!selectedDaysArray.includes(value)) {
          selectedDaysRadio = null;
        }
      });
    } else {
      selectedDaysRadio = null;
    }
  } else {
    selectedDaysRadio = null;
  }
  let diff = end ? moment(end).diff(moment(start), "days") : 1;
  let selectedRadio = end ? null : 3;
  if (diff == 7) {
    selectedRadio = 1;
  } else if (diff == 14) {
    selectedRadio = 2;
  }

  return (
    <Fragment>
      <div className="select-days-wrapper flex align-items-center justify-content-space-between wp100">
        <div className="repeats wp100">{selectedDays.render(props)}</div>
      </div>
      <RadioGroup
        className="flex justify-content-end radio-formulation mt10 mb24"
        buttonStyle="solid"
        value={selectedDaysRadio}
      >
        <RadioButton value={1} onClick={props.setRepeatEveryDay}>
          {props.formatMessage(messages.everyday)}
        </RadioButton>
        <RadioButton value={2} onClick={props.setRepeatAlternateDay}>
          {props.formatMessage(messages.alternate)}
        </RadioButton>
      </RadioGroup>

      <div className="flex align-items-center justify-content-space-between">
        {startDate.render(props)}

        {endDate.render(props)}
      </div>
      <RadioGroup
        className="flex justify-content-end radio-formulation mt-20 mb24"
        buttonStyle="solid"
        value={selectedRadio}
      >
        <RadioButton value={1} onClick={props.setEndDateOneWeek}>
          {props.formatMessage(messages.oneWeek)}
        </RadioButton>
        <RadioButton value={2} onClick={props.setEndDateTwoWeek}>
          {props.formatMessage(messages.twoWeeks)}
        </RadioButton>
        <RadioButton value={3} onClick={props.setEndDateLongTime}>
          {props.formatMessage(messages.longterm)}
        </RadioButton>
      </RadioGroup>
    </Fragment>
  );
};
