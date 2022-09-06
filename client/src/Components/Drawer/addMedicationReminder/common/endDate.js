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
    const { purpose, event = {}, events = {} } = this.props;

    let initialValue = this.getNewEndDate();
    if (purpose) {
      const { eventId } = event;
      const { endDate } = events[eventId] || {};
      const actualEndDate = new moment(endDate);
      initialValue =
        actualEndDate < initialValue ? initialValue : actualEndDate;
    }

    // AKSHAY NEW CODE IMPLEMENTATIONS
    if (initialValue === undefined) {
      let newEndDate = moment(new moment()).add(6, "week");
      newEndDate = newEndDate.subtract(1, "days");
      initialValue = newEndDate;
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
      form: { getFieldDecorator, getFieldError },
      disabledEndDate,
    } = this.props;
    const { formatMessage, openCalendar, getInitialValue, calendarComp } = this;

    return (
      <div className="flex flex-grow-1 row align-items-center">
        <div className="wp100">
          <div className="flex  row mb-4">
            <span className="form-label">To</span>
          </div>
          <FormItem className="wp100">
            {getFieldDecorator(FIELD_NAME, {
              initialValue: getInitialValue(),
            })(
              <DatePicker
                className={`full-width ${FIELD_NAME} ant-date-custom-med wp100`}
                format="DD/MM/YYYY, ddd"
                showToday={false}
                // suffixIcon={calendarComp()}
                disabled={
                  getFieldError(repeatIntervalField.field_name) !== undefined
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

    // return (
    //   <div className="flex align-center">
    //     <div className="pl8 wp100">
    //       <span className="form-label">To</span>
    //       <FormItem className="wp100 mt-4">
    //         {getFieldDecorator(FIELD_NAME, {
    //           initialValue: getInitialValue()
    //         })(
    //           <DatePicker
    //             className={`full-width ${FIELD_NAME} ant-date-custom-med wp100`}
    //             format="DD/MM/YYYY, ddd"
    //             showToday={false}
    //             // suffixIcon={calendarComp()}
    //             disabled={
    //               getFieldError(repeatIntervalField.field_name) !== undefined
    //             }
    //             // allowClear={false}
    //             disabledDate={disabledEndDate}
    //             getCalendarContainer={this.getParentNode}
    //             popupStyle={{ left: 0 }}
    //           />
    //         )}
    //         {/*<img*/}
    //         {/*  alt=""*/}
    //         {/*  className="calendar clickable new-calendar"*/}
    //         {/*  onClick={openCalendar}*/}
    //         {/*  src={calendar}*/}
    //         {/*/>*/}
    //       </FormItem>
    //     </div>
    //   </div>
    // );
  }
}

const Field = injectIntl(EndDate);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
