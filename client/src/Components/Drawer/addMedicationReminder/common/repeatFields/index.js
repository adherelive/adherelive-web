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

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default (props) => {
  const {
    form: { getFieldValue },
  } = props;

  let start = getFieldValue(startDate.field_name);
  let end = getFieldValue(endDate.field_name);

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

      <div className="flex align-center justify-space-between">
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
