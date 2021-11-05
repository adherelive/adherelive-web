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
const START_TIME = "start_time";
const CRITICAL = "critical";
const END_TIME = "end_time";
const TREATMENT = "treatment";
const REASON = "reason";
const APPOINTMENT_TYPE = "type";
const APPOINTMENT_TYPE_DESCRIPTION = "type_description";
const PROVIDER_ID = "provider_id";
const DESCRIPTION = "description";
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
  RADIOLOGY_TYPE,
];

class EditAppointmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingPatients: false,
      typeDescription: [],
      descDropDownOpen: false,
      radiologyDropDownVisible: false,
      radiologyTypeSelected: null,
      typeDescValue: "",
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
    this.scrollToTop();
    let {
      appointments,
      appointmentData,
      payload: { id: appointment_id, patient_id } = {},
    } = this.props;

    let {
      basic_info: {
        details: { type = "", type_description: type_desc_initial = "" } = {},
      } = {},
    } = appointments[appointment_id] || {};

    const {
      schedule_data: {
        appointment_type = "",
        type: shedule_data_type = "",
        type_description: scheduled_data_type_desc = "",
      } = {},
      details: {
        appointment_type: details_appointment_type = "",
        type_description: details_type_desc = "",
      } = {},
    } = appointmentData || {};

    const appt_tye = appointment_type
      ? appointment_type
      : details_appointment_type;
    type = appt_tye ? appt_tye : shedule_data_type ? shedule_data_type : type;

    let {
      static_templates: {
        appointments: { radiology_type_data = {} } = {},
      } = {},
    } = this.props;

    let {
      static_templates: { appointments: { type_description = {} } = {} } = {},
    } = this.props;
    let descArray = type_description[type] ? type_description[type] : [];
    this.setState({ typeDescription: descArray });

    if (!type_desc_initial) {
      type_desc_initial = scheduled_data_type_desc
        ? scheduled_data_type_desc
        : details_type_desc;
    }

    if (type === RADIOLOGY) {
      let radiology_id = null;
      for (let each in radiology_type_data) {
        const { name = "", id = null } = radiology_type_data[each];

        if (name === type_desc_initial) {
          radiology_id = id;
          break;
        }
      }

      this.setState({
        radiologyTypeSelected: radiology_id,
      });
    }

    this.getMedicalTestFavourites();
    this.getRadiologyFavourites();
  };

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

  handleStartTimeChange = (time, str) => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    const startTime = getFieldValue(START_TIME);
    const startDate = getFieldValue(DATE);
    if (startDate) {
      const newMonth = startDate.get("month");
      const newDate = startDate.get("date");
      const newYear = startDate.get("year");
      let newEventStartTime;
      let newEventEndTime;
      newEventStartTime = time
        ? moment(time)
            .clone()
            .set({ month: newMonth, year: newYear, date: newDate })
        : null;
      newEventEndTime = newEventStartTime
        ? moment(newEventStartTime).add("minutes", 30)
        : null;
      setFieldsValue({
        [START_TIME]: newEventStartTime,
        [END_TIME]: newEventEndTime,
      });
    } else {
      setFieldsValue({
        [END_TIME]: time ? moment(time).add("minutes", 30) : null,
      });
    }
  };

  handleEndTimeChange = (time, str) => {
    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    const startTime = getFieldValue(START_TIME);
    const startDate = getFieldValue(DATE);
    if (startDate) {
      const newMonth = startDate.get("month");
      const newDate = startDate.get("date");
      const newYear = startDate.get("year");
      let newEventStartTime;
      let newEventEndTime;
      newEventStartTime = startTime
        ? moment(startTime)
            .clone()
            .set({ month: newMonth, year: newYear, date: newDate })
        : null;
      newEventEndTime = time
        ? time.clone().set({ month: newMonth, year: newYear, date: newDate })
        : null;
      setFieldsValue({
        [START_TIME]: newEventStartTime,
        [END_TIME]: newEventEndTime,
      });
    } else {
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
      let { basic_info: { id = 0, name = "" } = {} } = treatment;
      newTreatments.push(
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    }
    return newTreatments;
  };

  calendarComp = () => {
    return (
      <div className="flex justify-center align-center">
        <img src={calendar} alt="calender icon" className="w20" />
      </div>
    );
  };

  getStartTime = () => {
    const { form: { getFieldValue } = {} } = this.props;
    return moment(getFieldValue(START_TIME)).format("hh:mm A");
  };

  getEndTime = () => {
    const { form: { getFieldValue } = {} } = this.props;
    if (getFieldValue(END_TIME)) {
      return moment(getFieldValue(END_TIME)).format("hh:mm A");
    }
    return null;
  };

  handleTimeSelect = (type) => (time) => {
    const { form: { setFieldsValue } = {}, enableSubmit } = this.props;
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
    enableSubmit();
  };

  handleTypeSelect = (value) => {
    const { form: { setFieldsValue } = {} } = this.props;

    // resetFields([APPOINTMENT_TYPE_DESCRIPTION]);
    setFieldsValue({ [APPOINTMENT_TYPE_DESCRIPTION]: null });

    let {
      static_templates: { appointments: { type_description = {} } = {} } = {},
    } = this.props;
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
    const IdStr = id.toString();
    this.setState({ radiologyTypeSelected: IdStr });
    const {
      static_templates: {
        appointments: { radiology_type_data = {} } = {},
      } = {},
    } = this.props;
    // const temp = radiology_type_data[IdStr];
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
              <Tooltip
                placement="topLeft"
                // title={favorite_id ? this.formatMessage(messages.markFav) : this.formatMessage(messages.unMarkFav)}
              >
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
              </Tooltip>
            ) : null}
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
      // message.warn("Something wen't wrong. Please try again later");
      // this.setState({ fetchingMedicines: false });
    }
  };

  getProviderOption = () => {
    let {
      static_templates: { appointments: { providers = {} } = {} } = {},
      appointments,
      appointmentData,
      payload: { id: appointment_id } = {},
    } = this.props;
    let { provider_name = "" } = appointments[appointment_id] || {};

    const { provider_name: provName = "" } = appointmentData || {};
    provider_name = provName ? provName : provider_name;
    let newTypes = [];

    for (let provider of Object.values(providers)) {
      let { basic_info: { id = "0", name = "" } = {} } = provider;
      newTypes.push(
        <Option key={id} value={parseInt(id)}>
          {name}
        </Option>
      );
    }
    if (provider_name) {
      newTypes.push(
        <Option key={provider_name} value={parseInt(provider_name)}>
          {provider_name}
        </Option>
      );
    }
    return newTypes;
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

  //======================================================================================>>>>
  getRadiologyDescriptionName = (name = "") => {
    return name.length > 30 ? `${name.substring(0, 31)}..` : name;
  };

  getRadiologyDescriptionOptions = (items, each) => {
    const { radiologyTypeSelected = null, radiologyDropDownVisible = false } =
      this.state;
    const { getRadiologyDescriptionName } = this;

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

    console.log(
      "0271273819823 radiology_type_data, radiologyTypeSelected, radiology_type",
      { radiology_type_data, radiologyTypeSelected, radiology_type }
    );

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
        const {
          status,
          statusCode,
          payload: { data: resp_data = {}, message: resp_msg = "" } = {},
        } = response;
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
      const {
        status,
        statusCode,
        payload: { data: resp_data = {}, message: resp_msg = "" } = {},
      } = response;
      if (status) {
        message.success(resp_msg);
        // this.getRadiologyFavourites();
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
    const {
      form: { setFieldsValue, getFieldValue, rese } = {},
      static_templates: { appointments: { type_description = {} } = {} } = {},
    } = this.props;

    const { typeDescValue = "" } = this.state;

    if (value != typeDescValue) {
      setFieldsValue({ [RADIOLOGY_TYPE]: null });
    }

    this.setState({ typeDescValue: value });
  };

  render() {
    let {
      form: { getFieldDecorator, isFieldTouched, getFieldError, getFieldValue },

      appointments,
      appointmentData,
      patientId,
      carePlan = {},
      payload: { id: appointment_id, patient_id, canViewDetails = false } = {},
    } = this.props;
    const { radiologyTypeSelected = null } = this.state;
    // const { fetchingPatients, typeDescription } = this.state;
    const {
      formatMessage,
      disabledDate,
      handleDateSelect,
      handleStartTimeChange,
      handleEndTimeChange,
      getStartTime,
      getEndTime,
      getTimePicker,
    } = this;
    let pId = patientId ? patientId.toString() : patient_id;
    let {
      basic_info: {
        description,
        start_date,
        start_time,
        end_time,
        details: {
          radiology_type = "",
          treatment_id = "",
          reason = "",
          type = "",
          type_description = "",
          critical = false,
        } = {},
      } = {},
      provider_id = 0,
      provider_name = "",
    } = appointments[appointment_id] || {};
    provider_id = provider_name ? provider_name : provider_id;

    if (Object.values(carePlan).length) {
      let { treatment_id: newTreatment = "" } = carePlan;
      treatment_id = newTreatment;
    }
    const currentDate = moment(getFieldValue(DATE));

    let {
      reason: res = "",
      provider_id: provId = 0,
      provider_name: provName = "",
      schedule_data: {
        description: des = "",
        date: Date = "",
        start_time: startTime = "",
        end_time: endTime = "",
        appointment_type = "",
        type: schedule_data_type = "",
        type_description: typeDes = "",
        critical: critic = false,
        radiology_type: scheduled_data_radiology_type = "",
      } = {},
    } = appointmentData || {};
    description = des ? des : description;
    reason = res ? res : reason;
    type = appointment_type
      ? appointment_type
      : schedule_data_type
      ? schedule_data_type
      : type;
    type_description = typeDes ? typeDes : type_description;
    provider_id = provName ? provName : provId ? provId : provider_id;
    critical = critic ? critic : critical;
    if (res) {
      //toDo remove when real templates are created and handle accordingly

      let minutesToAdd = 30 - (moment().minutes() % 30);
      start_time = startTime
        ? moment(startTime)
        : res === "Surgery"
        ? moment().add("days", 18).add("minutes", minutesToAdd)
        : moment().add("days", 14).add("minutes", minutesToAdd);
      end_time = endTime
        ? moment(endTime)
        : res === "Surgery"
        ? moment()
            .add("days", 18)
            .add("minutes", minutesToAdd + 30)
        : moment()
            .add("days", 14)
            .add("minutes", minutesToAdd + 30);
      start_date = Date
        ? moment(Date)
        : res === "Surgery"
        ? moment().add("days", 18)
        : moment().add("days", 14);
    }

    let appt_type_desc = "";

    const { schedule_data = {} } = appointmentData || {};

    if (!radiology_type) {
      radiology_type = scheduled_data_radiology_type;
    }

    if (!type || !type_description || !schedule_data) {
      let {
        details: {
          radiology_type: radio_type = "",
          appointment_type: appt_type = "",
          type_description: appt_desc = "",
          date = "",
        } = {},
      } = appointmentData || {};
      type_description = appt_desc;
      type = appt_type;
      start_date = date;
      radiology_type = radio_type ? radio_type : radiology_type;
    }

    if (!start_time) {
      let minutesToAdd = 30 - (moment().minutes() % 30);
      start_time = moment().add("minutes", minutesToAdd);
    }

    if (!end_time) {
      let minutesToAdd = 30 - (moment().minutes() % 30);
      end_time = moment().add("minutes", minutesToAdd + 30);
    }

    if (!start_date) {
      // let minutesToAdd = 30 - (moment().minutes()) % 30;
      start_date = moment().add("days", 2);
    }

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    let appointmentType = getFieldValue(APPOINTMENT_TYPE) || null;

    const typeValue = getFieldValue(APPOINTMENT_TYPE);

    return (
      <Form className="fw700 wp100 pb30 Form">
        <FormItem
          // label={formatMessage(message.patient)}
          className="mb-24"
        >
          {getFieldDecorator(PATIENT, {
            initialValue: pId,
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

        <FormItem
        // label={formatMessage(messages.appointmentType)}
        // className='mt24'
        >
          {getFieldDecorator(APPOINTMENT_TYPE, {
            initialValue: type ? type : null,
          })(
            <Select
              className="drawer-select"
              placeholder={formatMessage(messages.placeholderAppointmentType)}
              onSelect={this.handleTypeSelect}
              autoFocus={true}
              disabled={canViewDetails}
            >
              {this.getTypeOption()}
            </Select>
          )}
        </FormItem>

        {/* //////// */}

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
            <FormItem
            // label={formatMessage(messages.appointmentTypeDescription)}
            // className='mt24'
            >
              {getFieldDecorator(APPOINTMENT_TYPE_DESCRIPTION, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      messages.error_appointment_type_description
                    ),
                  },
                ],
                initialValue: type_description ? type_description : null,
              })(
                <Select
                  onChange={this.handleTypeDescriptionSelect}
                  onDropdownVisibleChange={this.DescDropDownVisibleChange}
                  disabled={!appointmentType || canViewDetails}
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
            <FormItem
            // label={formatMessage(messages.appointmentTypeDescription)}
            // className='mt24'
            >
              {getFieldDecorator(APPOINTMENT_TYPE_DESCRIPTION, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      messages.error_appointment_type_description
                    ),
                  },
                ],
                initialValue: type_description ? type_description : null,
              })(
                <Select
                  onChange={this.handleTypeDescriptionSelect}
                  onDropdownVisibleChange={this.DescDropDownVisibleChange}
                  disabled={!appointmentType || canViewDetails}
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
                initialValue: radiology_type ? radiology_type : null,
              })(
                <Select
                  onDropdownVisibleChange={this.RadiologyDropDownVisibleChange}
                  disabled={radiologyTypeSelected === null || canViewDetails}
                  notFoundContent={"No match found"}
                  className="drawer-select radiology-type-select"
                  placeholder={formatMessage(
                    messages.placeholderRadiologyTypeDesc
                  )}
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
                  {this.getRadiologyTypeDescriptionOption()}
                </Select>
              )}
            </FormItem>
          </Fragment>
        )}

        {/* //////// */}

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
          {getFieldDecorator(PROVIDER_ID, {
            initialValue: provider_id ? provider_id : null,
          })(
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
              disabled={canViewDetails}
            >
              {this.getProviderOption()}
            </Select>
          )}
        </FormItem>

        <FormItem className="flex-1 wp100 critical-checkbox">
          {getFieldDecorator(CRITICAL, {
            valuePropName: "checked",
            initialValue: critical,
          })(
            <Checkbox disabled={canViewDetails}>
              {formatMessage(messages.criticalAppointment)}
            </Checkbox>
          )}
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
          className="full-width mt-10 ant-date-custom-edit"
        >
          {getFieldDecorator(DATE, {
            rules: [],
            initialValue: moment(start_date),
          })(
            <DatePicker
              className="wp100"
              onBlur={handleDateSelect(currentDate)}
              // suffixIcon={calendarComp()}
              disabledDate={disabledDate}
              disabled={canViewDetails}
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
              {getFieldDecorator(START_TIME, {
                initialValue: moment(start_time),
              })(
                // <TimePicker
                //   use12Hours
                //   onChange={handleStartTimeChange}
                //   minuteStep={15}
                //   format="h:mm a"
                //   className="wp100 ant-time-custom"
                // // getPopupContainer={this.getParentNode}
                // />
                <Dropdown
                  overlay={getTimePicker(START_TIME)}
                  disabled={canViewDetails}
                >
                  <div
                    className={`p10 br-brown-grey br5 wp100 h50 flex align-center justify-space-between pointer ${
                      canViewDetails ? "disabled-field-form" : null
                    } `}
                  >
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
              {getFieldDecorator(END_TIME, {
                initialValue: moment(end_time),
              })(
                // <TimePicker
                //   use12Hours
                //   minuteStep={15}
                //   onChange={handleEndTimeChange}
                //   format="h:mm a"
                //   className="wp100 ant-time-custom"
                // // getPopupContainer={this.getParentNode}
                // />
                <Dropdown
                  overlay={getTimePicker(END_TIME)}
                  disabled={canViewDetails}
                >
                  <div
                    className={`p10 br-brown-grey br5 wp100 h50 flex align-center justify-space-between pointer ${
                      canViewDetails ? "disabled-field-form" : null
                    } `}
                  >
                    <div>{getEndTime()}</div>
                    <ClockCircleOutlined />
                  </div>
                </Dropdown>
              )}
            </FormItem>
          </div>
        </div>

        <FormItem
          // label={formatMessage(messages.treatment_text)}
          // className="full-width ant-date-custom"
          className="mb-24"
        >
          {getFieldDecorator(TREATMENT, {
            initialValue: treatment_id ? treatment_id : null,
          })(
            <div />
            // <Input
            //   autoFocus
            //   placeholder={formatMessage(messages.treatment_text_placeholder)}
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
            initialValue: reason,
          })(
            <Input
              autoFocus
              className="mt4"
              placeholder={formatMessage(messages.purpose_text_placeholder)}
              disabled={canViewDetails}
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
          {getFieldDecorator(DESCRIPTION, {
            initialValue: description,
          })(
            <TextArea
              autoFocus
              className="mt4"
              maxLength={1000}
              placeholder={formatMessage(messages.description_text_placeholder)}
              rows={4}
              disabled={canViewDetails}
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(EditAppointmentForm);
