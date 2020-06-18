import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Spin from "antd/es/spin";
import Select from "antd/es/select";
import DatePicker from "antd/es/date-picker";
import TimePicker from "antd/es/time-picker";
import Input from "antd/es/input";
import TextArea from "antd/es/input/TextArea";

import message from "./message";
import { doRequest } from "../../../Helper/network";
import seperator from "../../../Assets/images/seperator.svg";
import moment from "moment";
import calendar from "../../../Assets/images/calendar1.svg";

const { Item: FormItem } = Form;
const { Option } = Select;

const PATIENT = "patient";
const DATE = "date";
const START_TIME = "start_time";
const END_TIME = "end_time";
const TREATMENT = "treatment";
const DESCRIPTION = "description";

const FIELDS = [PATIENT, DATE, START_TIME, END_TIME, TREATMENT, DESCRIPTION];

class AddAppointmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingPatients: false,
    };
  }

  openCalendar = (e) => {
    e.preventDefault();
    const datePicker = window.document.getElementsByClassName(DATE);

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

  fetchPatients = async (data) => {
    try {
    } catch (err) {
      console.log("err", err);
    }
  };

  getParentNode = t => t.parentNode;

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getInitialValue = () => {
    const {
      payload: { patient_id },
      patients,
    } = this.props;
    const { patients: { basic_info: { first_name, last_name } = {} } = {} } =
      patients[patient_id] || {};
    // if (first_name && last_name) {
    return `${patient_id}`;
    // } else {
    // return null;
    // }
  };

  getPatientOptions = () => {
    const { patients, payload: { patient_id } = {} } = this.props;
    const { basic_info: { first_name, middle_name, last_name } = {} } =
      patients[patient_id] || {};

    // const patientOptions = patients.map((patient) => {
    // const { first_name, last_name, id } = patient || {};
    return (
      <Option key={`p-${patient_id}`} value={patient_id} name={patient_id}>
        {`${first_name} ${middle_name ? `${middle_name} ` : ""}${
          last_name ? `${last_name} ` : ""
        }`}
      </Option>
    );
    // });

    // return patientOptions;
  };

  calendarComp = () => {
    return (
      <div className="flex justify-center align-center">
        <img src={calendar} alt="calender icon" className="w20" />
      </div>
    );
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf("day");
  };

  // onBlur = date => () => {
  //   this.adjustEventOnStartDateChange(date);
  // };



  handleDateSelect = date => () => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    console.log("312983u193812 values, value ", date);
    const startDate = getFieldValue(DATE);

    if(!date || !startDate) {
      return;
    }
    
    const eventStartTime = getFieldValue(START_TIME);
    if (date.isSame(eventStartTime, "date")) {
      return;
    }

    const eventEndTime = getFieldValue(END_TIME);

    const newMonth = startDate.get("month");
    const newDate = startDate.get("date");
    const newYear = startDate.get("year");

    let newEventStartTime;
    let newEventEndTime;

    if (eventStartTime) {
      newEventStartTime = eventStartTime
        .clone()
        .set({ month: newMonth, year: newYear, date: newDate });
    }

    if (eventEndTime) {
      newEventEndTime = eventEndTime
        .clone()
        .set({ month: newMonth, year: newYear, date: newDate });
    }

    setFieldsValue({ [START_TIME]: newEventStartTime, [END_TIME]: newEventEndTime });
  };

  handleStartTimeChange = (time, str) => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    console.log("312983u193812 values, value ", time, str);
    const startTime = getFieldValue(START_TIME);
    console.log("298467232894 moment(startTime).add(1, h) ", moment(startTime), moment(startTime).add(1, "h"));
    setFieldsValue({ [END_TIME]: moment(time).add(1, "h") });
  };

  getPatientName = () => {
    const { patients, payload: { patient_id } = {} } = this.props;
    const { basic_info: { first_name, middle_name, last_name } = {} } =
      patients[patient_id] || {};
    return `${first_name} ${middle_name ? `${middle_name} ` : ""}${
      last_name ? `${last_name} ` : ""
    }`;
  };

  calendarComp = () => {
    return (
      <div className="flex justify-center align-center">
        <img src={calendar} alt="calender icon" className="w20" />
      </div>
    );
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf("day");
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue },
    } = this.props;
    const { fetchingPatients } = this.state;
    const {
      formatMessage,
      getInitialValue,
      getPatientOptions,
      calendarComp,
      disabledDate,
      handleDateSelect,
      handleStartTimeChange,
      getPatientName,
    } = this;

    const currentDate = moment(getFieldValue(DATE));

    console.log("1289313192 ", currentDate, getFieldValue(START_TIME));

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    console.log("appointment form props --> ", this.props);
    return (
      <Form className="fw700">
        <FormItem label={formatMessage(message.patient)}>
          {getFieldDecorator(PATIENT, {
            initialValue: getInitialValue(),
          })(
            <Select
              className="user-select"
              // onSearch={fetchPatients}
              placeholder={getPatientName()}
              notFoundContent={fetchingPatients ? <Spin size="small" /> : null}
              showSearch={true}
              disabled={getInitialValue() ? true : false}
              // todo: update when patients are there
              filterOption={false}
              suffixIcon={null}
              removeIcon={null}
              clearIcon={null}
            >
              {getPatientOptions()}
            </Select>
          )}
        </FormItem>

        <FormItem
          label={formatMessage(message.start_date)}
          className="full-width ant-date-custom"
        >
          {getFieldDecorator(DATE, {
            rules: [
              {
                required: true,
                message: formatMessage(message.error_select_date),
              },
            ],
            initialValue: moment(),
          })(
            <DatePicker
              className="wp100"
              onBlur={handleDateSelect(currentDate)}
              suffixIcon={calendarComp()}
              disabledDate={disabledDate}
              // getCalendarContainer={this.getParentNode}
            />
          )}
          {/*<img*/}
          {/*  alt=""*/}
          {/*  className="calendar clickable new-calendar"*/}
          {/*  onClick={openCalendar}*/}
          {/*  src={calendar}*/}
          {/*/>*/}
        </FormItem>

        <div className="wp100 flex justify-space-evenly align-center flex-1">
          <FormItem
            label={formatMessage(message.start_time)}
            className="wp100"
            validateStatus={fieldsError[START_TIME] ? "error" : ""}
            help={fieldsError[START_TIME] || ""}
          >
            {getFieldDecorator(START_TIME, {
              rules: [
                {
                  required: true,
                  message: formatMessage(message.error_select_start_time),
                },
              ],
            })(
              <TimePicker
                use12Hours
                onChange={handleStartTimeChange}
                minuteStep={15}
                format="h:mm a"
                className="wp100 ant-time-custom"
                // getPopupContainer={this.getParentNode}
              />
            )}
          </FormItem>

          <div className="w200 text-center mt8">
            <img
              src={seperator}
              alt="between seperator"
              className="mr16 ml16"
            />
          </div>

          <FormItem
            label={formatMessage(message.end_time)}
            className="wp100"
            validateStatus={fieldsError[END_TIME] ? "error" : ""}
            help={fieldsError[END_TIME] || ""}
          >
            {getFieldDecorator(END_TIME, {
              rules: [
                {
                  required: true,
                  message: formatMessage(message.error_select_end_time),
                },
              ],
            })(
              <TimePicker
                use12Hours
                minuteStep={15}
                value={currentDate}
                format="h:mm a"
                className="wp100 ant-time-custom"
                // getPopupContainer={this.getParentNode}
              />
            )}
          </FormItem>
        </div>

        <FormItem
          label={formatMessage(message.treatment_text)}
          className="full-width ant-date-custom"
        >
          {getFieldDecorator(TREATMENT)(
            <Input
              autoFocus
              placeholder={formatMessage(message.treatment_text_placeholder)}
            />
          )}
        </FormItem>

        <FormItem
          label={formatMessage(message.description_text)}
          className="full-width ant-date-custom"
        >
          {getFieldDecorator(DESCRIPTION)(
            <TextArea
              autoFocus
              placeholder={formatMessage(message.description_text_placeholder)}
              rows={4}
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(AddAppointmentForm);
