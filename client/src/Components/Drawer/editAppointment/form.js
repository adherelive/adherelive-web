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
const REASON = "reason";
const DESCRIPTION = "description";

const FIELDS = [PATIENT, DATE, START_TIME, END_TIME, TREATMENT, DESCRIPTION];

class EditAppointmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingPatients: false,
    };
  }

  // openCalendar = (e) => {
  //   e.preventDefault();
  //   const datePicker = window.document.getElementsByClassName(DATE);

  //   if (datePicker) {
  //     const firstChild = datePicker.firstChild;
  //     if (firstChild) {
  //       const datePickerInput = firstChild.firstChild;
  //       if (datePicker && datePickerInput.click) {
  //         datePickerInput.click();
  //       }
  //     }
  //   }
  // };

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
      patientId,
      payload: { patient_id },
      patients,
    } = this.props;
    let pId = patientId ? patientId.toString() : patient_id;
    const { patients: { basic_info: { first_name, last_name } = {} } = {} } =
      patients[pId] || {};
    // if (first_name && last_name) {
    return `${pId}`;
    // } else {
    // return null;
    // }
  };

  getPatientOptions = () => {
    const { patientId, patients, payload: { patient_id } = {} } = this.props;

    let pId = patientId ? patientId.toString() : patient_id;
    const { basic_info: { first_name, middle_name, last_name } = {} } =
      patients[pId] || {};

    // const patientOptions = patients.map((patient) => {
    // const { first_name, last_name, id } = patient || {};
    return (
      <Option key={`p-${pId}`} value={pId} name={pId}>
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

    if (!date || !startDate) {
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
    setFieldsValue({ [END_TIME]: moment(time).add('minutes', 30) });
  };

  getPatientName = () => {
    const { patientId, patients, payload: { patient_id } = {} } = this.props;

    let pId = patientId ? patientId.toString() : patient_id;
    const { basic_info: { first_name, middle_name, last_name } = {} } =
      patients[pId] || {};
    return `${first_name} ${middle_name ? `${middle_name} ` : ""}${
      last_name ? `${last_name} ` : ""
      }`;
  };

  getTreatmentOption =()=>{
    let {treatments={}}=this.props;
    let newTreatments=[];
    for (let treatment of Object.values(treatments)){
        let{basic_info:{id=0,name=''}={}}=treatment;
        newTreatments.push(<Option key={id} value={id}>
        {name}
      </Option>)
    }
    return newTreatments;
}

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
    let {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue },
      auth,
      users,
      appointments,
      appointmentData,
      patientId,
      patients,
      carePlan = {},
      payload: { id: appointment_id, patient_id } = {},
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
    let pId = patientId ? patientId.toString() : patient_id;
    let { basic_info: { description, start_date, start_time, end_time, details: { treatment_id = "", reason = '' } = {} } = {} } = appointments[appointment_id] || {};



    if (Object.values(carePlan).length) {
      let { treatment_id: newTreatment = '' } = carePlan;
      treatment_id = newTreatment;
    }
    const currentDate = moment(getFieldValue(DATE));
    const { reason: res = '', schedule_data: { description: des = '',date:Date='',start_time:startTime='',end_time:endTime='' } = {} } = appointmentData || {};
    description = des ? des : description;
    reason = res ? res : reason;
    if (res) {   //toDo remove when real templates are created and handle accordingly

      let minutesToAdd = 30 - (moment().minutes()) % 30;
      start_time =startTime?moment(startTime): res === 'Surgery' ? moment().add('days', 18).add('minutes',minutesToAdd) : moment().add('days', 14).add('minutes',minutesToAdd);
      end_time =endTime?moment(endTime): res === 'Surgery' ? moment().add('days', 18).add('minutes',minutesToAdd+30) : moment().add('days', 14).add('minutes',minutesToAdd+30);
      start_date =Date?moment(Date): res === 'Surgery' ? moment().add('days', 18) : moment().add('days', 14);

    }
    console.log("1289313192 ",reason,description, start_time,end_time,start_date,appointmentData);

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    return (
      <Form className="fw700 wp100 pb30">
        <FormItem label={formatMessage(message.patient)}>
          {getFieldDecorator(PATIENT, {
            initialValue: pId,
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
            initialValue: moment(start_date),
          })(
            <DatePicker
              className="wp100"
              onBlur={handleDateSelect(currentDate)}
              // suffixIcon={calendarComp()}
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

        <div className="wp100 flex justify-space-between align-center flex-1">
          <FormItem
            label={formatMessage(message.start_time)}
            className="wp40"
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
              initialValue: moment(start_time),
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

          {/* <div className="w200 text-center mt8">
            <img
              src={seperator}
              alt="between seperator"
              className="mr16 ml16"
            />
          </div> */}

          <FormItem
            label={formatMessage(message.end_time)}
            className="wp40"
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
              initialValue: moment(end_time),
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
          {getFieldDecorator(TREATMENT, {
            initialValue: treatment_id,
          })(
            // <Input
            //   autoFocus
            //   placeholder={formatMessage(message.treatment_text_placeholder)}
            // />
            <Select
                    className="form-inputs-ap drawer-select"
                    // autoComplete="off"
                    placeholder="Select Treatment"
                    // onSelect={this.setTreatment}
                    // onDeselect={handleDeselect}
                    suffixIcon={null}
                  >
                    {this.getTreatmentOption()}
                  </Select>
          )}
        </FormItem>

        <FormItem
          label={formatMessage(message.purpose_text)}
          className="full-width ant-date-custom"
        >
          {getFieldDecorator(REASON, {
            initialValue: reason,
          })(
            <Input
              autoFocus
              placeholder={formatMessage(message.purpose_text_placeholder)}
            />
          )}
        </FormItem>

        <FormItem
          label={formatMessage(message.description_text)}
          className="full-width ant-date-custom"
        >
          {getFieldDecorator(DESCRIPTION, {
            initialValue: description
          })(
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

export default injectIntl(EditAppointmentForm);
