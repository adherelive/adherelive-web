import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import messages from "./messages";
import moment from "moment";
import DatePicker from "antd/es/date-picker";
import TextArea from "antd/es/input/TextArea";
import Input from "antd/es/input";
import Tag from "antd/es/tag";
import TimeKeeper from "react-timekeeper";
import edit_image from "../../../Assets/images/edit.svg";

const { Item: FormItem } = Form;
const { CheckableTag } = Tag;

const NAME = "name";
const REPEAT_DAYS = "repeat_days";
const START_DATE = "start_date";
const END_DATE = "end_date";
const WHAT_NOT_TO_DO = "what_not_to_do";

const FIELDS = [NAME, START_DATE, END_DATE, WHAT_NOT_TO_DO, REPEAT_DAYS];

class WorkoutFieldsFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDays: [],
      showTimeKeeper: false,
    };
  }

  componentDidMount() {
    const { payload = {} } = this.props;
    const { repeat_days = [] } = payload || {};
    const { workoutData = {}, editTemplateWorkout = null } = this.props;
    this.setState({ selectedDays: repeat_days });
    if (editTemplateWorkout) {
      const { details: { repeat_days: template_r_days = [] } = {} } =
        workoutData || {};
      this.setState({ selectedDays: template_r_days });
    }

    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    const timekeeperDiv =
      document.getElementsByClassName("react-timekeeper")[0];
    if (timekeeperDiv) {
      const flag = timekeeperDiv.contains(event.target);
      event.stopPropagation();
      if (!flag) {
        this.setState({ showTimeKeeper: false });
      }
    }
  };

  onDoneClick = (value) => {
    const { setTime } = this.props;
    const { formatted24 = null } = value;
    const time = moment(`${formatted24}`, "HH:mm A").toISOString();
    setTime(time);
  };

  viewTimeKeeper = () => {
    this.setState({ showTimeKeeper: true });
  };

  getParentNode = (t) => t.parentNode;

  formatMessage = (data) => this.props.intl.formatMessage(data);

  disabledStartDate = (current) => {
    return current && current <= moment().subtract({ day: 1 });
  };

  handleCheckDays = (tag, checked) => {
    const { selectedDays } = this.state;
    const nextSelectedTags = checked
      ? [...selectedDays, tag]
      : selectedDays.filter((t) => t !== tag);

    const newSelectedTags = checked
      ? [...selectedDays, tag]
      : selectedDays.filter((t) => t !== tag);

    this.setState({ selectedDays: newSelectedTags });
    const {
      form: { setFieldsValue, validateFields },
    } = this.props;
    setFieldsValue({ [REPEAT_DAYS]: newSelectedTags });
    validateFields();
  };

  setSameForAllDays = () => {
    const {
      form: { setFieldsValue, validateFields },
      days = [],
    } = this.props;
    this.setState({ selectedDays: days });
    setFieldsValue({ [REPEAT_DAYS]: days });
    validateFields();
  };

  unSetSameForAllDays = () => {
    const {
      form: { setFieldsValue, validateFields },
    } = this.props;
    this.setState({ selectedDays: [] });
    setFieldsValue({ [REPEAT_DAYS]: [] });
    validateFields();
  };

  getTimePicker = () => {
    const { time: state_time = "" } = this.props;
    return (
      <TimeKeeper
        time={moment(state_time).format("hh:mm A")}
        switchToMinuteOnHourSelect={true}
        closeOnMinuteSelect={false}
        onChange={this.onDoneClick}
        doneButton={null}
        coarseMinutes={15}
      />
    );
  };

  getTimeOption = () => {
    const { showTimeKeeper = false } = this.state;
    const { time = moment(), canOnlyView = false } = this.props;
    const formattedTime = time
      ? moment(time).format("hh:mm A")
      : moment().format("hh:mm A");

    return (
      <div className="fs14 fw700 mb20 ">
        {!showTimeKeeper ? (
          <div className="flex align-start wp100 mt20 mb20 ">
            <div className="flex direction-column align-center justify-center fs14 ml8">
              {formattedTime}
            </div>
            <div className="flex direction-column align-center justify-center ">
              {!canOnlyView && (
                <img
                  src={edit_image}
                  className="ml20 edit-patient-icon flex direction-column align-center justify-center pointer"
                  onClick={this.viewTimeKeeper}
                />
              )}
            </div>
          </div>
        ) : (
          this.getTimePicker()
        )}
      </div>
    );
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError },
      getWorkoutComponent,
      workoutData,
    } = this.props;

    const { selectedDays = [] } = this.state;
    let disabled = false;
    const { formatMessage, handleCheckDays, getTimeOption } = this;

    const {
      initialFormData = {},
      editTemplateWorkout = null,
      days = [],
      canOnlyView = false,
    } = this.props;
    let {
      name = "",
      start_date: str_start_date = "",
      end_date: str_end_date = null,
      not_to_do = "",
    } = initialFormData || {};
    let start_date = str_start_date ? moment(str_start_date) : moment();
    let end_date = str_end_date ? moment(str_end_date) : null;

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    if (editTemplateWorkout !== null) {
      const {
        name: template_name = "",
        total_calories: template_total_calories = 0,
        start_date: temp_start_date = null,
        end_date: temp_end_date = null,
        duration = null,
        details: { not_to_do: template_not_to_do = "" } = {},
      } = workoutData || {};

      name = template_name;
      start_date = moment();
      if (duration) {
        end_date = moment().add(parseInt(duration), "days");
      } else {
        start_date = temp_start_date ? moment(temp_start_date) : moment();
        end_date = temp_end_date ? moment(temp_end_date) : null;
      }
      not_to_do = template_not_to_do;
    }

    if (canOnlyView) {
      disabled = true;
    }

    return (
      <Form className="fw700 wp100 pb30 Form">
        <FormItem
          label={formatMessage(messages.name)}
          className="full-width mt10 ant-date-custom-ap-date "
        >
          {getFieldDecorator(NAME, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.requiredName),
              },
            ],
            initialValue: name ? name : null,
          })(
            <Input
              placeholder={this.formatMessage(messages.addWorkoutName)}
              className={"form-inputs"}
              disabled={disabled}
            />
          )}
        </FormItem>

        <div className="select-days-wrapper flex align-items-center justify-content-space-between wp100">
          <div className="repeats wp100">
            <div className="mb20 select-days-form-content">
              <div className="flex justify-space-between">
                <div className="flex">
                  <div className="star-red">*</div>
                  <span className="fs14">
                    {this.formatMessage(messages.dayOftheWeek)}
                  </span>
                </div>
                <div
                  className={`pointer ${
                    selectedDays.length === 7 ? "tab-color" : "null"
                  }`}
                  onClick={
                    !disabled
                      ? selectedDays.length === 7
                        ? this.unSetSameForAllDays
                        : this.setSameForAllDays
                      : null
                  }
                >
                  Same for all days
                </div>
              </div>
              <FormItem style={{ display: "none" }}>
                {getFieldDecorator(REPEAT_DAYS, {
                  initialValue: selectedDays.length ? selectedDays : [],
                  rules: [
                    {
                      required: true,
                      message: this.formatMessage(messages.requiredRepeatDays),
                    },
                  ],
                })(<Input disabled={disabled} />)}
              </FormItem>
              <div className="flex-shrink-1 flex justify-space-evenly select-days mt10">
                {days.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedDays.indexOf(tag) > -1}
                    onChange={
                      !disabled
                        ? (checked) => handleCheckDays(tag, checked)
                        : null
                    }
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="star-red">*</div>
          <span className="fs14">{formatMessage(messages.workoutTime)}</span>
        </div>
        {getTimeOption()}
        {getWorkoutComponent()}

        <div className="flex justify-space-between align-center flex-1">
          <div className="wp45">
            <FormItem
              label={formatMessage(messages.start_date)}
              className="flex-grow-1 full-width mt10 ant-date-custom-ap-date "
            >
              {getFieldDecorator(START_DATE, {
                // TODO: Check why moment() was used here
                // initialValue: moment(),
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.requiredStartDate),
                  },
                ],
                // TODO: Added moment() for all dates
                initialValue: moment(start_date) ? moment(start_date) : null,
              })(
                <DatePicker
                  className="wp100 h53"
                  disabledDate={this.disabledStartDate}
                  disabled={disabled}
                />
              )}
            </FormItem>
          </div>

          <div className="wp45">
            <FormItem
              label={formatMessage(messages.end_date)}
              className="flex-grow-1 full-width mt10 ant-date-custom-ap-date  "
            >
              {getFieldDecorator(END_DATE, {
                initialValue: end_date ? end_date : null,
              })(
                <DatePicker
                  className="wp100 h53"
                  disabledDate={this.disabledStartDate}
                  disabled={disabled}
                />
              )}
            </FormItem>
          </div>
        </div>
        <FormItem
          label={formatMessage(messages.what_not_to_do)}
          className="full-width mt10 ant-date-custom-ap-date  "
        >
          {getFieldDecorator(WHAT_NOT_TO_DO, {
            initialValue: not_to_do ? not_to_do : null,
          })(<TextArea className="mb20" disabled={disabled} />)}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(WorkoutFieldsFrom);
