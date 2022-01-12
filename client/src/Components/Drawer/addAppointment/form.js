import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Select from "antd/es/select";
import DatePicker from "antd/es/date-picker";
import Input from "antd/es/input";
import TextArea from "antd/es/input/TextArea";
import { Checkbox } from "antd";
import messages from "./message";
import moment from "moment";
import calendar from "../../../Assets/images/calendar1.svg";

import { ClockCircleOutlined } from "@ant-design/icons";
import Dropdown from "antd/es/dropdown";
import TimeKeeper from "react-timekeeper";
import { FAVOURITE_TYPE, MEDICAL_TEST, RADIOLOGY } from "../../../constant";
import StarOutlined from "@ant-design/icons/StarOutlined";
import StarFilled from "@ant-design/icons/StarFilled";
import Tooltip from "antd/es/tooltip";
import message from "antd/es/message";

const { Item: FormItem } = Form;
const { Option, OptGroup } = Select;

const PATIENT = "patient";
const DATE = "date";
const CRITICAL = "critical";
const START_TIME = "start_time";
const END_TIME = "end_time";
const TREATMENT = "treatment";
const DESCRIPTION = "description";
const APPOINTMENT_TYPE = "type";
const APPOINTMENT_TYPE_DESCRIPTION = "type_description";
const PROVIDER_ID = "provider_id";
const REASON = "reason";
const RADIOLOGY_TYPE = "radiology_type";

const FIELDS = [
  PATIENT,
  DATE,
  START_TIME,
  END_TIME,
  TREATMENT,
  DESCRIPTION,
  APPOINTMENT_TYPE,
  APPOINTMENT_TYPE_DESCRIPTION,
  PROVIDER_ID,
  RADIOLOGY_TYPE,
];

class AddAppointmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingPatients: false,
      fetchingTypes: false,
      typeDescription: [],
      timeModalVisible: false,
      descDropDownOpen: false,
      radiologyDropDownVisible: false,
      radiologyTypeSelected: null,
      typeDescValue: "",
    };
  }

  componentDidMount() {
    this.scrollToTop();
    this.getMedicalTestFavourites();
    this.getRadiologyFavourites();
  }

  getMedicalTestFavourites = async () => {
    try {
      const { getFavourites } = this.props;
      const MedicalTestsResponse = await getFavourites({
        type: FAVOURITE_TYPE.MEDICAL_TESTS,
      });
      const {
        status,
        statusCode,
        payload: { data = {}, message: resp_msg = "" } = {},
      } = MedicalTestsResponse || {};
      if (!status) {
        message.error(resp_msg);
      }
    } catch (error) {
      console.log("MedicalTests Get errrrorrrr ===>", error);
    }
  };

  getRadiologyFavourites = async () => {
    try {
      const { getFavourites } = this.props;
      const RadiologyResponse = await getFavourites({
        type: FAVOURITE_TYPE.RADIOLOGY,
      });
      const {
        status,
        statusCode,
        payload: { data = {}, message: resp_msg = "" } = {},
      } = RadiologyResponse || {};
      if (!status) {
        message.error(resp_msg);
      }
    } catch (error) {
      console.log("RadiologyResponse Get errrrorrrr ===>", error);
    }
  };

  scrollToTop = () => {
    let antForm = document.getElementsByClassName("Form")[0];
    let antDrawerBody = antForm.parentNode;
    let antDrawerWrapperBody = antDrawerBody.parentNode;
    antDrawerBody.scrollIntoView(true);
    antDrawerWrapperBody.scrollTop -= 200;
  };

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

  getParentNode = (t) => t.parentNode;

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getInitialValue = () => {
    const {
      payload: { patient_id },
      patients,
    } = this.props;
    const { patients: { basic_info: { first_name, last_name } = {} } = {} } =
      patients[patient_id] || {};
    return `${patient_id}`;
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
    return (
      current &&
      (current < moment().startOf("day") || current > moment().add(1, "year"))
    );
  };

  // onBlur = date => () => {
  //   this.adjustEventOnStartDateChange(date);
  // };

  handleDateSelect = (date) => () => {
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

    setFieldsValue({
      [START_TIME]: newEventStartTime,
      [END_TIME]: newEventEndTime,
    });
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
      let {
        basic_info: { patient_id: patientId = 1 },
        treatment_id = 0,
      } = carePlan;
      if (parseInt(patient_id) === parseInt(patientId)) {
        treatmentId = treatment_id;
      }
    }
    return treatmentId;
  };

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
      let { basic_info: { id = 0, name = "" } = {} } = treatment;
      newTreatments.push(
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    }
    return newTreatments;
  };

  handleTypeSelect = (value) => {
    const {
      form: { setFieldsValue } = {},
      static_templates: { appointments: { type_description = {} } = {} } = {},
    } = this.props;

    setFieldsValue({ [APPOINTMENT_TYPE_DESCRIPTION]: null });
    let descArray = type_description[value] ? type_description[value] : [];

    if (value !== RADIOLOGY) {
      this.setState({ radiologyTypeSelected: null });
    }

    this.setState({ typeDescription: descArray });
  };

  getTypeOption = () => {
    let {
      static_templates: { appointments: { appointment_type = {} } = {} } = {},
    } = this.props;
    let newTypes = [];
    for (let type of Object.keys(appointment_type)) {
      let { title = "" } = appointment_type[type] || {};
      newTypes.push(
        <Option key={type} value={type}>
          {title}
        </Option>
      );
    }
    return newTypes;
  };

  setRadiologyTypeSelected = (id) => () => {
    this.setState({ radiologyTypeSelected: `${id}` });
  };

  getOtherOptions = () => {
    const { typeDescription = [] } = this.state;

    return Object.values(typeDescription).map((description, index) => {
      return (
        <Option key={`${index}-${description}`} value={description}>
          {description}
        </Option>
      );
    });
  };

  getMedicalTestOptions = () => {
    const { typeDescription = [], descDropDownOpen = false } = this.state;

    return typeDescription.map((description) => {
      const { name, favorite_id, index } = description || {};

      return (
        <Option key={`${index}-${name}`} value={name}>
          <div className="pointer flex wp100  align-center justify-space-between">
            {name}
            {descDropDownOpen ? (
              // <Tooltip
              //   placement="topLeft"
              //   // title={favorite_id ? this.formatMessage(messages.unMarkFav) : this.formatMessage(messages.markFav)}
              // >
              <Fragment>
                {favorite_id ? (
                  <StarFilled
                    style={{ fontSize: "20px", color: "#f9c216" }}
                    onClick={this.handleremoveMedicalTestFavourites(index)}
                  />
                ) : (
                  <StarOutlined
                    style={{ fontSize: "20px", color: "#f9c216" }}
                    onClick={this.handleAddMedicalTestFavourites(index)}
                  />
                )}
              </Fragment>
            ) : // </Tooltip>
            null}
          </div>
        </Option>
      );
    });
  };

  getRadiologyOptions = () => {
    const { typeDescription = {} } = this.state;
    const { setRadiologyTypeSelected } = this;

    return Object.keys(typeDescription).map((id, index) => {
      const { name } = typeDescription[id] || {};
      return (
        <Option
          key={`${id}-${name}`}
          value={name}
          onClick={setRadiologyTypeSelected(id)}
        >
          {name}
        </Option>
      );
    });
  };

  getTypeDescriptionOption = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const { getMedicalTestOptions, getRadiologyOptions, getOtherOptions } =
      this;

    const typeValue = getFieldValue(APPOINTMENT_TYPE);

    switch (typeValue) {
      case MEDICAL_TEST:
        return getMedicalTestOptions();
      case RADIOLOGY:
        return getRadiologyOptions();
      default:
        return getOtherOptions();
    }
  };

  handleProviderSearch = (data) => {
    try {
      const { form: { setFieldsValue } = {} } = this.props;
      if (data) {
        setFieldsValue({ [PROVIDER_ID]: data });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  getProviderOption = () => {
    let { static_templates: { appointments: { providers = {} } = {} } = {} } =
      this.props;
    //AKSHAY NEW CODE IMPLEMENTATION

    let newTypes = [];
    for (let provider of Object.values(providers)) {
      let { basic_info: { id = "0", name = "" } = {} } = provider;
      if (
        name === "Self Clinic/Hospital" ||
        name === "Self" ||
        name === "Subharti Hospital"
      ) {
        newTypes.push(
          <Option key={id} value={parseInt(id)}>
            {name}
          </Option>
        );
      }
    }
    return newTypes;
  };

  getStartTime = () => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    const startTime = getFieldValue(START_TIME);
    if (startTime) {
      return moment(getFieldValue(START_TIME)).format("hh:mm A");
    } else {
      setFieldsValue({ [START_TIME]: moment(getFieldValue(START_TIME)) });
      return moment(getFieldValue(START_TIME)).format("hh:mm A");
    }
  };

  getEndTime = () => {
    const { form: { getFieldValue, setFieldsValue } = {} } = this.props;
    if (getFieldValue(END_TIME)) {
      return moment(getFieldValue(END_TIME)).format("hh:mm A");
    }
    setFieldsValue({
      [END_TIME]: moment(getFieldValue(START_TIME)).add(30, "minutes"),
    });
    return moment(getFieldValue(START_TIME))
      .add(30, "minutes")
      .format("hh:mm A");
  };

  handleTimeSelect = (type) => (time) => {
    const { form: { setFieldsValue } = {} } = this.props;
    const { hour24, minute } = time || {};
    if (type === START_TIME) {
      setFieldsValue({
        [START_TIME]: moment().hour(hour24).minute(minute),
        [END_TIME]: moment()
          .hour(hour24)
          .minute(minute + 30),
      });
    } else {
      setFieldsValue({
        [END_TIME]: moment().hour(hour24).minute(minute),
      });
    }
  };

  getTimePicker = (type) => {
    const { form: { getFieldValue } = {} } = this.props;
    const { handleTimeSelect } = this;
    let timeValue = "";
    if (type === START_TIME) {
      timeValue = getFieldValue(START_TIME);
    } else {
      timeValue = getFieldValue(END_TIME);
    }

    return (
      <TimeKeeper
        time={
          timeValue ? timeValue.format("hh:mm A") : moment().format("hh:mm A")
        }
        switchToMinuteOnHourSelect={true}
        closeOnMinuteSelect={true}
        onChange={handleTimeSelect(type)}
        // onDoneClick={doneBtn}
        doneButton={null}
        coarseMinutes={15}
      />
    );
  };

  DescDropDownVisibleChange = (open) => {
    this.setState({ descDropDownOpen: open });
  };

  handleTypeDescriptionUpdate = async () => {
    const { form: { getFieldValue } = {}, getAppointmentsDetails } = this.props;

    const response = await getAppointmentsDetails();
    const { status, payload: { data } = {} } = response || {};
    if (status === true) {
      const {
        static_templates: { appointments: { type_description = {} } = {} } = {},
      } = data || {};
      const value = getFieldValue(APPOINTMENT_TYPE) || null;
      const descArray = type_description[value] ? type_description[value] : [];

      this.setState({ typeDescription: descArray });
    }
  };

  handleAddMedicalTestFavourites = (id) => async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const { markFavourite } = this.props;
      const { handleTypeDescriptionUpdate } = this;
      const data = {
        type: FAVOURITE_TYPE.MEDICAL_TESTS,
        id,
      };

      const response = await markFavourite(data);
      const {
        status,
        statusCode,
        payload: { data: resp_data = {}, message: resp_msg = "" } = {},
      } = response;
      if (status) {
        message.success(resp_msg);
        await handleTypeDescriptionUpdate();
      } else {
        message.error(resp_msg);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  handleremoveMedicalTestFavourites = (id) => async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const { removeFavourite } = this.props;
      const { handleTypeDescriptionUpdate } = this;
      const data = {
        type: FAVOURITE_TYPE.MEDICAL_TESTS,
        typeId: id,
      };

      const response = await removeFavourite(data);
      const {
        status,
        statusCode,
        payload: { data: resp_data = {}, message: resp_msg = "" } = {},
      } = response;
      if (status) {
        message.success(resp_msg);
        await handleTypeDescriptionUpdate();
      } else {
        message.error(resp_msg);
      }
    } catch (error) {
      console.log("error", { error });
    }
  };

  getRadiologyDescriptionOptions = (items, each) => {
    const { radiologyTypeSelected = null, radiologyDropDownVisible = false } =
      this.state;

    return items.map((item, index) => {
      const { name, favorite_id } = item || {};

      return (
        <Option
          key={`${each}:${name}-radiology-type`}
          value={name}
          className="pointer flex wp100  align-center justify-space-between "
        >
          <div className="wp100 flex align-center justify-space-between">
            {radiologyDropDownVisible ? (
              <Tooltip title={name} className="ellipsis">
                {name}
              </Tooltip>
            ) : (
              <Tooltip title={name}>{name}</Tooltip>
            )}

            <div className="wp10">
              {radiologyDropDownVisible ? (
                <Tooltip
                  placement="topLeft"
                  title={
                    favorite_id
                      ? this.formatMessage(messages.unMarkFav)
                      : this.formatMessage(messages.markFav)
                  }
                >
                  {favorite_id ? (
                    <StarFilled
                      style={{ fontSize: "20px", color: "#f9c216" }}
                      onClick={this.handleremoveRadiologyFavourites(
                        favorite_id
                      )}
                    />
                  ) : (
                    <StarOutlined
                      style={{ fontSize: "20px", color: "#f9c216" }}
                      onClick={this.handleAddRadiologyFavourites({
                        id: radiologyTypeSelected,
                        sub_category_id: each,
                        selected_radiology_index: index,
                      })}
                    />
                  )}
                </Tooltip>
              ) : null}
            </div>
          </div>
        </Option>
      );
    });
  };

  getRadiologyTypeDescriptionOption = () => {
    const { radiologyTypeSelected = null } = this.state;
    const {
      static_templates: {
        appointments: { radiology_type_data = {} } = {},
      } = {},
    } = this.props;
    const radiology_type = radiology_type_data[radiologyTypeSelected];

    const { data: radiologyTypeDescription = {} } = radiology_type || {};

    return Object.keys(radiologyTypeDescription).map((id) => {
      const { items, name } = radiologyTypeDescription[id] || {};

      return (
        <OptGroup label={name} key={`${name}`}>
          {this.getRadiologyDescriptionOptions(items, id)}
        </OptGroup>
      );
    });
  };

  handleAddRadiologyFavourites =
    ({ id, sub_category_id, selected_radiology_index }) =>
    async (e) => {
      try {
        e.preventDefault();
        e.stopPropagation();
        const { markFavourite } = this.props;
        const { handleTypeDescriptionUpdate } = this;
        const data = {
          type: FAVOURITE_TYPE.RADIOLOGY,
          id,
          details: {
            sub_category_id,
            selected_radiology_index,
          },
        };

        const response = await markFavourite(data);
        const { status, payload: { message: resp_msg = "" } = {} } = response;
        if (status) {
          message.success(resp_msg);
          // this.getRadiologyFavourites();
          await handleTypeDescriptionUpdate();
        } else {
          message.error(resp_msg);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

  handleremoveRadiologyFavourites = (recordID) => async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const { removeFavouriteRecord } = this.props;
      const { handleTypeDescriptionUpdate } = this;

      const response = await removeFavouriteRecord(recordID);
      const { status, payload: { message: resp_msg = "" } = {} } = response;
      if (status) {
        message.success(resp_msg);
        await handleTypeDescriptionUpdate();
      } else {
        message.error(resp_msg);
      }
    } catch (error) {
      console.log("error", { error });
    }
  };

  RadiologyDropDownVisibleChange = (open) => {
    this.setState({ radiologyDropDownVisible: open });
  };

  handleTypeDescriptionSelect = (value) => {
    const { form: { setFieldsValue } = {} } = this.props;

    const { typeDescValue = "" } = this.state;

    if (value != typeDescValue) {
      setFieldsValue({ [RADIOLOGY_TYPE]: null });
    }

    this.setState({ typeDescValue: value });
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue },
    } = this.props;
    const { radiologyTypeSelected = null } = this.state;
    const {
      formatMessage,
      getInitialValue,
      disabledDate,
      handleDateSelect,
      getTreatment,
      getStartTime,
      getEndTime,
      getTimePicker,
    } = this;

    const currentDate = moment(getFieldValue(DATE));
    let appointmentType = getFieldValue(APPOINTMENT_TYPE) || null;

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    const typeValue = getFieldValue(APPOINTMENT_TYPE) || null;

    return (
      <Form className="fw700 wp100 pb30 Form">
        <FormItem
          // label={formatMessage(messages.patient)}
          className="mb-24"
        >
          {getFieldDecorator(PATIENT, {
            initialValue: getInitialValue(),
          })(<div />)}
        </FormItem>

        <div className="flex mt24 direction-row flex-grow-1">
          <label
            htmlFor="type"
            className="form-label"
            title={formatMessage(messages.appointmentType)}
          >
            {formatMessage(messages.appointmentType)}
          </label>

          <div className="star-red">*</div>
        </div>

        <FormItem>
          {getFieldDecorator(
            APPOINTMENT_TYPE,
            {}
          )(
            <Select
              className="drawer-select"
              placeholder={formatMessage(messages.placeholderAppointmentType)}
              onSelect={this.handleTypeSelect}
            >
              {this.getTypeOption()}
            </Select>
          )}
        </FormItem>

        {typeValue !== RADIOLOGY && (
          <Fragment>
            <div className="flex mt24 direction-row flex-grow-1">
              <label
                htmlFor="type description"
                className="form-label"
                // title={formatMessage(messages.appointmentTypeDescription)}
              >
                {formatMessage(messages.appointmentTypeDescription)}
              </label>

              <div className="star-red">*</div>
            </div>
            <FormItem>
              {getFieldDecorator(
                APPOINTMENT_TYPE_DESCRIPTION,
                {}
              )(
                <Select
                  onChange={this.handleTypeDescriptionSelect}
                  onDropdownVisibleChange={this.DescDropDownVisibleChange}
                  disabled={!appointmentType}
                  notFoundContent={"No match found"}
                  className="drawer-select"
                  placeholder={formatMessage(messages.placeholderTypeDesc)}
                  showSearch
                  defaultActiveFirstOption={true}
                  autoComplete="off"
                  optionFilterProp="children"
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  {this.getTypeDescriptionOption()}
                </Select>
              )}
            </FormItem>
          </Fragment>
        )}

        {typeValue === RADIOLOGY && (
          <Fragment>
            <div className="flex mt24 direction-row flex-grow-1">
              <label
                htmlFor="type description"
                className="form-label"
                // title={formatMessage(messages.appointmentTypeDescription)}
              >
                {typeValue === RADIOLOGY
                  ? `${formatMessage(messages.radiology)} ${formatMessage(
                      messages.appointmentTypeDescription
                    )}`
                  : formatMessage(messages.appointmentTypeDescription)}
              </label>

              <div className="star-red">*</div>
            </div>
            <FormItem>
              {getFieldDecorator(
                APPOINTMENT_TYPE_DESCRIPTION,
                {}
              )(
                <Select
                  onChange={this.handleTypeDescriptionSelect}
                  onDropdownVisibleChange={this.DescDropDownVisibleChange}
                  disabled={!appointmentType}
                  notFoundContent={"No match found"}
                  className="drawer-select"
                  placeholder={formatMessage(messages.placeholderTypeDesc)}
                  showSearch
                  defaultActiveFirstOption={true}
                  autoComplete="off"
                  optionFilterProp="children"
                  // filterOption={(input, option) =>
                  //   option.props.children
                  //     .toLowerCase()
                  //     .indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  {this.getTypeDescriptionOption()}
                </Select>
              )}
            </FormItem>

            <div className="flex mt24 direction-row flex-grow-1">
              <label htmlFor="type description" className="form-label">
                {formatMessage(messages.radiologyTypeDesc)}
              </label>

              <div className="star-red">*</div>
            </div>
            <FormItem>
              {getFieldDecorator(RADIOLOGY_TYPE, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.error_radio_type_required),
                  },
                ],
              })(
                <Select
                  onDropdownVisibleChange={this.RadiologyDropDownVisibleChange}
                  disabled={radiologyTypeSelected === null}
                  notFoundContent={"No match found"}
                  className="drawer-select"
                  placeholder={formatMessage(
                    messages.placeholderRadiologyTypeDesc
                  )}
                  showSearch
                  defaultActiveFirstOption={true}
                  autoComplete="off"
                  optionFilterProp="children"
                >
                  {this.getRadiologyTypeDescriptionOption()}
                </Select>
              )}
            </FormItem>
          </Fragment>
        )}

        <div className="flex mt24 direction-row flex-grow-1">
          <label
            htmlFor="provider"
            className="form-label"
            title={formatMessage(messages.provider)}
          >
            {formatMessage(messages.provider)}
          </label>

          <div className="star-red">*</div>
        </div>
        <FormItem
        // label={formatMessage(messages.provider)}
        // className='mt24'
        >
          {getFieldDecorator(
            PROVIDER_ID,
            {}
          )(
            <Select
              notFoundContent={null}
              className="drawer-select"
              placeholder={formatMessage(messages.placeholderProvider)}
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

        <FormItem className="flex-1 wp100 critical-checkbox">
          {getFieldDecorator(
            CRITICAL,
            {}
          )(<Checkbox className="">Critical Appointment</Checkbox>)}
        </FormItem>

        <div className="flex mt24 direction-row flex-grow-1 mt-6">
          <label
            htmlFor="date"
            className="form-label"
            title={formatMessage(messages.start_date)}
          >
            {formatMessage(messages.start_date)}
          </label>

          <div className="star-red">*</div>
        </div>

        <FormItem
          // label={formatMessage(messages.start_date)}
          className="full-width mt-10 ant-date-custom-ap-date"
        >
          {getFieldDecorator(DATE, {
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
        </FormItem>

        <div className="wp100 mt-6 flex justify-space-between align-center flex-1">
          <div className="flex flex-1 direction-column mr16">
            <div className="flex mt24 direction-row flex-grow-1">
              <label
                htmlFor="start_time"
                className="form-label"
                title={formatMessage(messages.start_time)}
              >
                {formatMessage(messages.start_time)}
              </label>

              <div className="star-red">*</div>
            </div>
            <FormItem
              // label={formatMessage(messages.start_time)}
              className="flex-grow-1 mt-4"
              validateStatus={fieldsError[START_TIME] ? "error" : ""}
              help={fieldsError[START_TIME] || ""}
            >
              {getFieldDecorator(
                START_TIME,
                {}
              )(
                <Dropdown overlay={getTimePicker(START_TIME)}>
                  <div className="p10 br-brown-grey br5 wp100 h50 flex align-center justify-space-between pointer">
                    <div>{getStartTime()}</div>
                    <ClockCircleOutlined />
                  </div>
                </Dropdown>
              )}
            </FormItem>
          </div>

          <div className="flex flex-1 direction-column">
            <div className="flex mt24 direction-row flex-grow-1">
              <label
                htmlFor="end_time"
                className="form-label"
                title={formatMessage(messages.end_time)}
              >
                {formatMessage(messages.end_time)}
              </label>

              <div className="star-red">*</div>
            </div>
            <FormItem
              // label={formatMessage(messages.end_time)}
              className="flex-grow-1 mt-4"
              validateStatus={fieldsError[END_TIME] ? "error" : ""}
              help={fieldsError[END_TIME] || ""}
            >
              {getFieldDecorator(
                END_TIME,
                {}
              )(
                <Dropdown overlay={getTimePicker(END_TIME)}>
                  <div className="p10 br-brown-grey br5 wp100 h50 flex align-center justify-space-between pointer">
                    <div>{getEndTime()}</div>
                    <ClockCircleOutlined />
                  </div>
                </Dropdown>
              )}
            </FormItem>
          </div>
        </div>

        <FormItem className="mb-24">
          {getFieldDecorator(TREATMENT, {
            initialValue: getTreatment(),
          })(<div />)}
        </FormItem>

        <div className="flex mt24 direction-row flex-grow-1">
          <label
            htmlFor="purpose"
            className="form-label"
            title={formatMessage(messages.purpose_text)}
          >
            {formatMessage(messages.purpose_text)}
          </label>

          <div className="star-red">*</div>
        </div>

        <FormItem
          // label={formatMessage(messages.purpose_text)}
          className="full-width ant-date-custom"
        >
          {getFieldDecorator(REASON, {
            rules: [
              {
                // pattern: new RegExp(/^[a-zA-Z][a-zA-Z\s]*$/),
                message: formatMessage(messages.error_valid_purpose),
              },
            ],
          })(
            <Input
              autoFocus
              className="mt4"
              placeholder={formatMessage(messages.purpose_text_placeholder)}
            />
          )}
        </FormItem>

        <div className="flex mt24 direction-row flex-grow-1">
          <label
            htmlFor="notes"
            className="form-label"
            title={formatMessage(messages.description_text)}
          >
            {formatMessage(messages.description_text)}
          </label>
        </div>
        <FormItem
          // label={formatMessage(messages.description_text)}
          className="full-width ant-date-custom"
        >
          {getFieldDecorator(DESCRIPTION)(
            <TextArea
              autoFocus
              className="mt4"
              maxLength={1000}
              placeholder={formatMessage(messages.description_text_placeholder)}
              rows={4}
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(AddAppointmentForm);
