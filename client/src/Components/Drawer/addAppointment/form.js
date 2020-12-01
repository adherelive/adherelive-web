import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Select from "antd/es/select";
import DatePicker from "antd/es/date-picker";
import TimePicker from "antd/es/time-picker";
import Input from "antd/es/input";
import TextArea from "antd/es/input/TextArea";
import { Checkbox } from "antd";
import message from "./message";
import moment from "moment";
import calendar from "../../../Assets/images/calendar1.svg";

const { Item: FormItem } = Form;
const { Option } = Select;

const PATIENT = "patient";
const DATE = "date";
const CRITICAL = 'critical';
const START_TIME = "start_time";
const END_TIME = "end_time";
const TREATMENT = "treatment";
const DESCRIPTION = "description";
const APPOINTMENT_TYPE = "type";
const APPOINTMENT_TYPE_DESCRIPTION = "type_description";
const PROVIDER_ID = "provider_id";
const REASON = "reason";

const FIELDS = [PATIENT, DATE, START_TIME, END_TIME, TREATMENT, DESCRIPTION, APPOINTMENT_TYPE, APPOINTMENT_TYPE_DESCRIPTION, PROVIDER_ID];

class AddAppointmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingPatients: false,
      fetchingTypes: false,
      typeDescription: []
    };
  }
  
  componentDidMount(){
    this.scrollToTop();
  }
 
  scrollToTop = () => {
    let antForm= document.getElementsByClassName('Form')[0];
    let antDrawerBody = antForm.parentNode;
    let antDrawerWrapperBody=antDrawerBody.parentNode;
    antDrawerBody.scrollIntoView(true);
    antDrawerWrapperBody.scrollTop -= 200;
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
    return current
      && (current < moment().startOf("day")
        || current > moment().add(1, "year"));;
  };

  // onBlur = date => () => {
  //   this.adjustEventOnStartDateChange(date);
  // };



  handleDateSelect = date => () => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
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

  handleStartTimeChange = (time) => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    // const startTime = getFieldValue(START_TIME);
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
      setFieldsValue({ [START_TIME]: newEventStartTime, [END_TIME]: newEventEndTime });
    } else {
      setFieldsValue({ [END_TIME]: time ? moment(time).add('minutes', 30) : null });
    }
  };

  handleEndTimeChange = (time) => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
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
      setFieldsValue({ [START_TIME]: newEventStartTime, [END_TIME]: newEventEndTime });
    } else {
      setFieldsValue({ [END_TIME]: moment(time) });
    }
  };

  getPatientName = () => {
    const { patients, payload: { patient_id } = {} } = this.props;
    const { basic_info: { first_name, middle_name, last_name } = {} } =
      patients[patient_id] || {};
    return `${first_name} ${middle_name ? `${middle_name} ` : ""}${
      last_name ? `${last_name} ` : ""
      }`;
  };

  getTreatment = () => {
    const { payload: { patient_id } = {}, care_plans } = this.props;
    let treatmentId = 0;

    for (let carePlan of Object.values(care_plans)) {
      let { basic_info: { patient_id: patientId = 1 }, treatment_id = 0 } = carePlan;
      if (parseInt(patient_id) === parseInt(patientId)) {
        treatmentId = treatment_id;
      }
    }
    return treatmentId;
  }

  calendarComp = () => {
    return (
      <div className="flex justify-center align-center">
        <img src={calendar} alt="calender icon" className="w20" />
      </div>
    );
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

  handleTypeSelect = (value) => {

    const {
      form: { setFieldsValue } = {}
    } = this.props;

    // resetFields([APPOINTMENT_TYPE_DESCRIPTION]);
    setFieldsValue({ [APPOINTMENT_TYPE_DESCRIPTION]: null });
    let { static_templates: { appointments: { type_description = {} } = {} } = {} } = this.props;
    let descArray = type_description[value] ? type_description[value] : [];

    this.setState({ typeDescription: descArray });
  }

  getTypeOption = () => {
    let { static_templates: { appointments: { appointment_type = {} } = {} } = {} } = this.props;
    let newTypes = [];
    for (let type of Object.keys(appointment_type)) {
      let { title = '' } = appointment_type[type] || {};
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
      const { form: { setFieldsValue } = {} } = this.props;
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
    let { static_templates: { appointments: { providers = {} } = {} } = {} } = this.props;
    let newTypes = [];
    for (let provider of Object.values(providers)) {

      let { basic_info: { id = "0", name = '' } = {} } = provider;
      newTypes.push(
        <Option key={id} value={parseInt(id)}>
          {name}
        </Option>
      )
    }
    return newTypes;
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue },
    } = this.props;
    // const { fetchingPatients, typeDescription } = this.state;
    const {
      formatMessage,
      getInitialValue,
      // getPatientOptions,
      // calendarComp,
      disabledDate,
      handleDateSelect,
      handleStartTimeChange,
      handleEndTimeChange,
      // getPatientName,
      getTreatment
    } = this;

    const currentDate = moment(getFieldValue(DATE));
    let appointmentType = getFieldValue(APPOINTMENT_TYPE);


    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    return (
      <Form className="fw700 wp100 pb30 Form">
        <FormItem
          // label={formatMessage(message.patient)}
          className='mb-24'
        >
          {getFieldDecorator(PATIENT, {
            initialValue: getInitialValue(),
          })(
            <div />
            //   <Select
            //     className="user-select drawer-select"
            //     // onSearch={fetchPatients}
            //     placeholder={getPatientName()}
            //     notFoundContent={fetchingPatients ? <Spin size="small" /> : 'No match found'}
            //     showSearch={true}
            //     disabled={getInitialValue() ? true : false}
            //     // todo: update when patients are there
            //     filterOption={false}
            //     suffixIcon={null}
            //     removeIcon={null}
            //     clearIcon={null}
            //   >
            //     {getPatientOptions()}
            //   </Select>
          )}
        </FormItem>

        <div className='flex mt24 direction-row flex-grow-1'>
          <label
            htmlFor="type"
            className="form-label"
            title={formatMessage(message.appointmentType)}
          >
            {formatMessage(message.appointmentType)}
          </label>

          <div className="star-red">*</div>
        </div>

        <FormItem
        // label={formatMessage(message.appointmentType)}
        // className='mt24'
        >
          {getFieldDecorator(APPOINTMENT_TYPE, {
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

        <div className='flex mt24 direction-row flex-grow-1'>
          <label
            htmlFor="type description"
            className="form-label"
            // title={formatMessage(message.appointmentTypeDescription)}
          >
            {formatMessage(message.appointmentTypeDescription)}
          </label>

          <div className="star-red">*</div>
        </div>
        <FormItem
        // label={formatMessage(message.appointmentTypeDescription)}
        // className='mt24'
        >
          {getFieldDecorator(APPOINTMENT_TYPE_DESCRIPTION, {
          })(
            <Select
              disabled={!appointmentType}
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

        <div className='flex mt24 direction-row flex-grow-1'>
          <label
            htmlFor="provider"
            className="form-label"
            title={formatMessage(message.provider)}
          >
            {formatMessage(message.provider)}
          </label>

          <div className="star-red">*</div>
        </div>
        <FormItem
        // label={formatMessage(message.provider)}
        // className='mt24'
        >
          {getFieldDecorator(PROVIDER_ID, {
          })(
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
          })(
            <Checkbox className=''>Critical Appointment</Checkbox>)}
        </FormItem>

        <div className='flex mt24 direction-row flex-grow-1 mt-6'>
          <label
            htmlFor="date"
            className="form-label"
            title={formatMessage(message.start_date)}
          >
            {formatMessage(message.start_date)}
          </label>

          <div className="star-red">*</div>
        </div>

        <FormItem
          // label={formatMessage(message.start_date)}
          className="full-width mt-10 ant-date-custom-ap-date"
        >
          {getFieldDecorator(DATE, {
            // rules: [
            //   {
            //     required: true,
            //     message: formatMessage(message.error_select_date),
            //   },
            // ],
            initialValue: moment(),
          })(
            <DatePicker
              className="wp100 h53"
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

        <div className="wp100 mt-6 flex justify-space-between align-center flex-1">
          <div className='flex flex-1 direction-column mr16'>
            <div className='flex mt24 direction-row flex-grow-1'>
              <label
                htmlFor="start_time"
                className="form-label"
                title={formatMessage(message.start_time)}
              >
                {formatMessage(message.start_time)}
              </label>

              <div className="star-red">*</div>
            </div>
            <FormItem
              // label={formatMessage(message.start_time)}
              className="flex-grow-1 mt-4"
              validateStatus={fieldsError[START_TIME] ? "error" : ""}
              help={fieldsError[START_TIME] || ""}
            >
              {getFieldDecorator(START_TIME, {
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
          </div>

          <div className='flex flex-1 direction-column'>
            <div className='flex mt24 direction-row flex-grow-1'>
              <label
                htmlFor="end_time"
                className="form-label"
                title={formatMessage(message.end_time)}
              >
                {formatMessage(message.end_time)}
              </label>

              <div className="star-red">*</div>
            </div>
            <FormItem
              // label={formatMessage(message.end_time)}
              className="flex-grow-1 mt-4"
              validateStatus={fieldsError[END_TIME] ? "error" : ""}
              help={fieldsError[END_TIME] || ""}
            >
              {getFieldDecorator(END_TIME, {
              })(
                <TimePicker
                  use12Hours
                  minuteStep={15}
                  onChange={handleEndTimeChange}
                  format="h:mm a"
                  className="wp100 ant-time-custom"
                // getPopupContainer={this.getParentNode}
                />
              )}
            </FormItem>
          </div>
        </div>

        <FormItem
          // label={formatMessage(message.treatment_text)}
          // className="full-width ant-date-custom"
          className='mb-24'
        >
          {getFieldDecorator(TREATMENT, {
            initialValue: getTreatment(),
          }
          )(
            <div />
            // <Select
            //   className="form-inputs-ap drawer-select"
            //   autoComplete="off"
            //   placeholder="Select Treatment"
            //   disabled={getTreatment() ? true : false}
            //   // onSelect={this.setTreatment}
            //   // onDeselect={handleDeselect}
            //   suffixIcon={null}
            // >
            //   {this.getTreatmentOption()}
            // </Select>
          )}
        </FormItem>


        <div className='flex mt24 direction-row flex-grow-1'>
          <label
            htmlFor="purpose"
            className="form-label"
            title={formatMessage(message.purpose_text)}
          >
            {formatMessage(message.purpose_text)}
          </label>

          <div className="star-red">*</div>
        </div>

        <FormItem
          // label={formatMessage(message.purpose_text)}
          className="full-width ant-date-custom"
        >
          {getFieldDecorator(REASON, {
            rules: [
              {
                pattern: new RegExp(/^[a-zA-Z][a-zA-Z\s]*$/),
                message: formatMessage(message.error_valid_purpose)
              }
            ],

          })(
            <Input
              autoFocus
              className='mt4'
              placeholder={formatMessage(message.purpose_text_placeholder)}
            />
          )}
        </FormItem>


        <div className='flex mt24 direction-row flex-grow-1'>
          <label
            htmlFor="notes"
            className="form-label"
            title={formatMessage(message.description_text)}
          >
            {formatMessage(message.description_text)}
          </label>
        </div>
        <FormItem
          // label={formatMessage(message.description_text)}
          className="full-width ant-date-custom"
        >
          {getFieldDecorator(DESCRIPTION)(
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

export default injectIntl(AddAppointmentForm);
