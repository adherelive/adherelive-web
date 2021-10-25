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

const FIELD_NAME = "end_date";
const { Item: FormItem } = Form;

class EndDate extends Component {
  openCalendar = (e) => {
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

  getParentNode = (t) => t.parentNode;

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getNewEndDate = () => {
    const {
      form: { getFieldValue },
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
    const { purpose, event = {}, events = {}, vitalData = {} } = this.props;

    let initialValue = this.getNewEndDate();
    if (purpose) {
      const { eventId } = event;
      const { endDate } = events[eventId] || {};
      const actualEndDate = new moment(endDate);
      initialValue =
        actualEndDate < initialValue ? initialValue : actualEndDate;
    }

    if (vitalData) {
      const { details: { duration = null } = {} } = vitalData || {};
      if (duration) {
        initialValue = moment().add(parseInt(duration) + 1, "days");
      }
    }
    return initialValue;
  };

  calendarComp = () => {
    return (
      <div className="flex justify-center align-center">
        <img src={calendar} alt="calender icon" className="w20" />
      </div>
    );
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, getFieldError },
      disabledEndDate,
      purpose,
      vitals,
      payload: { id: vital_id, canViewDetails = false } = {},
    } = this.props;
    const { formatMessage, openCalendar, getInitialValue, calendarComp } = this;
    let { end_date = "" } = vitals[vital_id] || {};
    const value = getFieldValue(FIELD_NAME);

    const { vitalData = {} } = this.props;
    const { end_date: existing_end_date = null } = vitalData || {};
    if (existing_end_date) {
      end_date = existing_end_date;
    }

    return (
      <div className="wp100 flex align-center">
        <div className="pl8 wp100 ">
          <div className="flex row">
            <span className="form-label">To</span>
          </div>
          <FormItem className="wp100">
            {getFieldDecorator(FIELD_NAME, {
              initialValue: end_date ? moment(end_date) : getInitialValue(),
            })(
              <DatePicker
                className={`full-width ${FIELD_NAME} ant-date-custom-med wp100`}
                format="DD/MM/YYYY, ddd"
                showToday={false}
                // suffixIcon={calendarComp()}
                disabled={
                  getFieldError(repeatIntervalField.field_name) !== undefined ||
                  canViewDetails
                }
                // allowClear={false}
                disabledDate={disabledEndDate}
                getCalendarContainer={this.getParentNode}
                popupStyle={{ left: 0 }}
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

const Field = injectIntl(EndDate);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
