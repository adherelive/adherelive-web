import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { DatePicker, Form } from "antd";
import moment from "moment";

import messages from "../message";
import calendar from "../../../../Assets/images/calendar1.svg";
import repeatIntervalField from "./repeatInterval";
import repeatField from "./repeatType";
import startDateField from "./startDate";

import { REPEAT_TYPE } from "../../../../constant";
import { isNumber } from "../../../../Helper/validation";

const FIELD_NAME = "endDate";
const { Item: FormItem } = Form;

class EndDate extends Component {
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

  getNewEndDate = () => {
    const {
      form: { getFieldValue }
    } = this.props;

    const repeat = getFieldValue(repeatField.field_name);
    const repeatInterval = getFieldValue(repeatIntervalField.field_name);
    const startDate = getFieldValue(startDateField.field_name);

    let newEndDate;

    const startDateCopy = startDate.clone().startOf("day");
    const res = isNumber(repeatInterval);
    if (repeat === REPEAT_TYPE.DAILY || res.valid === true) {
      switch (repeat) {
        case REPEAT_TYPE.DAILY: {
          newEndDate = startDateCopy.add(1, "d");
          break;
        }
        case REPEAT_TYPE.WEEKLY: {
          newEndDate = startDateCopy.add(res.value, "w");
          break;
        }
        case REPEAT_TYPE.MONTHLY: {
          newEndDate = startDateCopy.add(res.value, "M");
          break;
        }
        case REPEAT_TYPE.YEARLY: {
          newEndDate = startDateCopy.add(res.value, "y");
          break;
        }
        default:
          break;
      }
    }

    return newEndDate;
  };

  getInitialValue = () => {
    const { purpose, event = {}, events = {} } = this.props;

    let initialValue = this.getNewEndDate();
    if (purpose) {
      const { eventId } = event;
      const { endDate } = events[eventId] || {};
      const actualEndDate = new moment(endDate);
      initialValue =
        actualEndDate < initialValue ? initialValue : actualEndDate;
    }
    return initialValue;
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError },
      disabledEndDate
    } = this.props;
    const { formatMessage, openCalendar, getInitialValue } = this;

    return (
      <div className="flex flex-grow-1 row align-items-center iqvia-date-picker">
        <div className="full-width pl8">
          <span className="form-label">To</span>
          <FormItem>
            {getFieldDecorator(FIELD_NAME, {
              initialValue: getInitialValue()
            })(
              <DatePicker
                className={`full-width ${FIELD_NAME}`}
                format="DD/MM/YYYY, ddd"
                showToday={false}
                suffixIcon={null}
                disabled={
                  getFieldError(repeatIntervalField.field_name) !== undefined
                }
                disabledDate={disabledEndDate}
                getCalendarContainer={this.getParentNode}
                popupStyle={{ left: 0 }}
              />
            )}
            <img
              alt=""
              className="calendar clickable new-calendar"
              onClick={openCalendar}
              src={calendar}
            />
          </FormItem>
        </div>
      </div>
    );
  }
}

const Field = injectIntl(EndDate);

export default {
  field_name: FIELD_NAME,
  render: props => <Field {...props} />
};
