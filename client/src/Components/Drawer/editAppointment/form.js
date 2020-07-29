import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Spin from "antd/es/spin";
import Select from "antd/es/select";
import DatePicker from "antd/es/date-picker";
import TimePicker from "antd/es/time-picker";
import Input from "antd/es/input";
import TextArea from "antd/es/input/TextArea";
import { Checkbox } from "antd";

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
const CRITICAL = 'critical';
const END_TIME = "end_time";
const TREATMENT = "treatment";
const REASON = "reason";
const APPOINTMENT_TYPE = "type";
const APPOINTMENT_TYPE_DESCRIPTION = "type_description";
const PROVIDER_ID = "provider_id";
const DESCRIPTION = "description";

const FIELDS = [PATIENT, DATE, START_TIME, END_TIME, TREATMENT, DESCRIPTION, APPOINTMENT_TYPE, APPOINTMENT_TYPE_DESCRIPTION, PROVIDER_ID];

class EditAppointmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingPatients: false,
      typeDescription: []
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
  componentDidMount = () => {
    let {
      appointments,
      appointmentData,
      payload: { id: appointment_id, patient_id } = {},
    } = this.props;

    let { basic_info: { details: { type = '' } = {} } = {} } = appointments[appointment_id] || {};

    const { schedule_data: { appointment_type = '' } = {} } = appointmentData || {};
    type = appointment_type ? appointment_type : type;
    let { type_descriptions = {} } = this.props;
    let descArray = type_descriptions[type] ? type_descriptions[type] : [];

    this.setState({ typeDescription: descArray });
  }
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
    console.log('463274834687234', current);
    // Can not select days before today and today

    return current
      && (current < moment().startOf("day")
        || current > moment().add(1, "year"));
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

  // handleStartTimeChange = (time, str) => {
  //   const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
  //   console.log("312983u193812 values, value ", time, str);
  //   const startTime = getFieldValue(START_TIME);
  //   console.log("298467232894 moment(startTime).add(1, h) ", moment(startTime), moment(startTime).add(1, "h"));
  //   setFieldsValue({ [END_TIME]: moment(time).add('minutes', 30) });
  // };

  handleStartTimeChange = (time, str) => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    console.log("312983u193812 values, value ", time, str);
    const startTime = getFieldValue(START_TIME);
    const startDate = getFieldValue(DATE);
    if (startDate) {
      const newMonth = startDate.get("month");
      const newDate = startDate.get("date");
      const newYear = startDate.get("year");
      let newEventStartTime;
      let newEventEndTime;
      newEventStartTime = time ? moment(time)
        .clone()
        .set({ month: newMonth, year: newYear, date: newDate }) : null;
      newEventEndTime = newEventStartTime ? moment(newEventStartTime).add('minutes', 30) : null;
      console.log("00000298467232894 moment(startTime).add(1, h) ", time, startTime, newEventStartTime, newEventEndTime);
      setFieldsValue({ [START_TIME]: newEventStartTime, [END_TIME]: newEventEndTime });
    } else {
      console.log("298467232894 moment(startTime).add(1, h) ", time);
      setFieldsValue({ [END_TIME]: time ? moment(time).add('minutes', 30) : null });
    }
  };

  handleEndTimeChange = (time, str) => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    console.log("312983u193812 values, value ", time, str);
    const startTime = getFieldValue(START_TIME);
    const startDate = getFieldValue(DATE);
    if (startDate) {
      const newMonth = startDate.get("month");
      const newDate = startDate.get("date");
      const newYear = startDate.get("year");
      let newEventStartTime;
      let newEventEndTime;
      newEventStartTime = startTime ? moment(startTime)
        .clone()
        .set({ month: newMonth, year: newYear, date: newDate }) : null;
      newEventEndTime = time ? time
        .clone()
        .set({ month: newMonth, year: newYear, date: newDate }) : null;
      console.log("00000298467232894 moment(startTime).add(1, h) ", time, startTime, newEventStartTime, newEventEndTime);
      setFieldsValue({ [START_TIME]: newEventStartTime, [END_TIME]: newEventEndTime });
    } else {
      console.log("298467232894 moment(startTime).add(1, h) ", moment(startTime), moment(startTime).add(1, "h"));
      setFieldsValue({ [END_TIME]: moment(time) });
    }
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

  getTreatmentOption = () => {
    let { treatments = {} } = this.props;
    let newTreatments = [];
    for (let treatment of Object.values(treatments)) {
      let { basic_info: { id = 0, name = '' } = {} } = treatment;
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

  handleTypeSelect = (value) => {
    let { type_descriptions = {} } = this.props;
    let descArray = type_descriptions[value] ? type_descriptions[value] : [];

    this.setState({ typeDescription: descArray });
  }

  getTypeOption = () => {
    let { appointment_types = {} } = this.props;
    let newTypes = [];
    for (let type of Object.keys(appointment_types)) {
      let { title = '' } = appointment_types[type] || {};
      newTypes.push(
        <Option key={type} value={type}>
          {title}
        </Option>
      )
    }
    return newTypes;
  };

  getTypeDescriptionOption = () => {


    let { typeDescription = [] } = this.state;
    let newTypes = [];
    for (let desc of typeDescription) {
      newTypes.push(
        <Option key={desc} value={desc}>
          {desc}
        </Option>
      )
    }
    return newTypes;
  };

  handleProviderSearch = (data) => {
    try {
      const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
      if (data) {

        setFieldsValue({ [PROVIDER_ID]: data });
      }
    } catch (err) {
      console.log("err", err);
      // message.warn("Something wen't wrong. Please try again later");
      // this.setState({ fetchingMedicines: false });
    }
  };

  getProviderOption = () => {
    let { providers = [],
      appointments,
      appointmentData,
      payload: { id: appointment_id } = {} } = this.props;
    let { provider_name = '' } = appointments[appointment_id] || {};

    const { provider_name: provName = '' } = appointmentData || {};
    provider_name = provName ? provName : provider_name;
    let newTypes = [];

    for (let provider of Object.values(providers)) {

      let { basic_info: { id = 0, name = '' } = {} } = provider;
      newTypes.push(
        <Option key={id} value={parseInt(id)}>
          {name}
        </Option>
      )
    }
    if (provider_name) {
      newTypes.push(
        <Option key={provider_name} value={parseInt(provider_name)}>
          {provider_name}
        </Option>
      )
    }
    return newTypes;
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
    const { fetchingPatients, typeDescription } = this.state;
    const {
      formatMessage,
      getInitialValue,
      getPatientOptions,
      calendarComp,
      disabledDate,
      handleDateSelect,
      handleStartTimeChange,
      handleEndTimeChange,
      getPatientName,
    } = this;
    let pId = patientId ? patientId.toString() : patient_id;
    let { basic_info: { description, start_date, start_time, end_time, details: { treatment_id = "", reason = '', type = '', type_description = '', critical = false } = {} } = {}, provider_id = 0, provider_name = '' } = appointments[appointment_id] || {};
    provider_id = provider_name ? provider_name : provider_id;



    console.log('7483274982349832', appointmentData);
    if (Object.values(carePlan).length) {
      let { treatment_id: newTreatment = '' } = carePlan;
      treatment_id = newTreatment;
    }
    const currentDate = moment(getFieldValue(DATE));



    const { reason: res = '', provider_id: provId = 0, provider_name: provName = '', schedule_data: { description: des = '', date: Date = '', start_time: startTime = '', end_time: endTime = '', appointment_type = '', type_description: typeDes = '', critical: critic = false } = {} } = appointmentData || {};
    description = des ? des : description;
    reason = res ? res : reason;
    type = appointment_type ? appointment_type : type;
    type_description = typeDes ? typeDes : type_description;
    provider_id = provName ? provName : provId ? provId : provider_id;
    critical = critic ? critic : critical;
    if (res) {   //toDo remove when real templates are created and handle accordingly

      let minutesToAdd = 30 - (moment().minutes()) % 30;
      start_time = startTime ? moment(startTime) : res === 'Surgery' ? moment().add('days', 18).add('minutes', minutesToAdd) : moment().add('days', 14).add('minutes', minutesToAdd);
      end_time = endTime ? moment(endTime) : res === 'Surgery' ? moment().add('days', 18).add('minutes', minutesToAdd + 30) : moment().add('days', 14).add('minutes', minutesToAdd + 30);
      start_date = Date ? moment(Date) : res === 'Surgery' ? moment().add('days', 18) : moment().add('days', 14);

    }

    if (!start_time) {
      let minutesToAdd = 30 - (moment().minutes()) % 30;
      start_time = moment().add('minutes', minutesToAdd);
    }

    if (!end_time) {
      let minutesToAdd = 30 - (moment().minutes()) % 30;
      end_time = moment().add('minutes', minutesToAdd + 30);
    }

    if (!start_date) {
      let minutesToAdd = 30 - (moment().minutes()) % 30;
      start_date = moment().add('days', 2)
    }


    console.log("1289313192 ", reason, description, start_time, end_time, start_date, appointmentData);

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    return (
      <Form className="fw700 wp100 pb30">
        <FormItem
          // label={formatMessage(message.patient)}
          className='mb-24'
        >
          {getFieldDecorator(PATIENT, {
            initialValue: pId,
          })(
            <div />
            // <Select
            //   className="user-select drawer-select"
            //   // onSearch={fetchPatients}
            //   placeholder={getPatientName()}
            //   notFoundContent={fetchingPatients ? <Spin size="small" /> : 'No match found'}
            //   showSearch={true}
            //   disabled={getInitialValue() ? true : false}
            //   // todo: update when patients are there
            //   filterOption={false}
            //   suffixIcon={null}
            //   removeIcon={null}
            //   clearIcon={null}
            // >
            //   {getPatientOptions()}
            // </Select>
          )}
        </FormItem>

        <FormItem
          label={formatMessage(message.appointmentType)}
          className='mt24'
        >
          {getFieldDecorator(APPOINTMENT_TYPE, {
            rules: [
              {
                required: true,
                message: formatMessage(message.error_appointment_type),
              },
            ],
            initialValue: type ? type : null
          })(
            <Select
              className="drawer-select"
              placeholder="Choose Appointment Type"
              onSelect={this.handleTypeSelect}


            >
              {this.getTypeOption()}
            </Select>
          )}
        </FormItem>

        <FormItem
          label={formatMessage(message.appointmentTypeDescription)}
          className='mt24'
        >
          {getFieldDecorator(APPOINTMENT_TYPE_DESCRIPTION, {
            rules: [
              {
                required: true,
                message: formatMessage(message.error_appointment_type_description),
              },
            ],
            initialValue: type_description ? type_description : null
          })(
            <Select
              // onSearch={handleMedicineSearch}
              notFoundContent={'No match found'}
              className="drawer-select"
              placeholder="Choose Type Descrition"
              showSearch
              defaultActiveFirstOption={true}
              autoComplete="off"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }

            >
              {this.getTypeDescriptionOption()}
            </Select>
          )}
        </FormItem>

        <FormItem
          label={formatMessage(message.provider)}
          className='mt24'
        >
          {getFieldDecorator(PROVIDER_ID, {
            rules: [
              {
                required: true,
                message: formatMessage(message.error_provider),
              },
            ],
            initialValue: provider_id ? provider_id : null
          }
          )(
            <Select
              notFoundContent={null}
              className="drawer-select"
              placeholder="Choose Provider"
              showSearch
              // defaultActiveFirstOption={true}
              autoComplete="off"
              onSearch={this.handleProviderSearch}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }

            >
              {this.getProviderOption()}
            </Select>
          )}
        </FormItem>


        <FormItem
          className="flex-1 wp100 critical-checkbox"

        >
          {getFieldDecorator(CRITICAL, {

            valuePropName: 'checked',
            initialValue: critical
          })(
            <Checkbox className=''>Critical Appointment</Checkbox>)}
        </FormItem>


        <FormItem
          label={formatMessage(message.start_date)}
          className="full-width mt16 ant-date-custom-edit"
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
            className="flex-grow-1 mr16"
            validateStatus={fieldsError[START_TIME] ? "error" : ""}
            help={fieldsError[START_TIME] || ""}
          >
            {getFieldDecorator(START_TIME, {
              rules: [
                {
                  required: true,
                  message: formatMessage(message.error_select_start_time),
                }
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
            className="flex-grow-1"
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
                onChange={handleEndTimeChange}
                value={currentDate}
                format="h:mm a"
                className="wp100 ant-time-custom"
              // getPopupContainer={this.getParentNode}
              />
            )}
          </FormItem>
        </div>

        <FormItem
          // label={formatMessage(message.treatment_text)}
          // className="full-width ant-date-custom"
          className='mb-24'
        >
          {getFieldDecorator(TREATMENT, {
            initialValue: treatment_id ? treatment_id : null,
          })(
            <div />
            // <Input
            //   autoFocus
            //   placeholder={formatMessage(message.treatment_text_placeholder)}
            // />
            // <Select
            //   className="form-inputs-ap drawer-select"
            //   autoComplete="off"
            //   placeholder="Select Treatment"
            //   disabled={treatment_id ? true : false}
            //   // onSelect={this.setTreatment}
            //   // onDeselect={handleDeselect}
            //   suffixIcon={null}
            // >
            //   {this.getTreatmentOption()}
            // </Select>
          )}
        </FormItem>

        <FormItem
          label={formatMessage(message.purpose_text)}
          className="full-width mt16 ant-date-custom"
        >
          {getFieldDecorator(REASON, {
            rules: [
              {
                required: true,
                message: formatMessage(message.error_purpose),
              },
              {
                pattern: new RegExp(/^[a-zA-Z][a-zA-Z\s]*$/),
                message: formatMessage(message.error_valid_purpose)
              }
            ],
            initialValue: reason,
          })(
            <Input
              autoFocus
              className='mt4'
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
              className='mt4'
              maxLength={1000}
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
