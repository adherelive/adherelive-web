import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { DatePicker, Form } from "antd";
import messages from "../message";
import calendar from "../../../../Assets/images/calendar1.svg";
import moment from "moment";

import repeatTypeField from "./repeatType";

import { REPEAT_TYPE, EVENT_ACTION } from "../../../../constant";

const { Item: FormItem } = Form;
const FIELD_NAME = "start_date";

class StartDate extends Component {
  openCalendar = e => {
    e.preventDefault();
    const datePicker = window.document.getElementsByClassName(FIELD_NAME)[0];

    if (datePicker) {
      const firstChild = datePicker.firstChild;
      if (firstChild) {
        const datePickerInput = firstChild.firstChild;
        if (datePicker && datePickerInput.click) {
          datePickerInput.click();
        }
      }
    }
  };

  getParentNode = t => t.parentNode;

  formatMessage = data => this.props.intl.formatMessage(data);

  getInitialValue = () => {
    const { purpose, event = {} } = this.props;

    let initialValue = new moment();
    if (purpose) {
      const { startTime } = event;
      initialValue = new moment(startTime);
    }
    return initialValue;
  };

  onBlur = date => () => {
    this.props.adjustEventOnStartDateChange(date);
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      disabledStartDate,
      purpose
    } = this.props;
    const { formatMessage, openCalendar, getInitialValue } = this;
    const repeat = getFieldValue(repeatTypeField.field_name);

    const value = getFieldValue(FIELD_NAME);

    return (
      <div className="flex flex-grow-1 row align-items-center">
        <div className="pr8 wp100">
          <span className="form-label">From</span>
          <FormItem className="wp100">
            {getFieldDecorator(FIELD_NAME, {
              initialValue: getInitialValue()
            })(
              <DatePicker
                className={`full-width ${FIELD_NAME} ant-date-custom wp100`}
                format="DD/MM/YYYY, ddd"
                showToday={false}
                disabled={purpose === EVENT_ACTION.EDIT_NOTES}
                disabledDate={disabledStartDate}
                suffixIcon={null}
                allowClear={false}
                onBlur={this.onBlur(value)}
                getCalendarContainer={this.getParentNode}
                popupStyle={{ left: 0, backgroundColor: "black" }}
              />
            )}
            {/*<img*/}
            {/*  alt=""*/}
            {/*  className="calendar clickable new-calendar"*/}
            {/*  onClick={openCalendar}*/}
            {/*  src={calendar}*/}
            {/*/>*/}
          </FormItem>
        </div>
      </div>
    );
  }
}

const Field = injectIntl(StartDate);

export default {
  field_name: FIELD_NAME,
  render: props => <Field {...props} />
};
