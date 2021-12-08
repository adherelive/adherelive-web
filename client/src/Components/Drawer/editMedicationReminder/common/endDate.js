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
    const {
      purpose,
      event = {},
      events = {},
      medications,
      medicationData = {},
      payload: { id: medication_id } = {},
    } = this.props;

    const { basic_info: { end_date } = {} } = medications[medication_id] || {};
    const {
      schedule_data: { end_date: endDate = "", duration } = {},
      templatePage = false,
    } = medicationData || {};

    let initialValue = this.getNewEndDate();
    if (purpose) {
      const { eventId } = event;
      const { endDate } = events[eventId] || {};
      const actualEndDate = new moment(endDate);
      return actualEndDate < initialValue ? initialValue : actualEndDate;
    }

    let finalEndDate = moment(end_date).clone();

    if (Object.keys(medicationData).length) {
      finalEndDate = endDate ? endDate : moment().add(7, "days");

      if (duration) {
        finalEndDate = moment().add(parseInt(duration), "days");
      }
    }

    return finalEndDate;
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
      form: { getFieldDecorator, getFieldError, getFieldValue },
      disabledEndDate,
      // medications,
      // medicationData = {},
      // payload: { id: medication_id } = {}
      payload: { canViewDetails = false } = {},
    } = this.props;
    const { formatMessage, openCalendar, getInitialValue, calendarComp } = this;

    // const { basic_info: { end_date } = {} } = medications[medication_id] || {};
    // const { schedule_data: { end_date:endDate = '', duration } = {} , templatePage=false } = medicationData || {} ;

    // let finalEndDate = moment(end_date).clone();

    // if (Object.keys(medicationData).length) {
    //   finalEndDate = endDate ? endDate : moment().add(7, 'days');

    //   if(duration) {
    //     finalEndDate = moment().add((parseInt(duration)) - 1,'days');
    //   }
    // }

    // if(medicationData && templatePage){
    //   if(duration){
    //     finalEndDate = moment().add((parseInt(duration)),'days');
    //   }else if(duration === null){
    //     finalEndDate = null;
    //   }

    // }

    console.log("918371723 getFieldValue", {
      value: getFieldValue(FIELD_NAME),
    });

    return (
      <div className="flex flex-grow-1 row align-items-center">
        <div className="pl8 wp100">
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
